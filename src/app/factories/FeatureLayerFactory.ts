import Graphic from '@arcgis/core/Graphic';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { SimpleRenderer } from '@arcgis/core/renderers';
import { SimpleLineSymbol, SimpleMarkerSymbol } from "@arcgis/core/symbols";

export type RenderStyles = 'Point' | 'Line';

export interface IFeatureLayerProps {
    renderStyle?: RenderStyles;
    layerName?: string;
    useViewTime?: boolean;
}

export class FeatureLayerFactory {
    public static BuildFeatureLayer(graphicObjs: Array<Graphic>, init?:Partial<IFeatureLayerProps>): FeatureLayer {
        //(window as any)[`JimFeats${Math.floor(Math.random() * 100)}`] = graphicObjs;    /* Cheat for testing */
        const feats = this.validateGeometry(graphicObjs);

        let dates = feats.map(d => d.attributes.timeStamp)
            .sort()
            .filter((f,i,e) => i == 0 || i == e.length - 1);

        return new FeatureLayer({
            title: init.layerName ? init.layerName : 'Undefined Layer',
            source: feats,
            useViewTime: init.useViewTime ? init.useViewTime : undefined,
            timeExtent: init.useViewTime ? { start: new Date(dates[0]), end: new Date(dates[1]) } : undefined,
            // timeInfo: init.useViewTime ? { startField: "timeStamp" } : undefined,
            timeInfo: { startField: "timeStamp" },
            fields: [
                { name: "ObjectID", alias: "ObjectID", type: "oid" },
                { name: "title", alias: "title", type: "string" },
                { name: "info", alias: "info", type: "string" },
                { name: "latitude", alias: "latitude", type: "string" },
                { name: "longitude", alias: "longitude", type: "string" },
                { name: "filterableStr", alias: "filterableStr", type: "string" },
                { name: "timeStamp", alias: "timeStamp", type: "long" }
            ],
            renderer: this.getRenderer(init.renderStyle || 'Point'),
            popupEnabled: true,
            popupTemplate: {
                title: '{title}',
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            { fieldName: "info", label: "Information: " },
                            { fieldName: "timeStamp", label: "Timestamp: " },
                            { fieldName: "latitude", label: "Latitude: " },
                            { fieldName: "longitude", label: "Longitude: " }
                        ]
                    }
                ]
            }
        });
    }

    // Had a BIG problem (untraceable) with some of the data... an invalid feature in a feature
    //  layer would cause the entire layer to NOT display with no warnings/errors
    // VALIDATE EVERYTHING YOU GIVE TO ESRI
    private static validateGeometry(feats: Array<Graphic>): Array<Graphic> {
        return feats.filter(f => {
            switch (f.geometry.type) {
                case 'point': return (f.geometry as any).x && (f.geometry as any).y;
                case 'polyline': return true;
                default: return false;
            };
        });
    }

    private static getRenderer(rStyle: RenderStyles): SimpleRenderer {
        const color = [ Math.floor(Math.random() * 150), Math.floor(Math.random() * 150), Math.floor(Math.random() * 150), 0.5 ];
        const sr = new SimpleRenderer();

        switch(rStyle) {
            case 'Point':
                sr.symbol = new SimpleMarkerSymbol({
                    color: color,
                    size: 10
                });
                break;
            case 'Line':
                sr.symbol = new SimpleLineSymbol({
                    color: color,
                    width: '4px'
                })
                break;
        }
        return sr;
    }
}
