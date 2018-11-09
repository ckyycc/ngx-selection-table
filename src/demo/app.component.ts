import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  filter = true;
  checkbox = true;
  multiSelection = true;
  clickToSelect = true;
  hiddenColumns = ['_YScaleGroup', 'ID', 'TT'];
  hiddenColumnsFlag = false;
  tableSource =  [
    {ID: 1,  KPI: 'Host', header: true},
    {ID: 2,  KPI: 'CPU', 'Y-Scale': 100, _YScaleGroup: 0, Unit: '%', Max: 25, Min: 11, Average: 10, Last: 5, First: 7, TT: 'tooltips2'},
    {ID: 3,  KPI: 'Resident Memory', 'Y-Scale': 2000, _YScaleGroup: 1, Unit: 'GB', Max: 1024,  Min: 1024, Average: 1024, Last: 1024, First: 7, TT: 'tooltips3'},
    {ID: 4,  KPI: 'Disk Used', 'Y-Scale': 5000, _YScaleGroup: 2, Unit: 'GB', Max: 1302, Min: 1024, Average: 1123, Last: 5, First: 1122, TT: 'TEST tooltips8'},
    {ID: 5,  KPI: 'SQL', header: true},
    {ID: 6,  KPI: 'Open Connections', 'Y-Scale': 50, _YScaleGroup: 10, Unit: 'PC', Max: 39, Min: 11, Average: 17, Last: 13, First: 21, TT: 'tooltips15'},
    {ID: 7,  KPI: 'Internal Connections', 'Y-Scale': 500, _YScaleGroup: 10, Unit: 'PC', Max: 399, Min: 192, Average: 211, Last: 217, First: 211, TT: 'tooltips16'},
    {ID: 8, KPI: 'External Connections', 'Y-Scale': 500, _YScaleGroup: 10, Unit: 'PC', Max: 421, Min: 183, Average: 215, Last: 217, First: 299, TT: 'tooltips17'},
    {ID: 9,  KPI: 'Threads', header: true},
    {ID: 10,  KPI: 'Active Threads', 'Y-Scale': 500, _YScaleGroup: 12, Unit: 'PC', Max: 307, Min: 101, Average: 231, Last: 101, First: 199, TT: 'tooltips29'},
    {ID: 11, KPI: 'Waiting Threads', 'Y-Scale': 200, _YScaleGroup: 12,  Unit: 'PC', Max: 168, Min: 9, Average: 52, Last: 99, First: 152, TT: 'tooltips30'},
    {ID: 12, KPI: 'Total Threads', 'Y-Scale': 200, _YScaleGroup: 12,  Unit: 'PC', Max: 121, Min: 9, Average: 52, Last: 99, First: 111, TT: 'tooltips31'},
  ];

  get realHiddenColumns() {
    return this.hiddenColumnsFlag ? this.hiddenColumns.concat(['Max', 'Min', 'Average', 'First', 'Last']) : this.hiddenColumns;
  }

  selectItem() {}
}
