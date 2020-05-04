import escapeHtml from "../../utils/escape-html.js";
import ImageUploader from '../../image-uploader/index.js';
import fetchJson from "../../utils/fetch-json.js";

const URL_BACKEND = 'https://course-js.javascript.ru/api/rest/';

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

  constructor(id) {
    this.formData = this.defaultFormData;
    this.render();

    Promise.all([this.loadProduct(id), this.loadCategories()]).then(data => {
      const formData = data[0] ?? this.defaultFormData;
      const categories = data[1] ?? [];
      for (let item in this.defaultFormData) {
        this.formData[item] = formData[0][item] ?? this.defaultFormData[item];
      }
      for (let category of categories) {
        for (let subCategory of category.subcategories) {
          this.formData.categories.push({value: subCategory.id, text: `${category.title} > ${subCategory.title}`});
        }
      }
      this.renderFormData();
    });
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
  }

  loadProduct(id) {
    const url = new URL(`products?id=${id}`, URL_BACKEND);
    return fetchJson(url, {});
  }

  loadCategories() {
    const url = new URL('categories?_sort=weight&_refs=subcategory', URL_BACKEND);
    return fetchJson(url, {});
  }

  renderFormData() {
    const formElements = this.subElements.productForm.elements ?? [];
    let options = '';
    for (let category of this.formData.categories) {
      options += `<option value="${category.value}">${category.text}</option>`;
    }
    formElements['category'].innerHTML = options;
    formElements['category'].value = this.formData['subcategory'];
    for (let item in this.defaultFormData) {
      if (['images', 'categories', 'subcategory'].includes(item)) {
        continue;
      }
      formElements[item].value = this.formData[item];
    }

    this.subElements.imageListContainer.innerHTML = this.renderPhoto();

    this.initEventListeners();
  }

  renderPhoto() {
    let images = '<ul class="sortable-list">';
    let index = 0;
    for (let image of this.formData.images) {
      images += `<li class="products-edit__imagelist-item sortable-list__item" style="">
              <input type="hidden" name="url" value="${image.url}">
              <input type="hidden" name="source" value="${image.source}">
              <span>
                <img src="icon-grab.svg" data-grab-handle="" alt="grab">
                <img class="sortable-table__cell-img" alt="Image" src="${image.url}">
                <span>${image.source}</span>
              </span>
              <button type="button">
                <img src="icon-trash.svg" data-delete-handle="${index}" alt="delete">
              </button>
            </li>`;
      index++;
    }
    images += '</ul>';
    return images;
  }

  get template() {
    return `<div class="product-form">
    <form data-elem="productForm" class="form-grid" onsubmit="return false;">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" data-elem="title" name="title" value="" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-elem="description" placeholder="Описание товара"></textarea>
      </div>
      <div class="form-group form-group__wide" data-elem="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-elem="imageListContainer"></div>
        <input type="file" data-elem="file" style="display: none;">
        <button type="button" name="uploadImage" data-elem="uploadImageButton" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" name="category" data-elem="subcategory">
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" data-elem="price" name="price" value="" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" data-elem="discount" name="discount" value="" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" data-elem="quantity" class="form-control" value="" name="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" data-elem="status" name="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" data-elem="saveButton" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>
  </div>`;
  }

  renderImages() {
    this.subElements['imageListContainer'].innerHTML = this.renderPhoto();
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
    const event = new CustomEvent('product-saved', {
      detail: this.formData
    });
    this.element.dispatchEvent(event);
  }

  initEventListeners() {
    this.subElements.uploadImageButton.addEventListener('click', this.onUploadImage);
    this.subElements.saveButton.addEventListener('click', this.onSubmit);
    const buttons = this.subElements.imageListContainer.querySelectorAll('[data-delete-handle]');
    for (let button of buttons) {
      button.addEventListener('click', this.onDeleteImageClick);
    }
  }

  removeEventListeners() {
    this.subElements.uploadImageButton.removeEventListener('click', this.onUploadImage);
    this.subElements.saveButton.removeEventListener('click', this.onSubmit);
    const buttons = this.subElements.imageListContainer.querySelectorAll('[data-delete-handle]');
    for (let button of buttons) {
      button.removeEventListener('click', this.onDeleteImageClick);
    }
  }

  onSubmit = async () => {
    this.setValues();
    //this.dispatchEvent();
    // отправка данных формы
    const data = await this.send();
    // тут вернется ошибка: Access to fetch at 'https://course-js.javascript.ru/api/rest/products' from origin 'http://localhost:63342' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
  };

  send () {
    const url = new URL('products', URL_BACKEND);
    return fetchJson(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      'body': this.formData
    });
  }

  onUploadImage = () => {
    this.subElements.file.click();
    this.subElements.file.onchange = this.upload;
  };

  upload = async () => {
    let uploader = new ImageUploader();
    const file = this.subElements.file.files[0];
    const fileName = file.name ?? '';

    let result;

    try {
      result = await uploader.upload(file);
      const success = result.success ?? false;
      if (success) {
        this.formData.images.push({
          url: result.data.link,
          source: fileName
        });

        this.renderImages();
      }
      console.log('Изображение загружено');
    } catch(err) {
      alert('Ошибка загрузки изображения');
      console.error(err);
    } finally {
      this.subElements.file.onchange = '';
      console.log('Готово');
    }
  }

  onDeleteImageClick = (event) => {
    const deleteButton = event.target;
    this.formData.images.splice(deleteButton.dataset.deleteHandle, 1);
    deleteButton.closest('li').remove();
    //this.renderImages();
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
