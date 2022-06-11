import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { event, EventEmitter } from '../../internal/decorators';

@customElement('mb-submit')


export default class MbSubmit extends LitElement {
  @event('mb-trigger-submit') submit: EventEmitter<any>;
  handleClick() {
    this.submit.emit()
  }
  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('click', this.handleClick)
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick)
  }
  render() {
    return html`
      <slot></slot>
    `;
  }
}
