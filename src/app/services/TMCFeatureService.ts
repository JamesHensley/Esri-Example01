import { TMCRecord } from '../models/TMCRecord';

export class TMCFeatureService {
    private static categories: Array<string>;
    public static get Categories(): Array<string> { return this.categories; }

    public static GetFeatures(): Promise<Array<TMCRecord>> {
        return fetch('https://raw.githubusercontent.com/JamesHensley/Esri-Example01/master/src/resources/allData.txt')
        .then(data => data.text())
        .then(data => {
            return data.split('\r\n')
            .filter(d => d.length > 0)
            .map(d => new TMCRecord(JSON.parse(d)))
            .filter(f => f.IsValid)
        })
        .then(d => {
            this.categories = d.map(m => m.EventCategory)
                .filter((f,i,e) => f && e.indexOf(f) == i)
                .sort((a,b) => parseInt(a) > parseInt(b) ? 1 : (parseInt(a) < parseInt(b) ? -1 : 0));
            return Promise.resolve(d);
        })
        .catch(e => Promise.reject(e));
    }
}
