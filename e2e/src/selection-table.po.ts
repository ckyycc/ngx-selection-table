import { browser, by, element } from 'protractor';

export class SelectionTablePage {
  navigateTo() {
    return browser.get('/');
  }

  getSelectionTableRows() {
    return element.all(by.tagName('tr'));
  }

  getFirstSubHeadElement() {
    return element(by.css('.subtopic'));
  }

  getSubHeadElements() {
    return element.all(by.css('.subtopic'));
  }

  getFirstCheckMarkElement() {
    return element(by.css('.checkmark'));
  }

  getFirstCheckBoxElement() {
    return element(by.name('check'));
  }

  getCheckMarkElements() {
    return element.all(by.css('.checkmark'));
  }

  getCheckBoxElements() {
    return element.all(by.name('check'));
  }
}
