import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SelectionTableModule } from '../ngx-selection-table';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SelectionTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
