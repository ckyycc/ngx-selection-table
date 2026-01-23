import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Output, input, signal, computed } from '@angular/core';

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
  styleUrls: ['./selection-table.component.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule ]
})

export class SelectionTableComponent {
  // Signals for reactive state
  filterValue = signal<string>('');
  itemHiddenFlag = signal<{[key: string]: boolean | undefined}>({});

  // Input signals
  /**
   * Flag for showing the filter input box
   */
  filter = input<boolean>();
  
  /**
   * name of the key column
   */
  keyColumn = input<string>();
  
  /**
   * table data
   */
  tableSource = input<any[]>();
  
  /**
   * Flag for showing the checkbox
   */
  checkbox = input<boolean>(true);
  
  /**
   * Flag for multiple selection
   */
  multiSelection = input<boolean>(true);

  /**
   * Flag for click row to select
   */
  clickToSelect = input<boolean>(true);

  /**
   * columns need to be hidden
   */
  hiddenColumns = input<string[]>();

  /**
   * column used for tooltip
   */
  tooltipColumn = input<string>();

  /**
   * search style for the filter
   */
  searchStyle = input<SearchType>(SearchType.searchInChildren);

  /**
   * search column for the filter
   */
  searchColumn = input<string>();

  /**
   * selection change event
   */
  @Output() change = new EventEmitter<any>();

  /**
   * triggered by clicking the <tr>
   */
  onClick(e, row) {
    if (this.clickToSelect()) {
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
      if (row.checked && !this.multiSelection()) {
        // unSelect other selected ones
        const tableSource = this.tableSource();
        if (tableSource) {
          for (const tableRow of tableSource) {
            if (tableRow.checked && tableRow[this.key()] !== row[this.key()]) {
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
  columns = computed<string[]>(() => {
    const tableSource = this.tableSource();
    if (tableSource && tableSource.length > 0) {
      const hiddenColumns = this.hiddenColumns() || [];
      const tableRow = tableSource.find(row => !row.header);
      if (tableRow) {
        const keys = Object.keys(tableRow).filter(key => (![AUX_HEADER, AUX_CHECKED].includes(key) && !hiddenColumns.includes(key)));
        if (this.checkbox()) {
          return [AUX_SELECT].concat(keys);
        } else {
          return keys;
        }
      }
    }
    return [];
  });

  /**
   * Get the text for the subtitle column
   * 'select', 'header', 'checked' and columns in hiddenColumns will be excluded.
   * Return the first item if there are multiple items in the subtitle row.
   */
  headColumn = computed<string>(() => {
    const tableSource = this.tableSource();
    if (tableSource && tableSource.length > 0) {
      const hiddenColumns = this.hiddenColumns() || [];
      const tableRow = tableSource.find(row => row.header);
      if (tableRow) {
        const keys = Object.keys(tableRow).filter(
          key => (![AUX_SELECT, AUX_HEADER, AUX_CHECKED].includes(key) && !hiddenColumns.includes(key)));
        return keys[0];
      }
    }
    return '';
  });

  /**
   * Get the key column. If it is empty, use the first column (excluded the selection column).
   */
  key = computed<string>(() => {
    const keyColumn = this.keyColumn();
    const columns = this.columns();
    return keyColumn ? keyColumn : this.checkbox() ? columns[1] : columns[0];
  });

  /**
   * Get the table source after the filter being applied.
   * There are three types of filter:
   * searchWithSubHeader: search including the sub header (only), if any children are picked, the relative parent will be picked as well
   * searchAll:           search including the sub header, all it's children will be picked as well,
   *                      if any children are picked, the relative parent will be picked as well
   * searchInChildren:    search excluding the sub header,
   *                      if any children are picked, the relative parent will be picked as well
   */
  tableSourceAfterFiltered = computed<any[]>(() => {
    const searchColumn = this.searchColumn();
    const tableSource = this.tableSource();
    
    if (!searchColumn || !tableSource) {
      return [];
    }

    let filter;
    const filterValue = this.filterValue();
    if (filterValue) {
      filter = filterValue.toUpperCase();
    }
    
    const searchStyle = this.searchStyle();
    const key = this.key();
    
    switch (searchStyle) {
      // search including the sub header (only), if any children are picked, the relative parent will be picked as well
      case SearchType.searchWithSubHeader:
        return tableSource.filter(row => !filter || filter.length === 0 ||
          row[searchColumn].toUpperCase().includes(filter) ||
          (row.header && this._getSubSearchItems(row[key]).findIndex(item => item.toUpperCase().includes(filter)) >= 0));
      // search including the sub header, all it's children will be picked as well,
      // if any children are picked, the relative parent will be picked as well
      case SearchType.searchAll:
        return tableSource.filter(row => !filter || filter.length === 0 ||
          row[searchColumn].toUpperCase().includes(filter) ||
          (!row.header && this._getParentSearchItem(row[key]).toUpperCase().includes(filter)) ||
          (row.header && this._getSubSearchItems(row[key]).findIndex(item => item.toUpperCase().includes(filter)) >= 0)
        );
      // search excluding the sub header, if any children are picked, the relative parent will be picked as well
      case SearchType.searchInChildren:
      default:
        return tableSource.filter(row => !filter || filter.length === 0 ||
          !row.header && row[searchColumn].toUpperCase().includes(filter) ||
          (row.header && this._getSubSearchItems(row[key]).findIndex(item => item.toUpperCase().includes(filter)) >= 0));
    }
  });

  /**
   * Toggle the sub items of current row
   */
  toggleSubTopic(event, row) {
    const key = this.key();
    if (key != null) {
      const currentFlags = this.itemHiddenFlag();
      const newFlags = { ...currentFlags };
      
      this._getSubItems(row[key]).forEach(subKey => newFlags[subKey] = !newFlags[subKey]);
      // undefined --> all sub items are showing,
      // false -> all sub items are hidden
      newFlags[row[key]] = newFlags[row[key]] === undefined ? false : undefined;
      
      this.itemHiddenFlag.set(newFlags);
    }
  }

  /**
   * Check whether the sub items are in hidden status by key.
   */
  isSubTopicHidden(key) {
    // undefined --> all sub items are showing,
    // false -> all sub items are hidden
    return this.itemHiddenFlag()[key] === false;
  }

  /**
   * get all sub items by key.
   */
  private _getSubItems(key): string[] {
    const tableSource = this.tableSource();
    const keyColumn = this.key();
    
    if (!tableSource || !keyColumn) {
      return [];
    }
    
    const startIndex = tableSource.findIndex(row => row[keyColumn] === key && row.header);
    if (tableSource.length <= startIndex + 1 || startIndex < 0) {
      // the header is the last one, or can't find it, return empty directly
      return [];
    }

    let endIndex = tableSource.slice(startIndex + 1).findIndex(row => row.header);

    if (endIndex < 0 ) {
      // no next header, set index as last item
      endIndex = tableSource.length - 1;
    }
    return tableSource.slice(startIndex + 1, startIndex + endIndex + 1).map(row => row[keyColumn]);
  }

  /**
   * Get parent item of the provided key row
   */
  private _getParentSearchItem(key): string {
    const tableSource = this.tableSource();
    const keyColumn = this.key();
    const searchColumn = this.searchColumn();
    
    if (!tableSource || !keyColumn || !searchColumn) {
      return '';
    }
    
    const childIndex = tableSource.findIndex(row => row[keyColumn] === key && !row.header);
    if (childIndex < 0) {
      return '';
    }
    const slicedTable = tableSource.slice(0, childIndex);
    const parentIndex = slicedTable.map(row => row.header).lastIndexOf(true);
    return parentIndex >= 0 ? slicedTable[parentIndex][searchColumn] : '';
  }

  /**
   * Get sub items of the provided key row.
   */
  private _getSubSearchItems(key): string[] {
    const keys = this._getSubItems(key);
    const tableSource = this.tableSource();
    const keyColumn = this.key();
    const searchColumn = this.searchColumn();
    
    if (!keys || keys.length === 0 || !tableSource || !keyColumn || !searchColumn) {
      return [];
    }
    return tableSource.filter(row => keys.includes(row[keyColumn])).map(row => row[searchColumn]);
  }
}
