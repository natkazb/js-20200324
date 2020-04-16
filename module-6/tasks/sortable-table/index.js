import fetchJson from "../../utils/fetch-json.js";

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements = {};
  data = [];
  pageSize = 30;

  onSortClick = async (event) => {
    const element = event.target.closest('.sortable-table__cell');
    const columnId = element.dataset.name || '';
    const sortable = (element.dataset.sortable || '') === 'true';
    const order = this.changeDirection(columnId);
    if (sortable) {
      this.subElements.loading.style.display = 'grid';
      const data = this.isSortLocally ? this.sortData(columnId, order) : await this.loadData(columnId, order);
      element.dataset.order = order;
      this.sorted = {
        id: columnId,
        order: order
      };

      this.renderRows(data);
      this.subElements.loading.style.display = 'none';
    }
  };

  constructor(headersConfig = [], {
    url = '',
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    },
    isSortLocally = false
  } = {}) {

    this.headersConfig = headersConfig;
    this.url = new URL(url, BACKEND_URL);
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;

    this.render();
  }

  getTable () {
    let result = '<div class="sortable-table"><div class="sortable-table__header sortable-table__row" data-elem="header">';
    for (let headOne of this.headersConfig) {
      result += `<div class="sortable-table__cell" data-name="${headOne.id}" data-sortable="${headOne.sortable}" data-order="${(headOne.id === this.sorted.id) ? this.sorted.order : ''}">
        <span>${headOne.title}</span>
        <span class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>`;
    }
    result += `</div>
    <div data-elem="body" class="sortable-table__body"></div>
    <div data-elem="loading" class="loading-line sortable-table__loading-line"></div>
    <div data-elem="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    </div>
    </div>`;
    return result;
  }

  renderRows (data) {
    this.subElements.emptyPlaceholder.style.display = 'none';
    let result = '';
    for (let dataOne of data) {
      result += '<div class="sortable-table__row" data-element="">';
      for (let headOne of this.headersConfig) {
        if (headOne.hasOwnProperty('template')) {
          result += `<div class="sortable-table__cell" data-element="">${headOne.template(dataOne[headOne.id] || '')}</div>`;
        } else {
          result += `<div class="sortable-table__cell" data-element="">${dataOne[headOne.id] || ''}</div>`;
        }
      }
      result += '</div>';
    }

    this.subElements.body.innerHTML = result;
    if ((data.length || 0) === 0) {
      this.subElements.emptyPlaceholder.style.display = 'flex';
    }
  }

  async render() {
    const {id, order} = this.sorted;
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTable();

    const element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(element);

    this.element = element;
    this.subElements.loading.style.display = 'grid';

    const data = await this.loadData(id, order);
    this.data = data;

    this.renderRows(data);
    this.subElements.loading.style.display = 'none';

    this.initEventListeners();
  }

  async loadData (id, order) {
    this.url.searchParams.append('_sort', id);
    this.url.searchParams.append('_order', order);
    return fetchJson(this.url, {});
  }

  initEventListeners () {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
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

  sortData (id, order) {
    const arr = [...this.data];
    const column = this.headersConfig.find(item => item.id === id);
    const {sortType, customSorting} = column;
    const direction = order === 'asc' ? 1 : -1;

    return arr.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[id] - b[id]);
        case 'string':
          return direction * a[id].localeCompare(b[id], 'ru');
        case 'custom':
          return direction * customSorting(a, b);
        default:
          return direction * (a[id] - b[id]);
      }
    });
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-elem]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.elem] = subElement;

      return accum;
    }, {});
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
