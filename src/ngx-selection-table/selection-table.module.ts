import {NgModule} from '@angular/core';
import {SelectionTableComponent} from './selection-table.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    SelectionTableComponent,
  ],
  exports: [SelectionTableComponent],
  imports: [CommonModule, FormsModule ],
  providers: [],
  bootstrap: [],
})
export class SelectionTableModule {}
