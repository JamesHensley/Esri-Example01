import Graphic from "@arcgis/core/Graphic";

export abstract class BaseRepository<T> {
    public abstract GetFeatures(): Promise<Array<Graphic>>;
}