import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    OnDestroy
} from "@angular/core";
import { CategoryModel } from "./models/CategoryModel";

@Component({
    selector: "filter-component",
    templateUrl: "./filter.component.html",
    styleUrls: []
})
export class FilterComponent implements OnInit, OnDestroy {
    @Input()
    set categories(cats) { this._categories = cats; }
    get categories() { return this._categories; }
    
    @Input()
    set eventsOnMap(evs: number) { this._shownEvents = evs; }

    @Output()
    filterCategoriesChanged:EventEmitter<Array<CategoryModel>> = new EventEmitter<Array<CategoryModel>>();

    @Output()
    filterTextUpdated:EventEmitter<string> = new EventEmitter<string>();

    private _categories: Array<CategoryModel>;
    public _shownEvents: number;

    ngOnInit(): void {
        
    }

    ngOnDestroy(): void {
        
    }

    public checkAllCats(): void {

    }

    public unCheckAllCats(): void {

    }

    public filterUpdatedByText(v): void {

    }
}
