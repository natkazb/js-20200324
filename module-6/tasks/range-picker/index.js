export default class RangePicker {
  element;
  subElements = {};
  // TODO: rename "selectingFrom"
  selectingFrom = true;
  selected = {
    from: new Date(),
    to: new Date()
  };

  constructor({
    from = new Date(),
    to = new Date()} = {}
  ) {
    this.showDateFrom = new Date(from);
    this.selected = {from, to};

    this.render();
  }

  dateOutput (date) {
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  }

  get template () {
    let result = `<div class="rangepicker rangepicker_open">
    <div class="rangepicker__input" data-elem="input">
      <span data-elem="from">${this.dateOutput(this.selected.from)}</span> -
      <span data-elem="to">${this.dateOutput(this.selected.to)}</span>
    </div>
    <div class="rangepicker__selector" data-elem="selector">
      <div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left"></div>
      <div class="rangepicker__selector-control-right"></div>
      <div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime="November">November</time>
        </div>
        <div class="rangepicker__day-of-week">
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>
        <div class="rangepicker__date-grid">`;
    let currentDate = new Date(this.selected.from.getFullYear(), this.selected.from.getMonth(), 1);
    let lastDay = new Date(this.selected.from.getFullYear(), this.selected.from.getMonth()+1, 1);
    lastDay.setDate(lastDay.getDate() - 1);
    let style = `--start-from: ${currentDate.getDay()+1}`;
    while(currentDate < this.selected.from) {
      if (style) {
        result += `<button type="button" class="rangepicker__cell" style="${style}" data-value=${currentDate.toString()}">${currentDate.getDate()}</button>`;
        style = false;
      } else {
        result += `<button type="button" class="rangepicker__cell" data-value=${currentDate.toString()}">${currentDate.getDate()}</button>`;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    result += `<button type="button" class="rangepicker__cell rangepicker__selected-from" data-value=${this.selected.from.toString()}">${this.selected.from.getDate()}</button>`;
    currentDate.setDate(this.selected.from.getDate() + 1);
    while(currentDate <= lastDay) {
      // <button type="button" class="rangepicker__cell" data-value="2019-11-01T17:53:50.338Z" style="--start-from: 5">1</button>
      result += `<button type="button" class="rangepicker__cell rangepicker__selected-between" data-value=${currentDate.toString()}">${currentDate.getDate()}</button>`;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    result += `
        </div>
      </div>
      <div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime="December">December</time>
        </div>
        <div class="rangepicker__day-of-week">
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>
        <div class="rangepicker__date-grid">
`;
    currentDate = new Date(this.selected.to.getFullYear(), this.selected.to.getMonth(), 1);
    style = `--start-from: ${currentDate.getDay()+1}`;
    while(currentDate < this.selected.to) {
      if (style) {
        result += `<button type="button" style="${style}" class="rangepicker__cell rangepicker__selected-between" data-value=${currentDate.toString()}">${currentDate.getDate()}</button>`;
      } else {
        result += `<button type="button" class="rangepicker__cell rangepicker__selected-between" data-value=${currentDate.toString()}">${currentDate.getDate()}</button>`;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    result += `<button type="button" class="rangepicker__cell rangepicker__selected-to" data-value=${this.selected.to.toString()}">${this.selected.to.getDate()}</button>`;
    lastDay = new Date(this.selected.to.getFullYear(), this.selected.to.getMonth()+1, 1);
    lastDay.setDate(lastDay.getDate() - 1);
    currentDate.setDate(this.selected.to.getDate() + 1);
    while(currentDate <= lastDay) {
      // <button type="button" class="rangepicker__cell" data-value="2019-11-01T17:53:50.338Z" style="--start-from: 5">1</button>
      result += `<button type="button" class="rangepicker__cell" data-value=${currentDate.toString()}">${currentDate.getDate()}</button>`;
      currentDate.setDate(currentDate.getDate() + 1);
    }
        result += `
        </div>
      </div>
    </div>
  </div>`;
    return result;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element;
    // ...logic here
    this.initEventListeners();
  }

  getSubElements (element) {
    const subElements = {};

    for (const subElement of element.querySelectorAll('[data-elem]')) {
      subElements[subElement.dataset.elem] = subElement;
    }

    return subElements;
  }

  initEventListeners () {
    // ...logic here
  }

  remove () {
    this.element.remove();
    // ...logic here
  }

  destroy() {
    this.remove();
    // ...logic here
  }
}
