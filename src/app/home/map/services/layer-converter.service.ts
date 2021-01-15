import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Layer, LayerType, LayerFeature } from '../model/layer.model';
import * as Leaflet from 'leaflet';
import { FeatureType } from '../model/feature.model';

@Injectable({
  providedIn: 'root',
})
export class LayerConverterService {
  private token =
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJMT0lfVXNlciIsIm5iZiI6MTYxMDM1MjYzMSwiZXhwIjoxNjEwOTU3NDMxLCJpYXQiOjE2MTAzNTI2MzF9.grvQJZnQWHCfCPfSu4fvlGh9X_CrC6-STtHi3VAbqUr35UcKB4B1qeynFKXfwjLRPRbz3wcOzwMjDmRLziTvfQ';
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
      .get<Layer[]>(this.baseUrl + 'layer', {
        headers: header,
      })
      .toPromise();
    return res;
  }

  private getFeatureType(layer: Layer) {
    var featureTypes: FeatureType[] = [];
    if (layer.circles && layer.circles.length > 0) {
      featureTypes.push(FeatureType.circle);
    }
    if (layer.rectangles && layer.rectangles.length > 0) {
      featureTypes.push(FeatureType.rectangle);
    }
    if (layer.polygons && layer.polygons.length > 0) {
      featureTypes.push(FeatureType.polygon);
    }
    if (layer.polyline && layer.polyline.length > 0) {
      featureTypes.push(FeatureType.polyline);
    }
    if (layer.markers && layer.markers.length > 0) {
      featureTypes.push(FeatureType.marker);
    }
    return featureTypes;
  }

  private getFeatures(layer: Layer) {
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
      var points: [number, number][] = [];
      layer.rectangles.forEach((rect) => {
        rect.latLngs.forEach((latLng) => {
          points.push([latLng.latY, latLng.lngX]);
        });
      });
      features.push(Leaflet.rectangle(points));
    }
    if (layer.polyline && layer.polyline.length > 0) {
      var points: [number, number][] = [];
      layer.polyline.forEach((polyline) => {
        polyline.latLngs.forEach((latLng) => {
          points.push([latLng.latY, latLng.lngX]);
        });
      });
      features.push(Leaflet.polyline(points));
    }
    if (layer.polygons && layer.polygons.length > 0) {
      var points: [number, number][] = [];
      layer.polygons.forEach((polygon) => {
        polygon.latLngs.forEach((latLng) => {
          points.push([latLng.latY, latLng.lngX]);
        });
      });
      features.push(Leaflet.polygon(points));
    }
    return features;
  }

  private layerConverter(layers: Layer[]) {
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
