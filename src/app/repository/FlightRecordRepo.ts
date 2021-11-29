import Graphic from "@arcgis/core/Graphic";
import { GraphicMapper } from "../mapper/GraphicMapper";
import { FlightRecord } from "../models/FlightRecord";
import { BaseRepository } from "./BaseRepository";

export class FlightRecordRepo implements BaseRepository<FlightRecord> {
    public GetFeatures(): Promise<Array<Graphic>> {
        return fetch('https://raw.githubusercontent.com/JamesHensley/Esri-Example01/master/src/resources/flightData.json')
        .then(data => data.json())
        .then(data => data.features.map(d => new FlightRecord(d)))
        .then(data => {
            const mapper = new GraphicMapper<FlightRecord>();
            return data.map(d => mapper.MapObj(d))
        })
        .then(data => Promise.resolve(data))
        .catch(e => Promise.reject(e))
    }
}