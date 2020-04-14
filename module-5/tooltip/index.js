class Tooltip {
  static instance;

  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
    this.onHover = this.onHover.bind(this);
    this.offHover = this.offHover.bind(this)
  }

  initEventListeners () {
    document.addEventListener('mouseover', this.onHover);
    document.addEventListener('mouseout', this.offHover);
  }

  initialize () {
    this.render();
    this.initEventListeners();
  }

  onHover (event) {
    const tooltipElement = event.target;

    if (tooltipElement.dataset.tooltip != undefined) {
      this.element.innerHTML = tooltipElement.dataset.tooltip;
      const left = event.clientX || 0;
      const top = event.clientY || 0;
      this.element.style = `left: ${left}px; top: ${top}px;`;
      this.element.hidden = false;
    }
  }

  offHover (event) {
    this.element.hidden = true;
  }

  render () {
    const element = document.createElement('div');
    element.classList.add('tooltip');
    this.element = element;
    this.element.hidden = true;
    document.body.prepend(this.element);
  }

  destroy () {
    document.removeEventListener('mouseover', this.onHover);
    document.removeEventListener('mouseout', this.offHover);
  }
}

const tooltip = new Tooltip();

export default tooltip;
