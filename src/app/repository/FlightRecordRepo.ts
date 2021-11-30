import Graphic from "@arcgis/core/Graphic";
import { GraphicFactory } from "../factories/GraphicFactory";
import { FlightRecord } from "../models/FlightRecord";
import { BaseRepository, IRepository } from "./BaseRepository";

export class FlightRecordRepo implements IRepository {
    public GetFeatures(): Promise<Array<Graphic>> {
        return fetch('https://raw.githubusercontent.com/JamesHensley/Esri-Example01/master/src/resources/flightData.json')
        .then(data => data.json())
        .then(data => data.features.map(d => new FlightRecord(d)))
        .then(data => {
            const factory = new GraphicFactory<FlightRecord>();
            return data.map(d => factory.BuildGraphic(d))
        })
        .then(data => Promise.resolve(data))
        .catch(e => Promise.reject(e))
    }
}