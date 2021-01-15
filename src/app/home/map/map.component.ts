import { AfterContentInit, Component, Input, OnDestroy } from '@angular/core';
import * as Leaflet from 'leaflet';
import { antPath } from 'leaflet-ant-path';
import 'leaflet-draw';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import {
  MapConverterService,
  IImageDimension,
} from './../services/map-converter.service';
import { LayerType, LayerFeature, LayerSetting } from '../model/layer.model';
import { FeatureAvailable, FeatureType } from '../model/feature.model';
import { IMapProps } from '../model/map.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterContentInit, OnDestroy {
  @Input() layerFeatures: LayerFeature[];
  @Input() layerSettings: LayerSetting[];
  @Input() mapProps: IMapProps;
  private map: Leaflet.DrawMap;
  image: string;
  imageDimension: IImageDimension = new IImageDimension();
  private editableLayer: Leaflet.FeatureGroup<any>;
  private baseMaps: Leaflet.Control.LayersObject | undefined;
  private overlays: { [key: string]: Leaflet.FeatureGroup } = {};
  loading: boolean = false;

  constructor(private mapService: MapConverterService) {}

  async getImage() {
    this.loading = true;
    this.image = await this.mapService.getPng();
    this.loading = false;
  }

  async ngAfterContentInit() {
    // Use custom map
    await this.getImage();
    this.mapService.dimension.subscribe((dimension: IImageDimension) => {
      this.imageDimension.h = dimension.h;
      this.imageDimension.w = dimension.w;

      this.initCustomMap(this.image);
      this.layersCreation();
      this.addLayersToMap();
      this.addFeatures();
      if (this.mapProps.drawable)
        this.enableDrawControl(this.mapProps.editable);
    });
    this.mapService.getDimension();
  }

  addFeatures() {
    this.layerFeatures.forEach((layer) => {
      const layerSetting = this.layerSettings.find(
        (layerSetting) => layerSetting.layerName === layer.layerName
      );
      layer.features.forEach((feature) => {
        this.addCustomFeatureSytle(feature, layerSetting!);
        feature.addTo(this.overlays[`${LayerType[layer.layerName]}`]);
      });
    });
  }

  addCustomFeatureSytle(
    feature: Leaflet.Path | Leaflet.Marker,
    layer: LayerSetting
  ) {
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

  async initCustomMap(imageUrl: string) {
    var bounds = [
      [0, 0],
      [this.imageDimension.h, this.imageDimension.w],
    ] as Leaflet.LatLngBoundsExpression;
    this.map = Leaflet.map('map', {
      crs: Leaflet.CRS.Simple,
      minZoom: -1,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
    });
    Leaflet.imageOverlay(imageUrl, bounds).addTo(this.map);
    this.baseMaps = undefined;
    this.map.fitBounds(bounds);
  }

  findLayerByFeature(feature: FeatureType) {
    var layer: LayerFeature | undefined;
    this.layerFeatures.forEach((l) => {
      if (l.featureTypes.includes(feature)) layer = l;
    });
    return layer?.layerName;
  }

  listAvailableFeatures() {
    var features: FeatureAvailable = {};
    this.layerFeatures.forEach((layer) => {
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
    this.layerSettings.forEach((layer) => {
      this.overlays[
        `${LayerType[layer.layerName]}`
      ] = new Leaflet.FeatureGroup();
      if (layer.enabled) {
        this.overlays[`${LayerType[layer.layerName]}`].addTo(this.map);
      }
      if (layer.editable) {
        this.editableLayer = this.overlays[`${LayerType[layer.layerName]}`];
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
          var layerName = this.findLayerByFeature(FeatureType.polyline);
          break;
        case 'polygon':
          var layerName = this.findLayerByFeature(FeatureType.polygon);
          break;
        case 'rectangle':
          var layerName = this.findLayerByFeature(FeatureType.rectangle);
          break;
        case 'circle':
          var layerName = this.findLayerByFeature(FeatureType.circle);
          break;
        case 'marker':
          var layerName = this.findLayerByFeature(FeatureType.marker);
          break;
        default:
          break;
      }
      if (layerName !== undefined) {
        var layerSetting: LayerSetting;
        this.layerSettings.forEach((ls) => {
          if (ls.layerName === layerName) {
            layerSetting = ls;
          }
        });
        this.addCustomFeatureSytle(layer, layerSetting!);
        layer.addTo(this.overlays[`${LayerType[layerName]}`]);
      }
      layer.bindTooltip(this.printer(layer));

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
