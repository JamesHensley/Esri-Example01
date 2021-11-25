import { Point } from '@arcgis/core/geometry';
import Graphic from '@arcgis/core/Graphic';
import { TMCRecord } from '../models/TMCRecord';

export class GraphicMapper<T> {
    public MapObj(inRec: T): Graphic {
        // Figure out how I want to do this piece
        // inRec instanceof TMCRecord
        const rec = (inRec as any) as TMCRecord;

        return new Graphic({
            attributes: {
                ObjectID: (new Date().getTime() + Math.random() * 500).toString(),
                title: rec.EventText,
                state: rec.State,
                latitude: rec.Latitude,
                longitude: rec.Longitude,
                eventText: rec.EventText,
                eventCategory: rec.EventCategory,
                eventNum: rec.EventNum,
                timeStamp: parseInt(rec.timeStamp, 10) * 1000
            },
            geometry: new Point({
                x: parseFloat(rec.Longitude),
                y: parseFloat(rec.Latitude)
            })
        });
    }
}
