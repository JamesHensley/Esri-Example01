import { Component, EventEmitter, Output } from '@angular/core';

//'../styles/toolbar.component.css'

@Component({
  selector: 'tool-bar',
  template: `
    <mat-toolbar class='toolBar'>
        <filter-component (filterTextUpdated)='filterUpdated($event)'></filter-component>
    </mat-toolbar>
  `,
  styleUrls: [ './toolbar.component.scss' ]
})
export class ToolBar {
    @Output()
    filterTextUpdated:EventEmitter<string> = new EventEmitter<string>();
    
    public displayText: string = "Welcome";

    public filterUpdated(txt): void {
        this.filterTextUpdated.emit(txt);
    }
}
