import { Injectable } from '@angular/core';
import { RecordModel } from '../models/RecordModel';

@Injectable({ providedIn: 'root' })
export class FeatureService {
    public GetFeatures(): Promise<Array<RecordModel>> {
        return fetch('https://raw.githubusercontent.com/JamesHensley/Esri-Example01/master/src/resources/allData.txt')
        .then(data => data.text())
        .then(data => {
            return data.split('\r\n')
            .filter(d => d.length > 0)
            .map(d => new RecordModel(JSON.parse(d)))
            .filter(f => f.IsValid)
        })
        .then(d => Promise.resolve(d))
        .catch(e => Promise.reject(e));
    }
}
