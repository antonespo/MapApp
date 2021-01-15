import {
  Circle,
  FeatureType,
  Marker,
  Polygon,
  Polyline,
  Rectangle,
} from './feature.model';
import * as Leaflet from 'leaflet';

export enum LayerType {
  DeliveryPoints,
  LimitedAccessibilityAreas,
  Lanes,
}

// ricevuto da server
export class Layer {
  id: string;
  name: string;
  rectangles: Rectangle[];
  circles: Circle[];
  markers: Marker[];
  polygons: Polygon[];
  polyline: Polyline[];
}

// classe completa per poter renderizzare mappe
export class LayerFeature {
  layerName: LayerType;
  featureTypes: FeatureType[];
  features: (Leaflet.Path | Leaflet.Marker)[];
}

// classe con i settings per quel layer
export class LayerSetting {
  layerName: LayerType;
  enabled: boolean;
  editable: boolean;
  color: string;
}
