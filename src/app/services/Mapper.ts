import { Point } from '@arcgis/core/geometry';
import Graphic from '@arcgis/core/Graphic';
import { TMCRecord } from '../models/TMCRecord';

export class GraphicMapper<T> {
    public MapObj(inRec: T): Graphic {
        // Figure out how I want to do this piece
        if (inRec instanceof TMCRecord) { return this.mapTMCRecords(inRec); }
        return null;
    }

    private mapTMCRecords(rec: TMCRecord): Graphic {
        return new Graphic({
            attributes: {
                ObjectID: Math.floor(new Date().getTime() + Math.random() * 500).toString(),
                title: rec.EventText,
                // info: rec.EventText,
                // category: rec.EventCategory,
                // latitude: rec.Latitude,
                // longitude: rec.Longitude,
                // timeStamp: parseInt(rec.timeStamp, 10) * 1000
            },
            geometry: new Point({
                x: parseFloat(rec.Longitude),
                y: parseFloat(rec.Latitude)
            })
        });
    }
}
