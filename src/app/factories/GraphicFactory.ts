import { Point, Multipoint, Polyline } from '@arcgis/core/geometry';
import Graphic from '@arcgis/core/Graphic';
import { FlightRecord } from '../models/FlightRecord';
import { TMCRecord } from '../models/TMCRecord';

export class GraphicFactory<T> {
    public BuildGraphic(inRec: T): Graphic {
        // Figure out how I want to do this piece
        if (inRec instanceof TMCRecord) { return this.buildFromTMCRecord(inRec); }
        if (inRec instanceof FlightRecord) { return this.buildFromFlightRecord(inRec); }

        return null;
    }

    private buildFromTMCRecord(rec: TMCRecord): Graphic {
        return new Graphic({
            attributes: {
                ObjectID: Math.floor(new Date().getTime() + Math.random() * 500).toString(),
                title: rec.EventText,
                info: rec.EventCategory,
                latitude: rec.Latitude,
                longitude: rec.Longitude,
                filterableStr: (`${rec.EventText} ${rec.EventCategory}`).toLowerCase(),
                timeStamp: parseInt(rec.timeStamp, 10) * 1000
            },
            geometry: new Point({
                x: parseFloat(rec.Longitude),
                y: parseFloat(rec.Latitude)
            })
        });
    }

    private buildFromFlightRecord(rec: FlightRecord): Graphic {
        return new Graphic({
            attributes: {
                ObjectID: Math.floor(new Date().getTime() + Math.random() * 500).toString(),
                title: rec.properties.flightId,
                info: rec.properties.carrier,
                latitude: "N/A",
                longitude: "N/A",
                filterableStr: (`${rec.properties.flightId} ${rec.properties.carrier}`).toLowerCase(),
                timeStamp: new Date(rec.properties.takeoff).getTime()
            },
            geometry: new Polyline({
                paths: rec.geometry.coordinates
            })
        });
    }
}
