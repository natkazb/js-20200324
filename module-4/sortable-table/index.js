export default class SortableTable {
  element;
  subElements = {header: null, body: null};
  headersConfig = [];
  data = [];

  constructor(headersConfig, {
    data = []
  } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;

    this.render();
  }

  get header () {
    let result = '<div class="sortable-table__header sortable-table__row">';
    for (let headOne of this.headersConfig) {
      result += `<div class="sortable-table__cell">${headOne.title}</div>`;
    }
    result += '</div>';
    return result;
  }

  get body () {
    let result = '';
    for (let dataOne of this.data) {
      result += '<div class="sortable-table__row">';
      for (let headOne of this.headersConfig) {
        if (headOne.hasOwnProperty('template')) {
          result += `<div class="sortable-table__cell">${headOne.template(dataOne[headOne.id])}</div>`;
        } else {
          result += `<div class="sortable-table__cell">${dataOne[headOne.id] || ''}</div>`;
        }
      }
      result += '</div>';
    }
    return result;
  }

  render () {
    const body = this.body;
    const header = this.header;
    const element = document.createElement('div');
    element.classList.add('sortable-table');
    element.innerHTML = header + body;
    this.element = element;

    const subElement = document.createElement('div');
    subElement.innerHTML = body;
    this.subElements.body = subElement;
    subElement.innerHTML = header;
    this.subElements.header = subElement;
  }

  sortStrings (a, b) {
    return a.localeCompare(b);
  }

  sortNumbers (a, b) {
    return a - b;
  }

  sortDirection (sortFunction, order, field, a, b) {
    let direction = 1;
    if (order === 'desc') {
      direction = -1;
    }
    return direction * sortFunction(a[field], b[field]);
  }

  sort (field, order) {
    let headOne;
    for (headOne of this.headersConfig) {
      if (headOne.id === field) {
        break;
      }
    }
    if (headOne.sortable || true) {
      let sortFunction = this.sortNumbers;

      if (headOne.sortType === 'string') {
        sortFunction = this.sortStrings;
      }

      this.data = this.data.sort((a, b) => this.sortDirection(sortFunction, order, field, a, b));
      this.update();
    }
  }

  update () {
    while (this.element.children.length > 1) {
      this.element.removeChild(this.element.lastChild);
    }
    const body = this.body;
    const subElement = document.createElement('div');
    subElement.innerHTML = body;
    this.element.append(subElement);
    this.subElements.body = subElement;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {header: null, body: null};
  }
}
