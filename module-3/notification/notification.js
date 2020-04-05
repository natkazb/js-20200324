export default class NotificationMessage {
  element;

  constructor(text = '', options = {}) {
    this.text = text;
    this.type = options['type'] ?? 'success';
    this.duration = options['duration'] ?? 4000;

    this.render();
    this.initEventListeners();
  }

  initEventListeners() {
    let f = () => this.destroy();
    const timeout = this.duration;
    //this.element.addEventListener('animationend', function (e) { f(); });
    this.element.addEventListener('start', function (e) { setTimeout(f, timeout); });
  }

  removeEventListeners() {
    let f = () => this.destroy();
    const timeout = this.duration;
    //this.element.removeEventListener('animationend', function (e) { f(); });
    this.element.removeEventListener('start', function (e) { setTimeout(f, timeout); });
  }

  get template () {
    return `
      <div class="${this.type} notification" style="--value:${this.duration}ms">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.text}
        </div>
      </div>
    </div>
    `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.removeEventListeners();
  }

  show(parent = undefined) {
    if (parent !== undefined) {
      parent.append(this.element);
    } else {
      document.body.append(this.element);
    }
    const event = new Event('start');
    this.element.dispatchEvent(event);
  }
}
