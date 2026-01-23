import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Output, input, signal, computed, effect } from '@angular/core';

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
  // Internal table state with shallow copy to avoid shared references
  private readonly _tableState = signal<any[]>([]);
  readonly tableState = this._tableState.asReadonly();
  
  // Signals for reactive state
  filterValue = signal<string>('');
  itemHiddenFlag = signal<{[key: string]: boolean | undefined}>({});

  constructor() {
    effect(() => {
      const src = this.tableSource() ?? [];
      this._tableState.set(src.map(r => ({ ...r })));
    }, { allowSignalWrites: true });
  }

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
      const key = this.key();
      const currentState = this.tableState();
      
      // Create updated state with immutable updates
      const updatedState = currentState.map(tableRow => {
        if (tableRow[key] === row[key]) {
          // Toggle the current row's checked state
          return { ...tableRow, checked: !tableRow.checked };
        } else if (!this.multiSelection() && !row.checked && tableRow.checked) {
          // If multiSelection is false and we're checking a new row, uncheck others
          return { ...tableRow, checked: false };
        }
        return tableRow;
      });
      
      // Update internal state - this will trigger reactivity
      this._tableState.set(updatedState);
      
      // Find the updated row for the event
      const updatedRow = updatedState.find(r => r[key] === row[key]);
      event.tableRow = updatedRow;
      this.change.emit(event);
    }
  }

  /**
   * Get all the columns that need to be displayed.
   * "header", "checked" and columns in hiddenColumns will be excluded.
   */
  columns = computed<string[]>(() => {
    const tableState = this.tableState();
    if (tableState && tableState.length > 0) {
      const hiddenColumns = this.hiddenColumns() || [];
      const tableRow = tableState.find(row => !row.header);
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
    const tableState = this.tableState();
    if (tableState && tableState.length > 0) {
      const hiddenColumns = this.hiddenColumns() || [];
      const tableRow = tableState.find(row => row.header);
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
    const tableState = this.tableState();
    
    if (!searchColumn || !tableState) {
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
        return tableState.filter(row => !filter || filter.length === 0 ||
          row[searchColumn].toUpperCase().includes(filter) ||
          (row.header && this._getSubSearchItems(row[key]).findIndex(item => item.toUpperCase().includes(filter)) >= 0));
      // search including the sub header, all it's children will be picked as well,
      // if any children are picked, the relative parent will be picked as well
      case SearchType.searchAll:
        return tableState.filter(row => !filter || filter.length === 0 ||
          row[searchColumn].toUpperCase().includes(filter) ||
          (!row.header && this._getParentSearchItem(row[key]).toUpperCase().includes(filter)) ||
          (row.header && this._getSubSearchItems(row[key]).findIndex(item => item.toUpperCase().includes(filter)) >= 0)
        );
      // search excluding the sub header, if any children are picked, the relative parent will be picked as well
      case SearchType.searchInChildren:
      default:
        return tableState.filter(row => !filter || filter.length === 0 ||
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
    const tableState = this.tableState();
    const keyColumn = this.key();
    
    if (!tableState || !keyColumn) {
      return [];
    }
    
    const startIndex = tableState.findIndex(row => row[keyColumn] === key && row.header);
    if (tableState.length <= startIndex + 1 || startIndex < 0) {
      // the header is the last one, or can't find it, return empty directly
      return [];
    }

    let endIndex = tableState.slice(startIndex + 1).findIndex(row => row.header);

    if (endIndex < 0 ) {
      // no next header, set index as last item
      endIndex = tableState.length - 1;
    }
    return tableState.slice(startIndex + 1, startIndex + endIndex + 1).map(row => row[keyColumn]);
  }

  /**
   * Get parent item of the provided key row
   */
  private _getParentSearchItem(key): string {
    const tableState = this.tableState();
    const keyColumn = this.key();
    const searchColumn = this.searchColumn();
    
    if (!tableState || !keyColumn || !searchColumn) {
      return '';
    }
    
    const childIndex = tableState.findIndex(row => row[keyColumn] === key && !row.header);
    if (childIndex < 0) {
      return '';
    }
    const slicedTable = tableState.slice(0, childIndex);
    const parentIndex = slicedTable.map(row => row.header).lastIndexOf(true);
    return parentIndex >= 0 ? slicedTable[parentIndex][searchColumn] : '';
  }

  /**
   * Get sub items of the provided key row.
   */
  private _getSubSearchItems(key): string[] {
    const keys = this._getSubItems(key);
    const tableState = this.tableState();
    const keyColumn = this.key();
    const searchColumn = this.searchColumn();
    
    if (!keys || keys.length === 0 || !tableState || !keyColumn || !searchColumn) {
      return [];
    }
    return tableState.filter(row => keys.includes(row[keyColumn])).map(row => row[searchColumn]);
  }
}
