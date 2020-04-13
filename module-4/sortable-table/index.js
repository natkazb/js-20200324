export default class SortableTable {
  element;
  subElements = {};
  headersConfig = [];
  data = [];

  static CONST_STRING = 'string';
  static CONST_NUMBER = 'number';
  static CONST_ASC = 'asc';
  static CONST_DESC = 'desc';

  constructor(headersConfig, {
    data = []
  } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;

    this.render();
  }

  get template () {
    let result = '<div class="sortable-table__header sortable-table__row">';
    for (let headOne of this.headersConfig) {
      result += `<div class="sortable-table__cell">${headOne.title}</div>`;
    }
    result += '</div>';

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
    const element = document.createElement('div');
    element.classList.add('sortable-table');

    element.innerHTML = this.template;
    this.element = element;
    this.subElements = this.element.children;
  }

  sort (field, order) {
    let headOne;
    for (headOne of this.headersConfig) {
      if (headOne.id === field) {
        break;
      }
    }
    let sortFunction;
    if (headOne.sortable || true) {
      let direction = 1;
      if (order === SortableTable.CONST_DESC) {
        direction = -1;
      }

      sortFunction = (a, b) => {return direction * (a[field] - b[field])};

      if (headOne.sortType === SortableTable.CONST_STRING) {
        sortFunction = (a, b) => {
          //a[field].localeCompare(b[field], 'default', {caseFirst: 'upper'})
          const bandA = a[field].toUpperCase();
          const bandB = b[field].toUpperCase();

          let comparison = 0;
          if (bandA > bandB) {
            comparison = 1;
          } else if (bandA < bandB) {
            comparison = -1;
          }
          return direction * comparison;
        };
      }

      this.data = this.data.sort(sortFunction);
      this.update();
    }
  }

  update () {
    this.element.innerHTML = this.template;
    this.subElements = this.element.children;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}

