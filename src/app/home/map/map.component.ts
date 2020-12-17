import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { antPath } from 'leaflet-ant-path';
import 'leaflet-draw';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private map: any;

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy() {
    this.map.remove();
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
    const map = Leaflet.map('map', {
      maxBounds: [
        [-90, -180],
        [90, 180],
      ],
      layers: [OpenStreet],
    }).setView([41.125278, 16.866667], 16);

    var deliveryPoints = new Leaflet.LayerGroup([
      Leaflet.marker([41.125278, 16.866667], {
        draggable: false,
      }),
    ]);

    var drawing = new Leaflet.FeatureGroup().addTo(map);

    var overlays = {
      'Delivery points': deliveryPoints,
      'Restricted areas': drawing,
    };

    // scale control
    const scale = Leaflet.control.scale();

    // layers control
    const baseMaps = { Google, OpenStreet };
    const layers = Leaflet.control.layers(baseMaps, overlays);

    scale.addTo(map);
    layers.addTo(map);

    // var drawnItems = new Leaflet.FeatureGroup();
    // map.addLayer(drawnItems);

    var drawControl = new Leaflet.Control.Draw({
      draw: {
        circlemarker: false,
      },
      edit: {
        featureGroup: overlays['Restricted areas'],
      },
    });
    map.addControl(drawControl);

    map.on('draw:created', function (e) {
      var layer = e.layer;
      overlays['Restricted areas'].addLayer(layer);
      // console.log(JSON.stringify(layer.toGeoJSON()));
      printer(layer);
    });

    map.on('draw:edited', function (e: any) {
      let layers = e.layers;
      layers.eachLayer(function (layer: Leaflet.Layer) {
        printer(layer);
      });
    });

    const printer = (layer: Leaflet.Layer) => {
      switch (true) {
        case layer instanceof Leaflet.Rectangle:
          console.log('Rectangle');
          console.log((layer as Leaflet.Rectangle).getLatLngs().toString());
          break;

        case layer instanceof Leaflet.Circle:
          console.log('Circle');
          console.log((layer as Leaflet.Circle).getLatLng().toString());
          console.log((layer as Leaflet.Circle).getRadius().toString());
          break;

        default:
          break;
      }
    };

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
