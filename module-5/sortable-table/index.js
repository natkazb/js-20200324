export default class SortableTable {
  element;
  subElements = {};
  headersConfig = [];
  data = [];

  constructor(headersConfig, {
    data = [],
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();
  }

  get header () {
    let result = '<div class="sortable-table__header sortable-table__row">';
    for (let headOne of this.headersConfig) {
      result += `<div class="sortable-table__cell" data-name="${headOne.id}" data-sortable="${headOne.sortable}" data-order="${(headOne.id === this.sorted.id) ? this.sorted.order : ''}">
        <span>${headOne.title}</span>
        <span class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>`;
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

  render() {
    const body = this.body;
    const header = this.header;
    const element = document.createElement('div');
    element.classList.add('sortable-table');
    element.innerHTML = header + body;
    this.element = element;

    const subElement = document.createElement('div');
    subElement.innerHTML = body;
    this.subElements = subElement;

    this.initEventListeners();
    this.sort(this.sorted.id, this.sorted.order);
  }

  initEventListeners () {
    this.element.querySelector('.sortable-table__header').addEventListener('click', (event) => {
      const element = event.target.closest('.sortable-table__cell');
      const columnId = element.dataset.name || '';
      const sortable = (element.dataset.sortable || '') === 'true';
      const order = this.changeDirection(columnId);
      if (sortable) {
        this.sort(columnId, order);
        element.dataset.order = order;
        this.sorted = {
          id: columnId,
          order: order
        };
      }
    });
  }

  changeDirection (columnId) {
    let oldOrder = '';
    if (this.sorted.id === columnId) {
      oldOrder = this.sorted.order;
    }
    let newOrder = '';
    switch (oldOrder) {
      case 'asc': newOrder = 'desc'; break;
      case 'desc': newOrder = 'asc'; break;
      default: newOrder = 'asc'; break;
    }
    return newOrder;
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
    this.subElements = subElement;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
