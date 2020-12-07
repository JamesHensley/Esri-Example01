import { prepareSyntheticListenerFunctionName } from '@angular/compiler/src/render3/util';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";

import { RecordModel } from '../Models/RecordModel';

import { loadModules } from "esri-loader";
import esri = __esri; // Esri TypeScript Types
import { Guid } from 'typescript-guid';
import { CategoryModel } from '../Models/categoryModel';
import { stringify } from 'querystring';
import * as d3 from 'd3';
import { filter } from 'esri/core/promiseUtils';

@Component({
  selector: "app-esri-map",
  templateUrl: "./esri-map.component.html",
  styleUrls: ["./esri-map.component.scss"]
})


export class EsriMapComponent implements OnInit, OnDestroy {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;
  @ViewChild("timeSliderDiv", { static: true }) private timeSliderDivEl: ElementRef;

  private _map: esri.Map;
  private _zoom = 1;
  private _center: Array<number> = [0.0, 0.0];
  private _basemap = "streets";
  private _loaded = false;
  private _view: esri.MapView = null;
  private _featLayer: esri.FeatureLayer = null;
  private _featLayerView: any; //esri.FeatureLayerView;
  public featuresOnMap: number = 0;
  public filterCategories: Array<CategoryModel> = [];

  get mapLoaded(): boolean { return this._loaded; }

  @Input()
  set zoom(zoom: number) { this._zoom = zoom; }
  get zoom(): number { return this._zoom; }

  @Input()
  set center(center: Array<number>) { this._center = center; }
  get center(): Array<number> { return this._center; }

  @Input()
  set basemap(basemap: string) { this._basemap = basemap; }
  get basemap(): string { return this._basemap; }

  constructor() {}

  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [EsriMap, EsriMapView, FeatureLayer, KmlLayer, CSVLayer, FeatureFilter, TimeSlider] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/layers/KMLLayer",
        "esri/layers/CSVLayer",
        "esri/views/layers/support/FeatureFilter",
        "esri/widgets/TimeSlider"
      ]);

      this._map = new EsriMap({ basemap: this._basemap } as esri.MapProperties);
      
      //const csvLayer = new CSVLayer({
      //  url: 'https://raw.githubusercontent.com/JamesHensley/Testing/main/Hospitals1.csv',
      //});
      //map.add(csvLayer);

      //const csvLayer = new CSVLayer({
      //  url: 'https://raw.githubusercontent.com/JamesHensley/Testing/main/NewportNewsCrimeScrape.csv'
      //});
      //map.add(csvLayer);

      //const routes = new KmlLayer({
      //  url: 'https://raw.githubusercontent.com/JamesHensley/Testing/main/RouteNetworkLinks.kml'
      //});
      //map.add(routes);

      //const counties = new KmlLayer({
      //  url: 'https://raw.githubusercontent.com/JamesHensley/Testing/main/OhioCounties.kml'
      //})
      //map.add(counties);


      /*
      const renderer = {
        type: "heatmap",
        colorStops: [
          { ratio: 0, color: "rgba(255, 255, 0, 0)" },
          { ratio: 0.1, color: "rgba(255, 220, 0, 0.6)" },
          { ratio: 0.2, color: "rgba(255, 190, 0, 0.6)" },
          { ratio: 0.3, color: "rgba(255, 160, 0, 0.6)" },
          { ratio: 0.4, color: "rgba(255, 130, 0, 0.6)" },
          { ratio: 0.5, color: "rgba(255, 100, 0, 0.61)" },
          { ratio: 0.6, color: "rgba(255, 70, 0, 0.6)" },
          { ratio: 0.7, color: "rgba(255, 40, 0, 0.6)" },
          { ratio: 0.8, color: "rgba(255, 10, 0, 0.6)" },
          { ratio: 0.9, color: "rgba(255, 0, 0, 0.6)" }
        ],
        maxPixelIntensity: 20,
        minPixelIntensity: 0
      };

      const trafficLayer = new CSVLayer({
        url: 'https://raw.githubusercontent.com/JamesHensley/Testing/main/TrafficData.csv',
        renderer: renderer
      });
      map.add(trafficLayer);
      */

      //fetch('/resources/allData.txt')
      fetch('https://raw.githubusercontent.com/JamesHensley/Esri-Example01/master/src/resources/allData.txt')
      .then(data => data.text())
      .then(data => {
        return data.split('\r\n')
          .map(d => d.length > 0 ? (JSON.parse(d) as RecordModel) : null)
          .filter(d => d && d.Longitude && d.Latitude && d.Longitude.length > 0 && d.Latitude.length > 0 && d.EventNum && d.EventNum.length > 0)
          .sort((a, b) => a.timeStamp > b.timeStamp ? -1 : ( a.timeStamp < b.timeStamp ? -1 : 0))
          .map(d => {
            d.id = Guid.create().toString();
            d.timeStamp = new Date(parseInt(d.timeStamp) * 1000).toLocaleString();
            d.EventText = d.EventText.replace("Q", (d.qVal ? d.qVal : 'undefined'));
            return d;
          });
      })
      .then(data => {
        console.log('Points to map: ', data);

        this.filterCategories = data.reduce((t: Array<CategoryModel>, n, i, e) => {
          if (t.map(d => d.categoryName).indexOf(n.EventCategory) < 0) {
            t.push({
              categoryName: n.EventCategory,
              selected: true,
              count: e.filter(f => f.EventCategory == n.EventCategory).length
            } as CategoryModel)
          }
          return t;
        }, [])
        .sort((a: CategoryModel, b: CategoryModel) => parseInt(a.categoryName) - parseInt(b.categoryName));

        return data.map(d => {
          return {
            geometry: { type: "point", x: d.Longitude, y: d.Latitude },
            symbol: { type: "simple-marker", color: [226, 119, 40] },
            attributes: {
              ObjectID: d.id,
              title: d.EventText,
              state: d.State,
              latitude: d.Latitude,
              longitude: d.Longitude,
              eventText: d.EventText,
              eventCategory: d.EventCategory,
              timeStamp: new Date(d.timeStamp).getTime()
            }
          }
        });
      })
      .then(data => {
        this._featLayer = new FeatureLayer({
          title: 'Traffic Layer',
          source: data,
          useViewTime: true,
          timeExtent: {
            start: new Date(1974, 0, 1),
            end: new Date(2050, 0, 1)
          },
          fields: [
            { name: "ObjectID", alias: "ObjectID", type: "oid" },
            { name: "title", alias: "title", type: "string" },
            { name: "state", alias: "State", type: "string" },
            { name: "latitude", alias: "Latitude", type: "string" },
            { name: "longitude", alias: "Longitude", type: "string" },
            { name: "eventText", alias: "EventText", type: "string" },
            { name: "eventCategory", alias: "EventCategory", type: "string" },
            { name: "timeStamp", alias: "timeStamp", type: "date" },
            { name: "eventNum", alias: "EventNum", type: "string" },
            { name: "locationNum", alias: "LocationNum", type: "string" }
          ],
          popupTemplate: {
            title: "{timeStamp} {title} ",
            content: [{
              type: "fields",
              fieldInfos: [
                { fieldName: "State", label: "State", visible: true },
                { fieldName: "Latitude", label: "Latitude", visible: true },
                { fieldName: "Longitude", label: "Longitude", visible: true },
                { fieldName: "EventText", label: "Event Text", visible: true },
                { fieldName: "EventCategory", label: "Event Category", visible: true },
                { fieldName: "EventNum", label: "Event Number", visible: true },
                { fieldName: "LocationNum", label: "Location Number", visible: true }
              ]
            }],
            fieldInfos: [
              { fieldName: "time", format: { dateFormat: "short-date-short-time" } }
            ]
          },
          renderer: {
            type: "simple",  // autocasts as new SimpleRenderer()
            symbol: {
              type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
              size: 8,
              color: "black",
              outline: {  // autocasts as new SimpleLineSymbol()
                width: 0.5,
                color: "white"
              }
            }
          },
          timeInfo: {
            startField: "timeStamp"
          }
        });

        this._map.add(this._featLayer);

      })



      // Initialize the MapView
      this._view = new EsriMapView({
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: this._map
      });

      await this._view.when();
      new TimeSlider({
        container: this.timeSliderDivEl.nativeElement,
        view: this._view,
        mode: "time-window",
        fullTimeExtent: { // entire extent of the timeSlider
          start: new Date(2020, 11, 5),
          end: new Date(2020, 11, 10)
        },
        values:[ // location of timeSlider thumbs
          new Date(2020, 11, 5),
          new Date(2020, 11, 6)
        ]
      });
      // this._view.ui.add(this._timeSlider, { position: "top-right" });
      // this._view.ui.add(this._timeSlider);

      return this._view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  filterByText(selectedText: string): void {
    // console.log('EsriMapComponent.filterByText', selectedText);
    if(selectedText.length > 2) {
      const filterStr = "EventText LIKE '%" + selectedText + "%'";
      this._featLayerView.filter = { where: filterStr };
    }
    else {
      this._featLayerView.filter = null;
    }
  }

  filterByCats(selectedCats: Array<CategoryModel>): void {
    // console.log('EsriMapComponent.filterByCats', selectedCats);
    let filterStr: string = selectedCats.reduce((t: Array<string>, n: CategoryModel) => {
      if(n.selected) { t.push("(EventCategory = '" + n.categoryName + "')"); } return t;
    }, [])
    .join(' OR ');

    this._featLayerView.filter = { where: (filterStr.length > 0 ? filterStr : "EventCategory = ''") };
  }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(mapView => {
      // The map has been initialized
      // console.log("mapView ready: ", this._view.ready);
      // console.log("mapView Object: ", mapView);

      mapView.whenLayerView(this._featLayer)
      .then(layerView => {
        this._featLayerView = layerView;

        layerView.watch("updating", (val) => {
          if (!val) {
            // Get the number of features in the view and update the model
            layerView.queryFeatures()
              .then(results => results.features.length)
              .then(featCount => { this.featuresOnMap = featCount });
          }
        });
      });

      this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true);
    });
  }

  ngOnDestroy() {
    if (this._view) {
      // destroy the map view
      this._view.container = null;
    }
  }
}
