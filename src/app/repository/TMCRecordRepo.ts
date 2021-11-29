import Graphic from '@arcgis/core/Graphic';
import { GraphicMapper } from '../mapper/GraphicMapper';
import { TMCRecord } from '../models/TMCRecord';
import { BaseRepository } from './BaseRepository';

export class TMCRecordRepo implements BaseRepository<TMCRecord> {
    public GetFeatures(): Promise<Array<Graphic>> {
        return fetch('https://raw.githubusercontent.com/JamesHensley/Esri-Example01/master/src/resources/allData.txt')
        .then(data => data.text())
        .then(data => {
            return data.split('\r\n')
            .filter(d => d.length > 0)
            .map(d => new TMCRecord(JSON.parse(d)))
            .filter(f => f.IsValid)
        })
        .then(data => {
            const mapper = new GraphicMapper<TMCRecord>();
            return data.map(d => mapper.MapObj(d))
        })
        .then(d => Promise.resolve(d))
        .catch(e => Promise.reject(e));
    }
}
