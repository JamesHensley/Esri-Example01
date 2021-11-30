import { Component, Input, Output, EventEmitter } from "@angular/core";
import { OnInit, OnDestroy } from "@angular/core";
import { ViewChild, ElementRef } from "@angular/core";

import Map from "@arcgis/core/Map";
import MapView from '@arcgis/core/views/MapView';
import FeatureLayerView from '@arcgis/core/views/layers/FeatureLayerView';
import Graphic from "@arcgis/core/Graphic";
import TimeSlider from '@arcgis/core/widgets/TimeSlider';
import LayerList from '@arcgis/core/widgets/LayerList';
import FeatureFilter from '@arcgis/core/views/layers/support/FeatureFilter';

import { FeatureLayerFactory } from "./factories/FeatureLayerFactory";
import { BaseRepository, RepoTypes } from "./repository/BaseRepository";

@Component({
    selector: "map-component",
    templateUrl: "./map.component.html",
    styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, OnDestroy {
    private mapView: MapView;
    private timeSlider: TimeSlider;

    private mapZoom: number;
    private mapCenter: Array<number>;
    private baseMapName: string;

    public featuresOnMap: number;
    public features: Array<Graphic> = [];

    @ViewChild("mapViewNode", { static: true }) private mapViewElement: ElementRef;
    @ViewChild("timeSliderDiv", { static: true }) private timeSliderElement: ElementRef;
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

    ngOnInit(): void {
        const map = new Map({ basemap: this.baseMapName });
        this.mapView = new MapView({
            map: map,
            center: this.mapCenter,
            zoom: this.mapZoom,
            container: this.mapViewElement.nativeElement
        });

        this.timeSlider = new TimeSlider({
            container: this.timeSliderElement.nativeElement,
            mode: "time-window",
            view: this.mapView
        });

        this.mapView.ui.add(new LayerList({ view: this.mapView }), {
            position: "top-right"
        });

        BaseRepository.GetRepository(RepoTypes.TrafficMessageRecords).GetFeatures()
        .then(features => {
            const featureLayer = FeatureLayerFactory.BuildFeatureLayer(features, { layerName: 'Traffic Data Layer', useViewTime: true });
            map.add(featureLayer);

            this.mapView.whenLayerView(featureLayer).then(lv => {
                this.timeSlider.fullTimeExtent = featureLayer.timeExtent.expandTo("hours");
                const ids = (featureLayer.source as any).items.map(d => d.attributes.ObjectID);

                /*
                setInterval(() => {
                    const oid = ids[Math.floor(Math.random() * ids.length)]
                    featureLayer.queryFeatures({ objectIds: [oid] })
                    .then(result => {
                        const tgt = result.features[0]; //((feats as any).geometry as any);
                        const val = Math.round(Math.random()) ? .1 : -0.1;
                        Math.round(Math.random()) ? tgt.geometry.y = tgt.y + val : tgt.x = tgt.x + val;
                        featureLayer.applyEdits({ updateFeatures: [tgt] })
                        .then(r => {
                            //
                        })
                        .catch(e => {
                            //
                        })
                    })
                    //Math.round(Math.random()) ? tgt.geometry.set('y', (tgt as any).y + val) : tgt.geometry.set('x', (tgt as any).x + val);
                }, 500);
                */
            });
        })
        .catch(e => console.log(e));

        BaseRepository.GetRepository(RepoTypes.FlightRecords).GetFeatures()
        .then(features => {
            const featureLayer = FeatureLayerFactory.BuildFeatureLayer(features, { renderStyle: 'Line', layerName: 'Flight Aware Layer' });
            map.add(featureLayer);
        })
        .catch(e => console.log(e));
    }

    ngOnDestroy() {
        if (this.mapView) {
            this.mapView.container = null;  // destroy the map view
        }
    }

    public filterTextUpdated(txt): void {
        this.applyFilter(`'%${txt}%'`);
    }

    private applyFilter(filterStr: string): void {
        const filter = new FeatureFilter({ where: `(filterableStr like ${filterStr})` });
        this.mapView.allLayerViews.forEach(lv => {
            if (lv.layer.type == "feature") {
                (lv as FeatureLayerView).filter = filter;
            }
        });
    }
}
