import { Point } from '@arcgis/core/geometry';
import Graphic from '@arcgis/core/Graphic';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { SimpleRenderer } from '@arcgis/core/renderers';
import { SimpleMarkerSymbol } from "@arcgis/core/symbols";

import { RecordModel } from "../models/RecordModel";

export class FeatureLayerFactory {
    public static BuildFeatureLayer(features: Array<RecordModel>): FeatureLayer {
        const feats = features.map((d, i) => new Graphic({
            attributes: {
                ObjectID: i,
                title: d.EventText,
                state: d.State,
                latitude: d.Latitude,
                longitude: d.Longitude,
                eventText: d.EventText,
                eventCategory: d.EventCategory,
                eventNum: d.EventNum,
                timeStamp: parseInt(d.timeStamp, 10)
            },
            geometry: new Point({
                x: parseFloat(d.Longitude),
                y: parseFloat(d.Latitude)
            })
        }))
        .filter((f, i) => i < 50);

        const sr = new SimpleRenderer({
            symbol: new SimpleMarkerSymbol({
                color: [0, 0, 0, 0.5],
                // outline: [0, 0, 0, 1],
                size: 10
            })
        })
        return new FeatureLayer({
            title: 'Traffic Data Layer',
            source: feats,
            /* useViewTime: true, */
            /* timeExtent: { start: new Date(1974, 0, 1), end: new Date(2050, 0, 1) }, */
            /* timeInfo: { startField: "timeStamp" }, */
            fields: [
                { name: "ObjectID", alias: "ObjectID", type: "oid" },
                { name: "eventText", alias: "eventText", type: "string" },
                { name: "timeStamp", alias: "timeStamp", type: "long" }
            ],
            renderer: sr
        });
    }
}