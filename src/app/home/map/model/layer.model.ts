import {
  CircleDto,
  FeatureType,
  MarkerDto,
  PolygonDto,
  PolylineDto,
  RectangleDto,
} from './feature.model';
import * as Leaflet from 'leaflet';

export enum LayerType {
  DeliveryPoints,
  LimitedAccessibilityAreas,
  Lanes,
}

// ricevuto da server
export class LayerDto {
  id: string;
  name: string;
  features: { featureType: string }[];
  rectangles: RectangleDto[];
  circles: CircleDto[];
  markers: MarkerDto[];
  polygons: PolygonDto[];
  polylines: PolylineDto[];
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
