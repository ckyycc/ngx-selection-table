import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SelectionTableModule } from '../ngx-selection-table';
import { TestComponent } from './test.component';

@NgModule({
  declarations: [
    TestComponent
  ],
  imports: [
    BrowserModule,
    SelectionTableModule,
  ],
  providers: [],
  bootstrap: [TestComponent]
})
export class TestModule { }
