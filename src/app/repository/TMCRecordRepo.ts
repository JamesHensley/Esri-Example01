import Graphic from '@arcgis/core/Graphic';
import { GraphicFactory } from '../factories/GraphicFactory';
import { TMCRecord } from '../models/TMCRecord';
import { BaseRepository, IRepository } from './BaseRepository';

export class TMCRecordRepo implements IRepository {
    public GetFeatures(): Promise<Array<Graphic>> {
        return fetch('https://raw.githubusercontent.com/JamesHensley/Esri-Example01/master/src/resources/allData.json')
        .then(data => data.json())
        .then(data => data.map(d => new TMCRecord(d)))
        .then(data => {
            const factory = new GraphicFactory<TMCRecord>();
            return data.map(d => factory.BuildGraphic(d))
        })
        .then(d => Promise.resolve(d))
        .catch(e => Promise.reject(e));
    }
}
