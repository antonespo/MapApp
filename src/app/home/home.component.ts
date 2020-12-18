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
      editable: true,
      features: [FeatureType.marker],
      color: '#000099',
    },
    {
      layerName: 'Restricted Areas',
      enabled: true,
      editable: false,
      features: [
        FeatureType.polygon,
        FeatureType.rectangle,
        FeatureType.circle,
      ],
      color: '#f00',
    },
    {
      layerName: 'Lanes',
      enabled: true,
      editable: false,
      features: [FeatureType.polyline],
      color: '#013220',
    },
  ];

  public mapProps: IMapProps = { drawable: true, editable: true };
  constructor() {}
}
