import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <map-component
      [center]="mapCenter"
      [basemap]="basemapType"
      [zoom]="mapZoomLevel"
      (mapLoadedEvent)="mapLoadedEvent($event)"
    >
    </map-component>    
  `,
  styles: []
})

export class AppComponent {
  title = 'esri-example01';
  // Set our map properties
  mapCenter = [9.847, 49.038];
  basemapType = 'streets';
  mapZoomLevel = 6;

  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }
}
