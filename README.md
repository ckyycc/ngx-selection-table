# ngx-sellection-table

[![npm](https://img.shields.io/npm/v/ngx-selection-table.svg?style=flat-square)](https://www.npmjs.com/package/ngx-selection-table) [![npm downloads](https://img.shields.io/npm/dm/ngx-selection-table.svg)](https://www.npmjs.com/package/ngx-selection-table) [![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/ckyycc/ngx-selection-table/blob/master/LICENSE)

An Angular 6 module for selecting data from table with checkbox, filter and collapsible/expandable sub title.

## Installation
```bash
npm install ngx-selection-table --save
```

## Usage

### Importing The 'ngx-selection-table' Module
```TypeScript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SelectionTableModule } from '../ngx-selection-table';


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

```
### Enabling Selection Table
```HTML
<div style="width:25%; float: left">
<ngx-selection-table 
                 (change)="selectItem($event)"
                 [tableSource]="tableSource"
                 [keyColumn]="'ID'"
                 [hiddenColumns]="['_YScaleGroup','TT']"
                 [tooltipColumn]="'TT'"
                 [searchStyle]="'searchAll'"
                 [searchColumn]="'KPI'"
                 [filter]="true"
                 [checkbox]="true"
                 [multiSelection]="true"
                 [clickToSelect]="true">
</ngx-selection-table>
</div>
```

## Parameters
Name  | Description | Example | 
------------- | ------------- | -------------
(change)  | On change function called after the status of checkbox changed | (change)="selectItem($event)"
tableSource  | Source data of the table | [tableSource]="tableSource"
keyColumn  | The name of the key column | [keyColumn]="'ID'"
hiddenColumns  | The columns which need to be hidden | [hiddenColumns]="['_YScaleGroup','TT']"
tooltipColumn  | The column which will be used for tooltip | [tooltipColumn]="'TT'"
searchStyle  | Search style of the search input. Supports three types: 'searchAll','searchWithSubHeader', 'searchInChildren'. | [searchStyle]="'searchAll'"
searchColumn  | the column which will be searched by the search input | [searchColumn]="'KPI'"
filter  | Enable or disable the search input |  [filter]="true"
checkbox  | Enable or disable the checkbox | [checkbox]="true"
multiSelection  | Enable or disable the multiple selection | [multiSelection]="true"
clickToSelect  | Enable or disable clicking the table row to select | [clickToSelect]="true"

### Input data samples:
```TypeScript
tableSource =  [
    {ID: 1, KPI: 'Host', header: true},
    {ID: 2, KPI: 'CPU', 'Y-Scale': 100, _YScaleGroup: 0, TT: 'tooltips2'},
    {ID: 3, KPI: 'Resident Memory', 'Y-Scale': 2000000, _YScaleGroup: 1, TT: 'tooltips3'},
    {ID: 4, KPI: 'SQL', header: true},
    {ID: 5, KPI: 'Open Connections', 'Y-Scale': 100, _YScaleGroup: 10,  TT: 'tooltips15'},
    {ID: 6, KPI: 'Internal Connections', 'Y-Scale': 100, _YScaleGroup: 10, TT: 'tooltips16'},
    {ID: 7, KPI: 'Threads', header: true},
    {ID: 8, KPI: 'Active Threads', 'Y-Scale': 50, _YScaleGroup: 12, TT: 'tooltips29'},
    {ID: 9, KPI: 'Waiting Threads', 'Y-Scale': 50, _YScaleGroup: 12,  TT: 'tooltips30'},
  ];
```
### Search Style Samples:
Search String | Search Style | Result 
------------- | ------------- | ------------- 
'Host' | searchAll | 'Host', 'CPU', 'Resident Memory'
'Host' | searchWithSubHeader | 'Host'
'Host' | searchInChildren | empty

## License

[MIT](/LICENSE)
