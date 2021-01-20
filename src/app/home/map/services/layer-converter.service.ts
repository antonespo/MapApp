import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LayerDto, LayerType, LayerFeature } from '../model/layer.model';
import * as Leaflet from 'leaflet';
import { FeatureType } from '../model/feature.model';

@Injectable({
  providedIn: 'root',
})
export class LayerConverterService {
  private token =
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJMT0lfVXNlciIsIm5iZiI6MTYxMDk3MzIzMywiZXhwIjoxNjExNTc4MDMzLCJpYXQiOjE2MTA5NzMyMzN9.MbOYLAzLp8lzARz49Whl9wJOF9x0ewtDm1UIb4yimETCSI0b-wdP9PE3MSZO5X_yv9lp97vEcPwZ3ZjmQBfQzA';
  private baseUrl = 'https://localhost:44352/api/';

  constructor(private http: HttpClient) {}

  async getLayerFeature() {
    const layers = await this.getLayers();
    var layerFeatures = this.layerConverter(layers);
    return layerFeatures;
  }

  private async getLayers() {
    // Con Get da server
    var header = new HttpHeaders({
      Authorization: 'Bearer ' + this.token,
    });

    const res = await this.http
      .get<LayerDto[]>(this.baseUrl + 'layer', {
        headers: header,
      })
      .toPromise();
    return res;
  }

  private getFeatureType(layer: LayerDto) {
    var featureTypes: FeatureType[] = [];
    layer.features.forEach((feature) => {
      switch (feature.featureType.toLowerCase()) {
        case FeatureType[FeatureType.circle]:
          featureTypes.push(FeatureType.circle);
          break;
        case FeatureType[FeatureType.polygon]:
          featureTypes.push(FeatureType.polygon);
          break;
        case FeatureType[FeatureType.polyline]:
          featureTypes.push(FeatureType.polyline);
          break;
        case FeatureType[FeatureType.rectangle]:
          featureTypes.push(FeatureType.rectangle);
          break;
        case FeatureType[FeatureType.marker]:
          featureTypes.push(FeatureType.marker);
          break;

        default:
          break;
      }
    });
    // if (layer.rectangles && layer.rectangles.length > 0) {
    //   featureTypes.push(FeatureType.rectangle);
    // }
    // if (layer.polygons && layer.polygons.length > 0) {
    //   featureTypes.push(FeatureType.polygon);
    // }
    // if (layer.polyline && layer.polyline.length > 0) {
    //   featureTypes.push(FeatureType.polyline);
    // }
    // if (layer.markers && layer.markers.length > 0) {
    //   featureTypes.push(FeatureType.marker);
    // }
    return featureTypes;
  }

  private getFeatures(layer: LayerDto) {
    var features: (Leaflet.Path | Leaflet.Marker<any>)[] = [];
    if (layer.circles && layer.circles.length > 0) {
      layer.circles.forEach((circle) => {
        features.push(
          Leaflet.circle([circle.latLng.latY, circle.latLng.lngX], {
            radius: circle.radius,
          })
        );
      });
    }
    if (layer.markers && layer.markers.length > 0) {
      layer.markers.forEach((marker) => {
        features.push(Leaflet.marker([marker.latLng.latY, marker.latLng.lngX]));
      });
    }
    if (layer.rectangles && layer.rectangles.length > 0) {
      layer.rectangles.forEach((rect) => {
        var points: [number, number][] = [];
        rect.latLngs.forEach((latLng) => {
          points.push([latLng.latY, latLng.lngX]);
        });
        features.push(Leaflet.rectangle(points));
      });
    }
    if (layer.polylines && layer.polylines.length > 0) {
      layer.polylines.forEach((polyline) => {
        var points: [number, number][] = [];
        polyline.latLngs.forEach((latLng) => {
          points.push([latLng.latY, latLng.lngX]);
        });
        features.push(Leaflet.polyline(points));
      });
    }
    if (layer.polygons && layer.polygons.length > 0) {
      layer.polygons.forEach((polygon) => {
        var points: [number, number][] = [];
        polygon.latLngs.forEach((latLng) => {
          points.push([latLng.latY, latLng.lngX]);
        });
        features.push(Leaflet.polygon(points));
      });
    }
    return features;
  }

  private layerConverter(layers: LayerDto[]) {
    var mapLayers: LayerFeature[] = [];
    layers.forEach((layer) => {
      var featureTypes = this.getFeatureType(layer);
      var features = this.getFeatures(layer);

      var mapLayer: LayerFeature = {
        layerName: LayerType[layer.name as keyof typeof LayerType],
        featureTypes: featureTypes,
        features: features,
      };
      mapLayers.push(mapLayer);
    });
    return mapLayers;
  }
}
