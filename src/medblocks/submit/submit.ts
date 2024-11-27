import { customElement, html, LitElement } from 'lit-element';
import { event, type EventEmitter } from '../../internal/decorators';

@customElement('mb-submit')
export default class MbSubmit extends LitElement {
  @event('mb-trigger-submit') submit: EventEmitter<any>;

  handleClick() {
    this.submit.emit();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.handleClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick);
  }

  render() {
    return html` <slot></slot> `;
  }
}
