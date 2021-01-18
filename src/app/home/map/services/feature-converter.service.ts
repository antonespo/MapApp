import { Injectable } from '@angular/core';
import { LatLng } from 'leaflet';
import {
  CircleDto,
  LatLngDto,
  PolylineDto,
  MarkerDto,
  PolygonDto,
  RectangleDto,
} from './../model/feature.model';

@Injectable({
  providedIn: 'root',
})
export class FeatureConverterService {
  private token =
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJMT0lfVXNlciIsIm5iZiI6MTYxMDk3MzIzMywiZXhwIjoxNjExNTc4MDMzLCJpYXQiOjE2MTA5NzMyMzN9.MbOYLAzLp8lzARz49Whl9wJOF9x0ewtDm1UIb4yimETCSI0b-wdP9PE3MSZO5X_yv9lp97vEcPwZ3ZjmQBfQzA';
  private baseUrl = 'https://localhost:44352/api/';

  constructor() {}

  async postFeature(event: any) {
    var feature = event.layer;
    switch (event.layerType) {
      case 'polyline':
        var polyline = new PolylineDto();
        polyline.latLngs = this.toLatLngs(feature._latlngs);
        console.log(polyline);
        break;
      case 'polygon':
        var polygon = new PolygonDto();
        polygon.latLngs = this.toLatLngs(feature._latlngs[0]);
        console.log(polygon);
        break;
      case 'rectangle':
        var rectangle = new RectangleDto();
        rectangle.latLngs = this.toLatLngs(feature._latlngs[0]);
        console.log(rectangle);
        break;
      case 'circle':
        var circle = new CircleDto();
        circle.latLng = this.toLatLng(feature._latlng);
        circle.radius = feature._mRadius;
        console.log(circle);
        break;
      case 'marker':
        var marker = new MarkerDto();
        marker.latLng = this.toLatLng(feature._latlng);
        console.log(marker);
        break;
      default:
        break;
    }
  }

  private toLatLngs(latLngs: LatLng[]) {
    var latLngsDto: LatLngDto[] = [];
    latLngs.forEach((latLng) => {
      latLngsDto.push(this.toLatLng(latLng));
    });
    return latLngsDto;
  }

  private toLatLng(latLng: LatLng) {
    var latLngDto = new LatLngDto();
    latLngDto.latY = latLng.lat;
    latLngDto.lngX = latLng.lng;
    return latLngDto;
  }
}
