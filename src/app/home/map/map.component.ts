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

    var overlays = {
      Marker: Leaflet.marker([41.125278, 16.866667], {
        draggable: true,
      }),
      Marker2: Leaflet.marker([41.1, 16.866667], {
        draggable: true,
      }),
    };
    // leaflet map init
    const map = Leaflet.map('map', {
      maxBounds: [
        [-90, -180],
        [90, 180],
      ],
      layers: [OpenStreet],
    }).setView([41.125278, 16.866667], 16);

    // scale control
    const scale = Leaflet.control.scale();

    // layers control
    const baseMaps = { Google, OpenStreet };
    const layers = Leaflet.control.layers(baseMaps, overlays);

    scale.addTo(map);
    layers.addTo(map);

    var drawnItems = new Leaflet.FeatureGroup();
    map.addLayer(drawnItems);

    var drawControl = new Leaflet.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
    });
    map.addControl(drawControl);

    map.on('draw:created', function (e) {
      var layer = e.layer;
      drawnItems.addLayer(layer);
      // overlays.Marker3 = Leaflet.marker(layer.toGeoJSON().geometry.coordinates);
      // const layers = Leaflet.control.layers(baseMaps, overlays);
      // layers.addTo(map);
      console.log(JSON.stringify(layer.toGeoJSON()));
      console.log(layer.toGeoJSON());
    });

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
