import {
    Component,
    Output,
    EventEmitter,
} from "@angular/core";

@Component({
    selector: "filter-component",
    templateUrl: "./filter.component.html",
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
    @Output()
    filterTextUpdated:EventEmitter<string> = new EventEmitter<string>();

    private _filterValue: string;
    public get filterValue(): string { return this._filterValue; };
    public set filterValue(val: string) {
        this._filterValue = val;
        this.filterTextUpdated.emit(this._filterValue);
    }
}
