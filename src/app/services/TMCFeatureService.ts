import { TMCRecord } from '../models/TMCRecord';

export class TMCFeatureService {
    private static categories: Array<string>;
    public static get Categories(): Array<string> { return this.categories; }

    public static GetFeatures(): Promise<Array<TMCRecord>> {
        return fetch('https://raw.githubusercontent.com/JamesHensley/Esri-Example01/master/src/resources/allData.json')
        .then(d => d.json())
        .then(d => d.map(m => new TMCRecord(m)))
        .then((d: Array<TMCRecord>) => {
            // this.categories = d
            //     .reduce((t, n) => t.indexOf(n.EventCategory) < 0 ? [].concat.apply(t, [n.EventCategory]) : t, [])
            //     .sort((a,b) => parseInt(a) > parseInt(b) ? 1 : (parseInt(a) < parseInt(b) ? -1 : 0));
            return Promise.resolve(d);
        })
        .catch(e => Promise.reject(e));
    }
}
