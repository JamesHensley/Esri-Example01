import Graphic from "@arcgis/core/Graphic";
import { FlightRecordRepo } from "./FlightRecordRepo";
import { TMCRecordRepo } from "./TMCRecordRepo";

export enum RepoTypes {
    FlightRecords,
    TrafficMessageRecords
}
export interface IRepository {
    GetFeatures(): Promise<Array<Graphic>>;
}

export class BaseRepository {
    // public abstract GetFeatures(): Promise<Array<Graphic>>;
    public static GetRepository(repoType: RepoTypes): IRepository {
        switch (repoType) {
            case RepoTypes.FlightRecords: return new FlightRecordRepo();
            case RepoTypes.TrafficMessageRecords: return new TMCRecordRepo();
            default: return null;
        }
    }
}