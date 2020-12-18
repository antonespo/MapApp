import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { antPath } from 'leaflet-ant-path';
import 'leaflet-draw';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';

export interface ILayer {
  layerName: string;
  enabled: boolean;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private map: Leaflet.DrawMap;
  private actualLayer: Leaflet.FeatureGroup<any>;
  private editableLayer: Leaflet.FeatureGroup<any>;
  private baseMaps: Leaflet.Control.LayersObject;
  private overlays: {
    DeliveryPoints: Leaflet.FeatureGroup<any>;
    RestrictedAreas: Leaflet.FeatureGroup<any>;
    Lanes: Leaflet.FeatureGroup<any>;
  };
  private editableLayerProp: string = 'RestrictedAreas';
  private drawEditControl: Leaflet.Control;
  public layers: ILayer[];

  constructor() {}

  ngAfterViewInit(): void {
    this.layers = [
      { layerName: 'DeliveryPoints', enabled: true },
      { layerName: 'RestrictedAreas', enabled: true },
      { layerName: 'Lanes', enabled: true },
    ];

    this.initMap();
    this.initLayers(this.layers);
    this.addDeliveryPoints();
    this.assignEditableLayer();
    this.addLayersToMap();
    this.enableDrawControl(false);
  }

  ngOnDestroy() {
    this.map.remove();
  }

  printer(layer: Leaflet.Layer) {
    switch (true) {
      case layer instanceof Leaflet.Rectangle:
        alert(
          `The Rectangle coordinates are: \n${(layer as Leaflet.Rectangle)
            .getLatLngs()
            .toString()}`
        );
        break;

      case layer instanceof Leaflet.Circle:
        alert(
          `The Circle coordinates are: \n${(layer as Leaflet.Circle)
            .getLatLng()
            .toString()} \nThe Circle radius is: \n ${(layer as Leaflet.Circle)
            .getRadius()
            .toString()}`
        );
        break;

      case layer instanceof Leaflet.Polygon:
        alert(
          `The Polygon coordinates are: \n${(layer as Leaflet.Polygon)
            .getLatLngs()
            .toString()}`
        );
        break;

      default:
        break;
    }
  }

  addDeliveryPoints() {
    var marker = Leaflet.marker([41.125278, 16.866667], {
      draggable: false,
    });
    marker.addTo(this.overlays.DeliveryPoints);
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
      'http://www.google.cn/maps/vt?lyrs=s@189&gl=tr&x={x}&y={y}&z={z}',
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
    }).setView([41.125278, 16.866667], 16);

    const scale = Leaflet.control.scale();
    scale.addTo(this.map);
    this.baseMaps = { Google, OpenStreet };
  }

  initLayers(layers: ILayer[]) {
    this.overlays = {
      DeliveryPoints: new Leaflet.FeatureGroup().addTo(this.map),
      RestrictedAreas: new Leaflet.FeatureGroup().addTo(this.map),
      Lanes: new Leaflet.FeatureGroup().addTo(this.map),
    };
    this.overlays;
    this.actualLayer = this.overlays.Lanes;
  }

  assignEditableLayer() {
    var o = this.overlays;
    const prop = this.editableLayerProp as keyof typeof o;
    this.editableLayer = this.overlays[prop];
  }

  addLayersToMap() {
    const layers = Leaflet.control.layers(this.baseMaps, this.overlays);
    layers.addTo(this.map);
  }

  createFeatureHandler() {
    this.map.on('draw:created', (e: any) => {
      switch (e.layerType) {
        case 'polyline':
          this.actualLayer = this.overlays.Lanes;
          break;
        case 'marker':
          this.actualLayer = this.overlays.DeliveryPoints;
          break;

        default:
          this.actualLayer = this.overlays.RestrictedAreas;
          break;
      }
      var layer = e.layer;
      this.actualLayer.addLayer(layer);
      this.printer(layer);
    });
  }

  editFeatureHandler() {
    this.map.on('draw:edited', (e: any) => {
      let layers = e.layers;
      layers.eachLayer((layer: Leaflet.Layer) => {
        this.printer(layer);
      });
    });
  }

  enableDrawControl(editMode: boolean) {
    this.map.zoomIn();
    var options: Leaflet.Control.DrawConstructorOptions;
    if (editMode) {
      options = {
        draw: {
          circlemarker: false,
        },
        edit: {
          featureGroup: this.editableLayer,
        },
      };
    } else {
      options = {
        draw: {
          circlemarker: false,
        },
      };
    }
    if (!this.drawEditControl) {
      this.drawEditControl = new Leaflet.Control.Draw(options);
    }
    this.map.addControl(this.drawEditControl);
    this.createFeatureHandler();
    this.editFeatureHandler();
  }

  oldStuff() {
    // const printAlert = <T>(type: T, latlng: string, radius?: string )=>{
    //   var text = `The Rectangle coordinates are: \n${latlng} \n`
    //   if()
    // }
    // map.on(Leaflet.Draw.Event.CREATED, (e: any) => {
    //   var type = e.layerType,
    //     layer = e.layer;
    //   if (type === 'marker') {
    //     // Do marker specific actions
    //   }
    //   // Do whatever else you need to. (save to db; add to map etc)
    //   map.addLayer(layer);
    // });
    // var imageUrl = '../../../assets/images/map_plant.png';
    // Leaflet.imageOverlay(
    //   imageUrl,
    //   [
    //     [0, 0],
    //     [10, 10],
    //   ],
    //   { opacity: 1 }
    // ).addTo(this.map);
    // var circle = Leaflet.circle([5, 5], {
    //   color: 'red',
    //   fillColor: '#f03',
    //   fillOpacity: 0.5,
    //   radius: 5000,
    // }).addTo(this.map);
    // circle.bindPopup('<b>Hello world!</b><br>I am a circle.').openPopup();
    // // antPath(
    // //   [
    // //     [28.6448, 77.216721],
    // //     [34.1526, 77.5771],
    // //   ],
    // //   { color: '#FF0000', weight: 5, opacity: 0.6 }
    // // ).addTo(this.map);
    // this.map = Leaflet.map('map', { crs: Leaflet.CRS.Simple, minZoom: -1 });
    // var bounds = [
    //   [0, 0],
    //   [1000, 1000],
    // ] as Leaflet.LatLngBoundsExpression;
    // var imageUrl = '../../../assets/images/map_plant.png';
    // Leaflet.imageOverlay(imageUrl, bounds).addTo(this.map);
    // this.map.fitBounds(bounds);
    // var markerPos = Leaflet.latLng([100, 100]);
    // var marker = Leaflet.marker(markerPos, {
    //   draggable: true,
    // }).addTo(this.map);
    // marker.on('drag', (e) => console.log(e));
  }
}
