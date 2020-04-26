import escapeHtml from "../../utils/escape-html.js";
import ImageUploader from '../../image-uploader/index.js';

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

  async upload() {
    let uploader = new ImageUploader();
    const file = this.subElements.file.files[0];
    const fileName = file.name ?? '';

    let result;

    try {
      result = await uploader.upload(file);
      console.log('Изображение загружено');
    } catch(err) {
      alert('Ошибка загрузки изображения');
      console.error(err);
    } finally {
      console.log('Готово');
    }

    const success = result.success ?? false;
    if (success) {
      this.formData.images.push({
        url: result.data.link,
        name: fileName
      });

      this.renderImages();
    }
  }

  uploadImage = () => {
    this.subElements.file.click();
    this.subElements.file.onchange = this.upload.bind(this);
  };

  deleteImage = (event) => {
    const deleteButton = event.target;
    this.formData.images.splice(deleteButton.dataset.deleteHandle, 1);
    this.renderImages();
  }

  constructor(formData = {}) {
    this.formData = {...this.defaultFormData, ...formData};

    this.render();
  }

  printCategories() {
    let result = `<div class="form-group form-group__half_left">
<label class="form-label">Категория</label>
<select class="form-control" name="category" data-elem="subcategory">`;
    for (let category of this.formData.categories) {
      result += `<option value="${category.value}">${category.text}</option>`;
    }
    result += '</select></div>';
    return result;
  }

  printPhoto() {
    let result = `<label class="form-label">Фото</label>
        <div data-elem="imageListContainer">
          <ul class="sortable-list">`;
    let index = 0;
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
                <img src="icon-trash.svg" data-delete-handle="${index}" alt="delete">
              </button>
            </li>`;
      index++;
    }
    result += `</ul>
        </div>
        <input type="file" data-elem="file" style="display: none;">
        <button type="button" name="uploadImage" data-elem="uploadImageButton" class="button-primary-outline"><span>Загрузить</span></button>`;
    return result;
  }

  printStatus() {
    const status = + this.formData.status;
    const check = (value) => value === status ? 'selected' : '';
    return `<div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" data-elem="status" name="status">
          <option value="1" ${check(1)}>Активен</option>
          <option value="0" ${check(0)}>Неактивен</option>
        </select>
      </div>`;
  }

  get template() {
    return `<div class="product-form">
    <form data-elem="productForm" class="form-grid" onsubmit="return false;">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" data-elem="title" name="title" value="${this.formData.title}" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-elem="description" placeholder="Описание товара">${this.formData.description}</textarea>
      </div>
      <div class="form-group form-group__wide" data-elem="sortable-list-container">
      ${this.printPhoto()}
      </div>
      ${this.printCategories()}
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" data-elem="price" name="price" value="${this.formData.price}" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" data-elem="discount" name="discount" value="${this.formData.discount}" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" data-elem="quantity" class="form-control" value="${this.formData.quantity}" name="quantity" placeholder="1">
      </div>
      ${this.printStatus()}
      <div class="form-buttons">
        <button type="submit" name="save" data-elem="saveButton" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>
  </div>`;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);

    this.initEventListeners();
  }

  renderImages() {
    this.subElements['sortable-list-container'].innerHTML = this.printPhoto();
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-elem]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.elem] = subElement;

      return accum;
    }, {});
  }

  setValues() {
    for (let key in this.formData) {
      if (key === 'images') {
        const urls = this.subElements.imageListContainer.querySelectorAll('input[name="url"]');
        const sources = this.subElements.imageListContainer.querySelectorAll('input[name="source"]');
        this.subElements[key] = [];
        for (let i = 0; i < urls.length; i++) {
          this.subElements[key].push({
            url: urls[i],
            name: sources[i]
          });
        }
      } else if (this.subElements[key] !== undefined) {
        this.formData[key] = this.subElements[key].value ?? '';
      }
    }
  }

  dispatchEvent() {
    this.setValues();
    const event = new CustomEvent('product-saved', {
      detail: this.formData
    });
    this.element.dispatchEvent(event);
  }

  initEventListeners() {
    this.subElements.uploadImageButton.addEventListener('click', this.uploadImage);
    this.subElements.saveButton.addEventListener('click', this.onSubmit);
    const buttons = this.element.querySelectorAll('[data-delete-handle]');
    for (let button of buttons) {
      button.addEventListener('click', this.deleteImage);
    }
  }

  removeEventListeners() {
    this.subElements.uploadImageButton.removeEventListener('click', this.uploadImage);
    this.subElements.saveButton.removeEventListener('click', this.onSubmit);
    const buttons = this.element.querySelectorAll('[data-delete-handle]');
    for (let button of buttons) {
      button.removeEventListener('click', this.deleteImage);
    }
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
