export class RecordModel {
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

    constructor(init?: Partial<RecordModel>) {
        if (init) {
            Object.assign(this, init);
        }
    }

    public get IsValid(): boolean {
        return (this.Latitude ? true : false) &&
            (this.Longitude ? true : false) &&
            (this.timeStamp ? true : false);
    }
}