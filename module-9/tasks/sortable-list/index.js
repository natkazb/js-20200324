export default class SortableList {
  element;
  draggableElement;
  placeholderElement;

  constructor({ items = [] } = {}) {
    this.items = items;

    this.render();
  }

  render() {
    const element = document.createElement('ul');
    element.classList.add('sortable-list');

    for (let item of this.items) {
      const subElement = document.createElement('li');
      subElement.classList.add('sortable-list__item');
      subElement.appendChild(item);
      element.appendChild(subElement);
    }

    this.element = element;

    this.initEventListeners();
  }

  initEventListeners() {
    this.element.addEventListener('pointerdown', this.onPointerDown);
  }

  onPointerDown = (event) => {
    const draggableElement = event.target.closest('li.sortable-list__item');
    if (!draggableElement) { // не нашли подходящий элемент для переноса
      return;
    }
    draggableElement.draggable = true;
    draggableElement.classList.add('sortable-list__item_dragging');
    this.draggableElement = draggableElement;

    const placeholderElement = document.createElement('li');
    placeholderElement.classList.add(...['sortable-list__item', 'sortable-list__placeholder']);
    this.placeholderElement = placeholderElement;

    document.addEventListener('drag', this.onDrag, true);
    document.addEventListener('dragend', this.onDragEnd);
  };

  onDrag = (event) => {
    let moveElement = document.elementFromPoint(event.clientX, event.clientY);
    moveElement = moveElement.closest('li.sortable-list__item');
    if (moveElement === null) { // не нашли подходящий элемент для перемещения
      return;
    }
    const copy = this.placeholderElement.cloneNode(true);
    this.calculatePosition(moveElement, event.clientX, event.clientY, copy);
    this.placeholderElement.remove();
    this.placeholderElement = copy;
  };

  onDragEnd = (event) => {
    document.removeEventListener('dragend', this.onDragEnd);
    document.removeEventListener('pointermove', this.onPointerMove);

    let endElement = document.elementFromPoint(event.clientX, event.clientY);
    endElement = endElement.closest('li.sortable-list__placeholder');
    this.draggableElement.draggable = false;
    this.draggableElement.classList.remove('sortable-list__item_dragging');
    if (endElement !== null) { // нашли подходящий элемент для вставки
      const copy = this.draggableElement.cloneNode(true);
      this.calculatePosition(endElement, event.clientX, event.clientY, copy);
      this.draggableElement.remove();
    }
    this.draggableElement = null;
    this.placeholderElement.remove();
  };

  /**
   * Вычисляет позицию вставки перемещаемого элемента - выше или ниже элемента element
   * и делает вставку
   * @param element
   * @param x
   * @param y
   * @param copy
   */
  calculatePosition(element, x, y, copy) {
    const elementInfo = element.getBoundingClientRect();
    if ((y - elementInfo.top) > elementInfo.height / 2) { // вставить ниже
      element.after(copy);
    } else { // вставить выше
      element.before(copy);
    }
  }
}
