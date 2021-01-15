export class ShapeBase {
  id: string;
}
export class LatLng {
  id: string;
  latY: number;
  lngX: number;
}

export class Polygon extends ShapeBase {
  latLngs: LatLng[];
}

export class Rectangle extends ShapeBase {
  latLngs: LatLng[];
}

export class Polyline extends ShapeBase {
  latLngs: LatLng[];
}

export class Circle extends ShapeBase {
  latLng: LatLng;
  radius: number;
}

export class Marker extends ShapeBase {
  latLng: LatLng;
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
