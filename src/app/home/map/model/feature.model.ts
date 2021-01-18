export class ShapeBase {
  id: string;
}
export class LatLngDto {
  id: string;
  latY: number;
  lngX: number;
}

export class PolygonDto extends ShapeBase {
  latLngs: LatLngDto[];
}

export class RectangleDto extends ShapeBase {
  latLngs: LatLngDto[];
}

export class PolylineDto extends ShapeBase {
  latLngs: LatLngDto[];
}

export class CircleDto extends ShapeBase {
  latLng: LatLngDto;
  radius: number;
}

export class MarkerDto extends ShapeBase {
  latLng: LatLngDto;
}

export enum FeatureType {
  polyline,
  polygon,
  rectangle,
  circle,
  marker,
}

export interface FeatureAvailable {
  polyline?: boolean;
  polygon?: boolean;
  rectangle?: boolean;
  circle?: boolean;
  marker?: boolean;
}
