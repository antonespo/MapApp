import { HttpHeaders, HttpClient } from '@angular/common/http';
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
  private baseUrl = 'https://localhost:44352/api/layer/';

  constructor(private http: HttpClient) {}

  private async httpPost(relativePath: string, feature: any) {
    var header = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8')
      .set('Authorization', 'Bearer ' + this.token);

    const res = await this.http
      .post(this.baseUrl + relativePath, JSON.stringify(feature), {
        headers: header,
      })
      .toPromise();
  }

  async postFeature(event: any) {
    var feature = event.layer;
    switch (event.layerType) {
      case 'polyline':
        var polyline = new PolylineDto();
        polyline.latLngs = this.toLatLngs(feature._latlngs);
        await this.httpPost('polyline', polyline);
        console.log(polyline);
        break;
      case 'polygon':
        var polygon = new PolygonDto();
        polygon.latLngs = this.toLatLngs(feature._latlngs[0]);
        await this.httpPost('polygon', polygon);
        console.log(polygon);
        break;
      case 'rectangle':
        var rectangle = new RectangleDto();
        rectangle.latLngs = this.toLatLngs(feature._latlngs[0]);
        await this.httpPost('rectangle', rectangle);
        console.log(rectangle);
        break;
      case 'circle':
        var circle = new CircleDto();
        circle.latLng = this.toLatLng(feature._latlng);
        circle.radius = feature._mRadius;
        await this.httpPost('circle', circle);
        console.log(circle);
        break;
      case 'marker':
        var marker = new MarkerDto();
        marker.latLng = this.toLatLng(feature._latlng);
        await this.httpPost('marker', marker);
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
