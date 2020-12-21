import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import * as Leaflet from 'leaflet';
import { antPath } from 'leaflet-ant-path';
import 'leaflet-draw';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import { IMap, MapConverterService } from './../services/map-converter.service';

export interface ILayer {
  layerName: string;
  enabled: boolean;
  editable: boolean;
  featureTypes: FeatureType[];
  color: string;
  features: (Leaflet.Path | Leaflet.Marker)[];
}

export interface IMapProps {
  drawable: boolean;
  editable: boolean;
}

export enum FeatureType {
  polyline,
  polygon,
  rectangle,
  circle,
  marker,
}

interface FeatureAvailable {
  polyline?: boolean;
  polygon?: boolean;
  rectangle?: boolean;
  circle?: boolean;
  marker?: boolean;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @Input() layers: ILayer[];
  @Input() mapProps: IMapProps;
  private map: Leaflet.DrawMap;
  private editableLayer: Leaflet.FeatureGroup<any>;
  private baseMaps: Leaflet.Control.LayersObject | undefined;
  private overlays: { [key: string]: Leaflet.FeatureGroup } = {};
  private mapData: IMap;

  constructor(private service: MapConverterService) {
    this.mapData = {
      data: './../../../assets/images/defined_map.txt',
      width: 3264,
      height: 3712,
    };
  }

  async ngAfterViewInit() {
    this.initMap();
    // await this.initCustomMap();
    this.layersCreation();
    this.addLayersToMap();
    this.addFeatures();
    if (this.mapProps.drawable) this.enableDrawControl(this.mapProps.editable);
  }

  addFeatures() {
    this.layers.forEach((layer) => {
      layer.features.forEach((feature) => {
        this.addCustomFeatureSytle(feature, layer);
        feature.addTo(this.overlays[`${layer.layerName}`]);
      });
    });
  }

  addCustomFeatureSytle(feature: Leaflet.Path | Leaflet.Marker, layer: ILayer) {
    feature.bindTooltip(this.printer(feature));
    if (feature instanceof Leaflet.Path) {
      feature.options.color = layer.color;
      feature.options.weight = 5;
      feature.options.opacity = 0.6;
      feature.options.fillOpacity = 0.2;
    }
  }

  ngOnDestroy() {
    this.map.remove();
  }

  printer(layer: Leaflet.Layer) {
    switch (true) {
      case layer instanceof Leaflet.Rectangle:
        return `The <b>Rectangle coordinates</b> are: \n${(layer as Leaflet.Rectangle)
          .getLatLngs()
          .toString()
          .replace(/LatLng/g, '<br>')}`;
        break;

      case layer instanceof Leaflet.Circle:
        return `The <b>Circle coordinates</b> are: ${(layer as Leaflet.Circle)
          .getLatLng()
          .toString()
          .replace(
            /LatLng/g,
            '<br>'
          )} <br>The <b>Circle radius</b> is: <br> ${(layer as Leaflet.Circle)
          .getRadius()
          .toString()
          .replace(/LatLng/g, '<br>')}`;
        break;

      case layer instanceof Leaflet.Polygon:
        return `The <b>Polygon coordinates</b> are: ${(layer as Leaflet.Polygon)
          .getLatLngs()
          .toString()
          .replace(/LatLng/g, '<br>')}`;
        break;

      case layer instanceof Leaflet.Marker:
        return `The <b>Marker coordinates</b> are: ${(layer as Leaflet.Marker)
          .getLatLng()
          .toString()
          .replace(/LatLng/g, '<br>')}`;
        break;

      case layer instanceof Leaflet.Polyline:
        return `The <b>Polyline coordinates</b> are: ${(layer as Leaflet.Polyline)
          .getLatLngs()
          .toString()
          .replace(/LatLng/g, '<br>')}`;
        break;

      default:
        return '';
        break;
    }
  }

  initMap() {
    // openstreet tile layer and its settings
    const OpenStreet = Leaflet.tileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: 'openstreetmap',
        noWrap: true,
      }
    );

    const Google = Leaflet.tileLayer(
      'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga',
      {
        attribution: 'google',
        noWrap: true,
      }
    );

    // leaflet map init
    this.map = Leaflet.map('map', {
      maxBounds: [
        [-90, -180],
        [90, 180],
      ],
      layers: [OpenStreet],
    }).setView([41.125278, 16.866667], 17);

    const scale = Leaflet.control.scale();
    scale.addTo(this.map);
    this.baseMaps = { Google, OpenStreet };
  }

  async initCustomMap() {
    this.map = Leaflet.map('map', { crs: Leaflet.CRS.Simple, minZoom: -1 });
    var bounds = [
      [0, 0],
      [this.mapData.height, this.mapData.width],
    ] as Leaflet.LatLngBoundsExpression;
    // var imageUrl = '../../../assets/images/logistica_bosch.png';
    var imageUrl = await this.service.providePng(this.mapData);
    Leaflet.imageOverlay(imageUrl, bounds).addTo(this.map);
    this.baseMaps = undefined;
    this.map.fitBounds(bounds);
  }

  findLayerByFeature(feature: FeatureType) {
    var layer: ILayer | undefined;
    this.layers.forEach((l) => {
      if (l.featureTypes.includes(feature)) layer = l;
    });
    return layer;
  }

  listAvailableFeatures() {
    var features: FeatureAvailable = {};
    this.layers.forEach((layer) => {
      layer.featureTypes.forEach((feature) => {
        switch (feature) {
          case FeatureType.circle:
            features.circle = true;
            break;
          case FeatureType.marker:
            features.marker = true;
            break;
          case FeatureType.polygon:
            features.polygon = true;
            break;
          case FeatureType.polyline:
            features.polyline = true;
            break;
          case FeatureType.rectangle:
            features.rectangle = true;
            break;
          default:
            break;
        }
      });
    });
    return features;
  }

  layersCreation() {
    this.layers.forEach((layer) => {
      this.overlays[`${layer.layerName}`] = new Leaflet.FeatureGroup();
      if (layer.enabled) {
        this.overlays[`${layer.layerName}`].addTo(this.map);
      }
      if (layer.editable) {
        this.editableLayer = this.overlays[`${layer.layerName}`];
      }
    });
  }

  addLayersToMap() {
    const layers = Leaflet.control.layers(this.baseMaps, this.overlays, {
      collapsed: false,
      hideSingleBase: true,
    });
    layers.addTo(this.map);
  }

  createFeatureHandler() {
    this.map.on('draw:created', (e: any) => {
      var layer = e.layer;
      switch (e.layerType) {
        case 'polyline':
          var lay = this.findLayerByFeature(FeatureType.polyline);
          break;
        case 'polygon':
          var lay = this.findLayerByFeature(FeatureType.polygon);
          break;
        case 'rectangle':
          var lay = this.findLayerByFeature(FeatureType.rectangle);
          break;
        case 'circle':
          var lay = this.findLayerByFeature(FeatureType.circle);
          break;
        case 'marker':
          var lay = this.findLayerByFeature(FeatureType.marker);
          break;

        default:
          break;
      }
      if (lay) this.addCustomFeatureSytle(layer, lay);
      layer.bindTooltip(this.printer(layer));
      if (lay) layer.addTo(this.overlays[`${lay.layerName}`]);

      // alert(this.printer(layer));
    });
  }

  editFeatureHandler() {
    this.map.on('draw:edited', (e: any) => {
      let layers = e.layers;
      layers.eachLayer((layer: Leaflet.Layer) => {
        // alert(this.printer(layer));
      });
    });
  }

  createDrawObject() {
    var availableFeature = this.listAvailableFeatures();
    var draw: Leaflet.Control.DrawOptions = {};
    if (!availableFeature.circle) draw.circle = false;
    if (!availableFeature.marker) draw.marker = false;
    if (!availableFeature.polygon) draw.polygon = false;
    if (!availableFeature.polyline) draw.polyline = false;
    if (!availableFeature.rectangle) draw.rectangle = false;
    draw.circlemarker = false;
    return draw;
  }

  enableDrawControl(editMode: boolean) {
    var options: Leaflet.Control.DrawConstructorOptions;
    var edit: Leaflet.Control.EditOptions = {
      featureGroup: this.editableLayer,
    };
    var draw = this.createDrawObject();
    if (editMode) {
      options = { draw, edit };
    } else {
      options = { draw };
    }
    var drawEditControl = new Leaflet.Control.Draw(options);
    this.map.addControl(drawEditControl);
    this.createFeatureHandler();
    this.editFeatureHandler();
  }
}
