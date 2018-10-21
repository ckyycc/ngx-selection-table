import { SelectionTablePage } from './selection-table.po';

describe('workspace-project App', () => {
  let page: SelectionTablePage;

  beforeEach(() => {
    page = new SelectionTablePage();
  });

  it('should display a list of item', () => {
    page.navigateTo();
    expect(page.getSelectionTableRows().count()).toEqual(36);
  });

  it('click sub header should hide all children', () => {
    page.navigateTo();
    page.getFirstSubHeadElement().click();
    expect(page.getSelectionTableRows().count()).toEqual(24);
  });

  it('click all sub headers should hide all items', () => {
    page.navigateTo();
    page.getSubHeadElements().each(element => element.click());
    expect(page.getSelectionTableRows().count()).toEqual(5);
  });

  it('click on checkmark should toggle the check value', () => {
    page.navigateTo();
    page.getFirstCheckMarkElement().click();
    expect(page.getFirstCheckBoxElement().isSelected()).toBeTruthy();
    page.getFirstCheckMarkElement().click();
    expect(page.getFirstCheckBoxElement().isSelected()).toBeFalsy();
  });

  it('click on first 20 checkmarks should toggle the check value for all the first 10 checkmarks', () => {
    page.navigateTo();
    page.getCheckMarkElements().each((e, i) => { if (i < 20) { e.click(); }});
    page.getCheckBoxElements().each((e, i) =>  { if (i < 20) { expect(e.isSelected()).toBeTruthy(); }});
    page.getCheckMarkElements().each((e, i) => { if (i < 20) { e.click(); }});
    page.getCheckBoxElements().each((e, i) =>  { if (i < 20) { expect(e.isSelected()).toBeFalsy(); }});
  });

  it('click on first sub item should toggle the check value (filter === true)', () => {
    page.navigateTo();
    page.getSelectionTableRows().each((e, i) => { if (i === 3) { e.click(); }});
    expect(page.getFirstCheckBoxElement().isSelected()).toBeTruthy();
    page.getSelectionTableRows().each((e, i) =>  { if (i === 3) { e.click(); }});
    expect(page.getFirstCheckBoxElement().isSelected()).toBeFalsy();
  });

  it('click on first 5 sub items should toggle the check values (filter === true)', () => {
    page.navigateTo();
    page.getSelectionTableRows().each((e, i) => { if (i > 2 && i < 8) { e.click(); }});
    page.getCheckBoxElements().each((e, i) =>   { if (i < 5) { expect(e.isSelected()).toBeTruthy(); }});
    page.getSelectionTableRows().each((e, i) =>  { if (i > 2 && i < 8) { e.click(); }});
    page.getCheckBoxElements().each((e, i) =>   { if (i < 5) { expect(e.isSelected()).toBeFalsy(); }});
  });

});
