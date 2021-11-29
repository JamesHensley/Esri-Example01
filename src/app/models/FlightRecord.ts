export interface geometry {
    type: string;
    coordinates: Array<Array<Array<number>>>
}

export interface properties {
    flightId: string;
    carrier: string;
    takeoff: string;
    landed: string;
}

export class FlightRecord {
    public type: string;
    public geometry: geometry;
    public properties: properties;
    constructor(init?: Partial<FlightRecord>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}
