import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { SimpleRenderer } from '@arcgis/core/renderers';
import { SimpleMarkerSymbol } from "@arcgis/core/symbols";

import { GraphicMapper } from '../services/Mapper';

export interface IFeatureLayerProps {
    layerName?: string;
}

export class FeatureLayerFactory<T> {
    public BuildFeatureLayer(features: Array<T>, init?:Partial<IFeatureLayerProps>): FeatureLayer {
        const mapper = new GraphicMapper<T>();
        const feats = features.map(d => mapper.MapObj(d));
        (window as any).jimFeats = feats;
        
        let dates = feats.map(d => d.attributes.timeStamp)
            .sort()
            .filter((f,i,e) => i == 0 || i == e.length - 1);

        return new FeatureLayer({
            title: init.layerName ? init.layerName : 'Undefined Layer',
            source: feats,
            useViewTime: true,
            timeExtent: { start: new Date(dates[0]), end: new Date(dates[1]) },
            timeInfo: { startField: "timeStamp" },
            fields: [
                { name: "ObjectID", alias: "ObjectID", type: "oid" },
                { name: "title", alias: "title", type: "string" },
                { name: "latitude", alias: "latitude", type: "string" },
                { name: "longitude", alias: "longitude", type: "string" },
                { name: "eventCategory", alias: "eventCategory", type: "string" },
                { name: "timeStamp", alias: "timeStamp", type: "long" }
            ],
            renderer: new SimpleRenderer({
                symbol: new SimpleMarkerSymbol({
                    color: [0, 0, 0, 0.5],
                    size: 10
                })
            })
        });
    }
}