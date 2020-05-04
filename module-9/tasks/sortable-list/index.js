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

    const placeholderElement = document.createElement('li');
    placeholderElement.classList.add(...['sortable-list__item', 'sortable-list__placeholder']);
    this.placeholderElement = placeholderElement;

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
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('dragend', this.onDragEnd);
  };

  onPointerMove = (event) => {
    let moveElement = document.elementFromPoint(event.clientX, event.clientY);
    moveElement = moveElement.closest('li.sortable-list__item');
    if (!moveElement) { // не нашли подходящий элемент для перемещения
      return;
    }
    const copy = this.placeholderElement.cloneNode(true);
    moveElement.before(copy);
    this.placeholderElement.remove();
    this.placeholderElement = copy;
  };

  onDragEnd = (event) => {
    let endElement = document.elementFromPoint(event.clientX, event.clientY);
    endElement = endElement.closest('li.sortable-list__item');
    if (!endElement) { // не нашли подходящий элемент для вставки
      return;
    }
    document.removeEventListener('dragend', this.onDragEnd);
    document.removeEventListener('pointermove', this.onPointerMove);
    this.draggableElement.draggable = false;
    this.draggableElement.classList.remove('sortable-list__item_dragging');
    const copy = this.draggableElement.cloneNode(true);
    endElement.before(copy);
    this.draggableElement.remove();
    this.draggableElement = null;
  };
}
