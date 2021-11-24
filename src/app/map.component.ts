import { Component, Input, Output, EventEmitter } from "@angular/core";
import { OnInit, OnDestroy } from "@angular/core";
import { ViewChild, ElementRef } from "@angular/core";

import Map from "@arcgis/core/Map";
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from "@arcgis/core/Graphic";

import { CategoryModel } from "./models/CategoryModel";
import { FeatureService } from "./services/FeatureService";
import { FeatureLayerFactory } from "./factories/FeatureLayerFactory";

@Component({
    selector: "map-component",
    templateUrl: "./map.component.html",
    styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, OnDestroy {
    private mapView: MapView;
    private featureLayer: FeatureLayer;

    private mapZoom: number;
    private mapCenter: Array<number>;
    private baseMapName: string;

    public featuresOnMap: number;
    public filterCategories: Array<CategoryModel>;

    public features: Array<Graphic> = [];

    @ViewChild("mapViewNode", { static: true }) private mapViewElement: ElementRef;
    @Output() mapLoadedEvent = new EventEmitter<boolean>();

    @Input()
    set zoom(zoom: number) { this.mapZoom = zoom; }
    get zoom(): number { return this.mapZoom; }
  
    @Input()
    set center(center: Array<number>) { this.mapCenter = center; }
    get center(): Array<number> { return this.mapCenter; }
  
    @Input()
    set basemap(basemap: string) { this.baseMapName = basemap; }
    get basemap(): string { return this.baseMapName; }

    constructor(private featureService: FeatureService) {}
    
    ngOnInit(): void {
        const map = new Map({ basemap: this.baseMapName });
        this.mapView = new MapView({
            map: map,
            center: this.mapCenter,
            zoom: this.mapZoom,
            container: this.mapViewElement.nativeElement
        });

        this.featureService.GetFeatures()
        .then(features => {
            this.featureLayer = FeatureLayerFactory.BuildFeatureLayer(features);
            map.add(this.featureLayer);
            console.log("FeatLayer: ", this.featureLayer);
        })
        .catch(e => console.log(e));
    }

    ngOnDestroy() {
        if (this.mapView) {
            this.mapView.container = null;  // destroy the map view
        }
    }

    public filterByCats(): void {
        console.log("filterByCats Called");
        const xx = this.mapView.allLayerViews.find(x => x.layer === this.featureLayer);
        console.log("Found Layer Views: ", xx);
    }

    public filterTextUpdated(): void {
        console.log("filterTextUpdated Called");
        const xx = this.mapView.allLayerViews.find(x => x.layer === this.featureLayer);
        console.log("Found Layer Views: ", xx);
    }
}

