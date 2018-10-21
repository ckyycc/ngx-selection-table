import { Component, EventEmitter, Input, Output } from '@angular/core';

enum SearchType {
  searchWithSubHeader = 'searchWithSubHeader',
  searchAll = 'searchAll',
  searchInChildren = 'searchInChildren'
}

const AUX_HEADER  = 'header';
const AUX_CHECKED = 'checked';
const AUX_SELECT  = 'select';

@Component({
  selector: 'ngx-selection-table',
  templateUrl: './selection-table.component.html',
  styleUrls: ['./selection-table.component.scss']
})

export class SelectionTableComponent {
  filterValue: string;
  itemHiddenFlag = {};
  @Input()
  /**
   * Flag for showing the filter input box
   */
  filter: boolean;
  @Input()
  /**
   * name of the key column
   */
  keyColumn: string;
  @Input()
  /**
   * table data
   */
  tableSource: any[];
  @Input()
  /**
   * Flag for showing the checkbox
   */
  checkbox = true;
  @Input()
  /**
   * Flag for multiple selection
   */
  multiSelection = true;

  @Input()
  /**
   * Flag for click row to select
   */
  clickToSelect = true;

  @Input()
  /**
   * columns need to be hidden
   */
  hiddenColumns: string[];

  @Input()
  /**
   * column used for tooltip
   */
  tooltipColumn: string;

  @Input()
  /**
   * search style for the filter
   */
  searchStyle = SearchType.searchInChildren;

  @Input()
  /**
   * search column for the filter
   */
  searchColumn: string;

  /**
   * selection change event
   */
  @Output() change = new EventEmitter<any>();

  /**
   * triggered by clicking the <tr>
   */
  onClick(e, row) {
    if (this.clickToSelect) {
      this.onChange(e, row);
    }
  }

  /**
   * Triggered by the changing of checkbox.
   * Toggle the value of the checkbox;
   * If multiSelection is false, will clear the previous selections.
   */
  onChange(event, row) {
    if (!row.header) {
      row.checked = !row.checked;
      if (row.checked && !this.multiSelection) {
        // unSelect other selected ones
        if (this.tableSource) {
          for (const tableRow of this.tableSource) {
            if (tableRow.checked && tableRow[this.key] !== row[this.key]) {
              tableRow.checked = false;
            }
          }
        }
      }
      event.tableRow = row;
      this.change.emit(event);
    }
  }

  /**
   * Get all the columns that need to be displayed.
   * "header", "checked" and columns in hiddenColumns will be excluded.
   */
  get columns(): string[] {
    if (this.tableSource && this.tableSource.length > 0) {
      const hiddenColumns = this.hiddenColumns ? this.hiddenColumns : [];
      const tableRow = this.tableSource.find(row => !row.header);
      const keys = Object.keys(tableRow).filter(key => (![AUX_HEADER, AUX_CHECKED].includes(key) && !hiddenColumns.includes(key)));
      if (this.checkbox) {
        return [AUX_SELECT].concat(keys);
      } else {
        return keys;
      }
    }
  }

  /**
   * Get the text for the subtitle column
   * 'select', 'header', 'checked' and columns in hiddenColumns will be excluded.
   * Return the first item if there are multiple items in the subtitle row.
   */
  get headColumn(): string {
    if (this.tableSource && this.tableSource.length > 0) {
      const hiddenColumns = this.hiddenColumns ? this.hiddenColumns : [];
      const tableRow = this.tableSource.find(row => row.header);
      const keys = Object.keys(tableRow).filter(
        key => (![AUX_SELECT, AUX_HEADER, AUX_CHECKED].includes(key) && !hiddenColumns.includes(key)));
      return keys[0];
    }
  }

  /**
   * Get the key column. If it is empty, use the first column (excluded the selection column).
   */
  get key(): string {
    return this.keyColumn ? this.keyColumn : this.checkbox ? this.columns[1] : this.columns[0];
  }

  /**
   * Get the table source after the filter being applied.
   * There are three types of filter:
   * searchWithSubHeader: search including the sub header (only), if any children are picked, the relative parent will be picked as well
   * searchAll:           search including the sub header, all it's children will be picked as well,
   *                      if any children are picked, the relative parent will be picked as well
   * searchInChildren:    search excluding the sub header,
   *                      if any children are picked, the relative parent will be picked as well
   */
  get tableSourceAfterFiltered() {
    if (!this.searchColumn) {
      return;
    }

    let filter;
    if (this.filterValue) {
      filter = this.filterValue.toUpperCase();
    }
    switch (this.searchStyle) {
      // search including the sub header (only), if any children are picked, the relative parent will be picked as well
      case SearchType.searchWithSubHeader:
        return this.tableSource.filter(row => !filter || filter.length === 0 ||
          row[this.searchColumn].toUpperCase().includes(filter) ||
          (row.header && this._getSubSearchItems(row[this.key]).findIndex(item => item.toUpperCase().includes(filter)) >= 0));
      // search including the sub header, all it's children will be picked as well,
      // if any children are picked, the relative parent will be picked as well
      case SearchType.searchAll:
        return this.tableSource.filter(row => !filter || filter.length === 0 ||
          row[this.searchColumn].toUpperCase().includes(filter) ||
          (!row.header && this._getParentSearchItem(row[this.key]).toUpperCase().includes(filter)) ||
          (row.header && this._getSubSearchItems(row[this.key]).findIndex(item => item.toUpperCase().includes(filter)) >= 0)
        );
      // search excluding the sub header, if any children are picked, the relative parent will be picked as well
      case SearchType.searchInChildren:
      default:
        return this.tableSource.filter(row => !filter || filter.length === 0 ||
          !row.header && row[this.searchColumn].toUpperCase().includes(filter) ||
          (row.header && this._getSubSearchItems(row[this.key]).findIndex(item => item.toUpperCase().includes(filter)) >= 0));
    }
  }

  /**
   * Toggle the sub items of current row
   */
  toggleSubTopic(event, row) {
    if (this.key != null) {
      this._getSubItems(row[this.key]).forEach(key => this.itemHiddenFlag[key] = !this.itemHiddenFlag[key]);
      // undefined --> all sub items are showing,
      // false -> all sub items are hidden
      this.itemHiddenFlag[row[this.key]] = this.itemHiddenFlag[row[this.key]] === undefined ? false : undefined;
    }
  }

  /**
   * Check whether the sub items are in hidden status by key.
   */
  isSubTopicHidden(key) {
    // undefined --> all sub items are showing,
    // false -> all sub items are hidden
    return this.itemHiddenFlag[key] === false;
  }

  /**
   * get all sub items by key.
   */
  private _getSubItems(key): string[] {
    const startIndex = this.tableSource.findIndex(row => row[this.key] === key && row.header);
    if (this.tableSource.length <= startIndex + 1 || startIndex < 0) {
      // the header is the last one, or can't find it, return empty directly
      return [];
    }

    let endIndex = this.tableSource.slice(startIndex + 1).findIndex(row => row.header);

    if (endIndex < 0 ) {
      // no next header, set index as last item
      endIndex = this.tableSource.length - 1;
    }
    return this.tableSource.slice(startIndex + 1, startIndex + endIndex + 1).map(row => row[this.key]);
  }

  /**
   * Get parent item of the provided key row
   */
  private _getParentSearchItem(key): string {
    const childIndex = this.tableSource.findIndex(row => row[this.key] === key && !row.header);
    if (childIndex < 0) {
      return '';
    }
    const slicedTable = this.tableSource.slice(0, childIndex);
    const parentIndex = slicedTable.map(row => row.header).lastIndexOf(true);
    return parentIndex >= 0 ? slicedTable[parentIndex][this.searchColumn] : '';
  }

  /**
   * Get sub items of the provided key row.
   */
  private _getSubSearchItems(key): string[] {
    const keys = this._getSubItems(key);
    if (!keys || keys.length === 0) {
      return [];
    }
    return this.tableSource.filter(row => keys.includes(row[this.key])).map(row => row[this.searchColumn]);
  }
}
