import escapeHtml from "../../utils/escape-html.js";

export default class ProductFormComponent {
  element;
  subElements = {};
  defaultFormData = {
    title: '',
    description: '',
    subcategory: '',
    price: '',
    discount: '',
    quantity: '',
    status: '',
    images: [],
    categories: []
  };

  onSubmit = event => {
    this.dispatchEvent();
  };

  uploadImage = () => {
    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.click();
  };

  constructor(formData = {}) {
    this.formData = {...this.defaultFormData, ...formData};

    this.render();
  }

  printCategories() {
    let result = `<div class="form-group form-group__half_left">
<label class="form-label">Категория</label>
<select class="form-control" name="category">`;
    for (let category of this.formData.categories) {
      result += `<option value="${category.value}">${category.text}</option>`;
    }
    result += '</select></div>';
    return result;
  }

  printPhoto() {
    let result = `<div class="form-group form-group__wide" data-elem="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-elem="imageListContainer">
          <ul class="sortable-list">`;
    for (let image of this.formData.images) {
      result += `<li class="products-edit__imagelist-item sortable-list__item" style="">
              <input type="hidden" name="url" value="${image.url}">
              <input type="hidden" name="source" value="${image.name}">
              <span>
                <img src="icon-grab.svg" data-grab-handle="" alt="grab">
                <img class="sortable-table__cell-img" alt="Image" src="${image.url}">
                <span>${image.name}</span>
              </span>
              <button type="button">
                <img src="icon-trash.svg" data-delete-handle="" alt="delete">
              </button>
            </li>`;
    }
    result += `</ul>
        </div>
        <button type="button" name="uploadImage" data-elem="uploadImageButton" class="button-primary-outline"><span>Загрузить</span></button>
      </div>`;
    return result;
  }

  printStatus() {
    const status = + this.formData.status;
    const check = (value) => value === status ? 'selected' : '';
    return `<div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" name="status">
          <option value="1" ${check(1)}>Активен</option>
          <option value="0" ${check(0)}>Неактивен</option>
        </select>
      </div>`;
  }

  get template() {
    let result = `<div class="product-form">
    <form data-elem="productForm" class="form-grid" onsubmit="return false;">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" name="title" value="${this.formData.title}" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-elem="productDescription" placeholder="Описание товара">${this.formData.description}</textarea>
      </div>`
      + this.printPhoto() + this.printCategories() +
      `<div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" name="price" value="${this.formData.price}" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" name="discount" value="${this.formData.discount}" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" value="${this.formData.quantity}" name="quantity" placeholder="1">
      </div>`
      + this.printStatus() +
      `<div class="form-buttons">
        <button type="submit" name="save" data-elem="saveButton" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>
  </div>`;
    return result;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);

    this.initEventListeners();
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-elem]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.elem] = subElement;

      return accum;
    }, {});
  }

  dispatchEvent() {
    const event = new CustomEvent('product-saved', {
      detail: this.subElements.productForm.elements
    });
    this.element.dispatchEvent(event);
  }

  initEventListeners() {
    this.subElements.uploadImageButton.addEventListener('click', this.uploadImage);
    this.subElements.saveButton.addEventListener('click', this.onSubmit);
  }

  removeEventListeners() {
    this.subElements.uploadImageButton.removeEventListener('click', this.uploadImage);
    this.subElements.saveButton.removeEventListener('click', this.onSubmit);
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = null;
  }

  remove() {
    this.removeEventListeners();
    this.element.remove();
  }
}
