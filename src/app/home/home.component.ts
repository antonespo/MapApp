import { Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { LayerType, LayerFeature, LayerSetting } from './model/layer.model';
import { IMapProps } from './model/map.model';
import { LayerConverterService } from './services/layer-converter.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public layerFeatures: LayerFeature[] = [];
  public layerSettings: LayerSetting[] = [
    {
      layerName: LayerType.DeliveryPoints,
      enabled: true,
      editable: false,
      color: '#000099',
    },
    {
      layerName: LayerType.LimitedAccessibilityAreas,
      enabled: true,
      editable: true,
      color: '#8b0000',
    },
    {
      layerName: LayerType.Lanes,
      enabled: true,
      editable: false,
      color: '#013220',
    },
  ];
  public mapProps: IMapProps = { drawable: true, editable: true };

  constructor(private layerService: LayerConverterService) {}
  async ngOnInit() {
    this.layerFeatures = await this.layerService.getLayerFeature();
  }
}
