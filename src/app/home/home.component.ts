import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as Leaflet from 'leaflet';
import { FeatureType, ILayer, IMapProps } from './map/map.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public layers: ILayer[] = [
    {
      layerName: 'Delivery Points',
      enabled: true,
      editable: false,
      featureTypes: [FeatureType.marker],
      color: '#000099',
      features: [
        Leaflet.marker([41.1257, 16.867]),
        Leaflet.marker([41.1248, 16.8647]),
      ],
    },
    {
      layerName: 'Limited Accessibility Areas',
      enabled: true,
      editable: true,
      featureTypes: [
        FeatureType.polygon,
        FeatureType.rectangle,
        FeatureType.circle,
      ],
      color: '#006400',
      features: [
        Leaflet.circle([41.12618, 16.86775], { radius: 115 }),
        Leaflet.polygon([
          [41.126812, 16.86469],
          [41.127207, 16.8657],
          [41.126579, 16.86619],
          [41.126502, 16.864872],
        ]),
        Leaflet.rectangle([
          [41.1241, 16.8692],
          [41.12577, 16.8692],
          [41.12577, 16.8704],
          [41.1241, 16.8704],
        ]),
      ],
    },
    {
      layerName: 'Lanes',
      enabled: true,
      editable: false,
      featureTypes: [FeatureType.polyline],
      color: '#FF0000',
      features: [
        Leaflet.polyline([
          [41.12377, 16.86533],
          [41.12387, 16.86646],
          [41.12315, 16.86658],
          [41.123165, 16.86718],
        ]),
      ],
    },
  ];

  public mapProps: IMapProps = { drawable: true, editable: true };

  constructor() {}
}
