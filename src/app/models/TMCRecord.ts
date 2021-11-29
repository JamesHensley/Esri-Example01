export class TMCRecord {
    timeStamp: string;
    EventNum: string;
    EventCategory: string;
    EventText: string;
    nVal?: string;
    qVal?: string;
    tVal?: string;
    dVal?: string;
    uVal?: string;
    cVal?: string;
    rVal?: string;
    LocationNum: string;
    Latitude: string;
    Longitude: string;
    State: string;
    PoliceStation: string;
    Special: string;
    id: string;

    constructor(init?: Partial<TMCRecord>) {
        if (init) { Object.assign(this, init); }
    }
}