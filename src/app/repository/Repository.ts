import Graphic from "@arcgis/core/Graphic";
import { FlightRecord } from "../models/FlightRecord";
import { TMCRecord } from "../models/TMCRecord";

export interface IRepository {
    GetFeatures: () => Promise<Array<Graphic>>;
}

export class Repository<T> implements IRepository {
    public GetFeatures(): Promise<Array<Graphic>> { return null };
}

export class TMCRepository extends Repository<TMCRecord> {
    public GetFeatures(): Promise<Array<Graphic>> {
        console.log('Im a TMCRepository');
        return Promise.resolve([]);
    }
}

export class FlightRepository extends Repository<FlightRecord> {
    public GetFeatures(): Promise<Array<Graphic>> {
        console.log('Im a FlightRepository');
        return Promise.resolve([]);
    }
}
