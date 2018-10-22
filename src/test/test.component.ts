import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './test.component.html',
})
export class TestComponent {
  hiddenColumns = ['_YScaleGroup', 'ID', 'CK'];
  tableSource =  [
    {ID: 1, KPI: 'Host', header: true},
    {ID: 2, KPI: 'CPU', 'Y-Scale': 100, _YScaleGroup: 0, Unit: '%', Max: 9, CK: 'TEST tooltips2'},
    {ID: 3, KPI: 'Database Resident Memory', 'Y-Scale': 2000000, _YScaleGroup: 1, Unit: 'MB', Max: 99715, CK: 'TEST tooltips3'},
    {ID: 4, KPI: 'Total Resident Memory', 'Y-Scale': 2000000, _YScaleGroup: 1, Unit: 'MB', Max: 439899, CK: 'TEST tooltips4'},
    {ID: 5, KPI: 'Database Used Memory', 'Y-Scale': 2000000, _YScaleGroup: 1, Unit: 'MB', Max: 31044, CK: 'TEST tooltips5'},
    {ID: 6, KPI: 'Database Allocation Limit', 'Y-Scale': 2000000, _YScaleGroup: 1, Unit: 'MB', Max: 998094, CK: 'TEST tooltips6'},
    {ID: 7, KPI: 'Physical Memory Size', 'Y-Scale': 2000000, _YScaleGroup: 1, Unit: 'MB', Max: 1033995, CK: 'TEST tooltips7'},
    {ID: 8, KPI: 'Disk Used', 'Y-Scale': 5000, _YScaleGroup: 2, Unit: 'GB', Max: 1302, CK: 'TEST tooltips8'},
    {ID: 9, KPI: 'Disk Size', 'Y-Scale': 5000, _YScaleGroup: 2, Unit: 'GB', Max: 2524, CK: 'TEST tooltips9'},
    {ID: 10, KPI: 'Network In', 'Y-Scale': 10, _YScaleGroup: 3, Unit: 'MB/s', Max: 6.71, CK: 'TEST tooltips10'},
    {ID: 11, KPI: 'Network Out', 'Y-Scale': 10, _YScaleGroup: 3, Unit: 'MB/s', Max: 4.42, CK: 'TEST tooltips11'},
    {ID: 12, KPI: 'Swap In', 'Y-Scale': 100, _YScaleGroup: 4, Unit: 'MB/s', Max: 3.72, CK: 'TEST tooltips12'},
    {ID: 13, KPI: 'Swap Out', 'Y-Scale': 100, _YScaleGroup: 4, Unit: 'MB/s', Max: 0, CK: 'TEST tooltips13'},
    {ID: 14, KPI: 'SQL', header: true},
    {ID: 15, KPI: 'Open Connections', 'Y-Scale': 100, _YScaleGroup: 10, Unit: '', Max: 63, CK: 'TEST tooltips15'},
    {ID: 16, KPI: 'Internal Connections', 'Y-Scale': 100, _YScaleGroup: 10, Unit: '', Max: 12, CK: 'TEST tooltips16'},
    {ID: 17, KPI: 'External Connections', 'Y-Scale': 100, _YScaleGroup: 10, Unit: '', Max: 52, CK: 'TEST tooltips17'},
    {ID: 18, KPI: 'Idle Connections', 'Y-Scale': 100, _YScaleGroup: 10, Unit: '', Max: 63, CK: 'TEST tooltips18'},
    {ID: 19, KPI: 'Open Transactions', 'Y-Scale': 20, _YScaleGroup: 11, Unit: '', Max: 15, CK: 'TEST tooltips19'},
    {ID: 20, KPI: 'Internal Transactions', 'Y-Scale': 20, _YScaleGroup: 11, Unit: '', Max: 5, CK: 'TEST tooltips20'},
    {ID: 21, KPI: 'External Transactions', 'Y-Scale': 20, _YScaleGroup: 11, Unit: '', Max: 2, CK: 'TEST tooltips21'},
    {ID: 22, KPI: 'User Transactions', 'Y-Scale': 20, _YScaleGroup: 11, Unit: '', Max: 14, CK: 'TEST tooltips22'},
    {ID: 23, KPI: 'Blocked Transactions', 'Y-Scale': 100, _YScaleGroup: 12, Unit: '', Max: 0, CK: 'TEST tooltips23'},
    {ID: 24, KPI: 'Statements', 'Y-Scale': 500, _YScaleGroup: 7, Unit: 'stm/s', Max: 210, CK: 'TEST tooltips24'},
    {ID: 25, KPI: 'Active Commit ID Range', 'Y-Scale': 1000, _YScaleGroup: 12, Unit: '', Max: 571, CK: 'TEST tooltips25'},
    {ID: 26, KPI: 'Active Transaction ID Range', 'Y-Scale': 10000000, _YScaleGroup: 12, Unit: '', Max: 7913516, CK: 'TEST tooltips26'},
    {ID: 27, KPI: 'Pending Session Request Count', 'Y-Scale': 100, _YScaleGroup: 12, Unit: '', Max: 0, CK: 'TEST tooltips27'},
    {ID: 28, KPI: 'Threads', header: true},
    {ID: 29, KPI: 'Active Threads', 'Y-Scale': 50, _YScaleGroup: 12, Unit: '', Max: 35, CK: 'TEST tooltips29'},
    {ID: 30, KPI: 'Waiting Threads', 'Y-Scale': 50, _YScaleGroup: 12, Unit: '', Max: 27, CK: 'TEST tooltips30'},
    {ID: 31, KPI: 'Total Threads', 'Y-Scale': 500, _YScaleGroup: 12, Unit: '', Max: 307, CK: 'TEST tooltips31'},
    {ID: 32, KPI: 'Active SqlExecutors', 'Y-Scale': 5, _YScaleGroup: 12, Unit: '', Max: 4, CK: 'TEST tooltips32'},
    {ID: 33, KPI: 'Waiting SqlExecutors', 'Y-Scale': 2, _YScaleGroup: 12, Unit: '', Max: 2, CK: 'TEST tooltips33'},
    {ID: 34, KPI: 'Total SqlExecutors', 'Y-Scale': 200, _YScaleGroup: 12, Unit: '', Max: 161, CK: 'TEST tooltips34'},
  ];
  get tables() {
    const tables = JSON.stringify(this.tableSource);
    // Object.keys(this.tableSource).forEach(key => {
    //   const row = this.tableSource[key];
    //   Object.keys(row).forEach(ckey => tables = `${tables} ${ckey}:${row[ckey]}`)
    //   tables = `${tables}\n`;
    // });
    return tables;
  }
  selectItem(event) {
    // if (event && event.tableRow) {
    //   this.selectedRow = '';
    //   const selectedTableRow = event.tableRow;
    //   Object.keys(selectedTableRow).forEach(key => this.selectedRow = `${this.selectedRow} ${key}:${selectedTableRow[key]}`);
    // }
  }
}
