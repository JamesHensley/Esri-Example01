import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CategoryModel } from '../Models/categoryModel';

@Component({
    selector: "app-esri-filter",
    templateUrl: "./esri-filter.component.html",
    styleUrls: ["./esri-filter.component.scss"]
  })

export class EsriFilterComponent {
    public _categories: Array<CategoryModel>;
    public _shownEvents: number;

    @Input()
    set categories(cats) { this._categories = cats; }
    get categories() { return this._categories; }
    
    @Input()
    set eventsOnMap(evs: number) { this._shownEvents = evs; }

    @Output()
    filterCategoriesChanged:EventEmitter<Array<CategoryModel>> = new EventEmitter<Array<CategoryModel>>();

    @Output()
    filterTextUpdated:EventEmitter<string> = new EventEmitter<string>();

    filterUpdatedByCategory(selectedCat: string, newValue: boolean): void {
        // console.log('EsriFilterComponent.filterUpdatedByCategory', selectedCat);
        this._categories = this._categories.map(d => {
            if(d.categoryName == selectedCat) { d.selected = newValue };
            return d;
        })
        this.filterCategoriesChanged.emit(this._categories);
    }

    filterUpdatedByText(text: string): void {
        // console.log('EsriFilterComponent.filterUpdatedByText', text);
        this.filterTextUpdated.emit(text);
    }

    checkAllCats() {
        this._categories = this._categories.map(d => { d.selected = true; return d });
        this.filterCategoriesChanged.emit(this._categories);
    }
    unCheckAllCats() {
        this._categories = this._categories.map(d => { d.selected = false; return d });
        this.filterCategoriesChanged.emit(this._categories);
    }
}