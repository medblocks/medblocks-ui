import { customElement, html, LitElement, property } from 'lit-element';

@customElement('mb-hide')
export default class MbHide extends LitElement {
  @property({ type: Boolean, reflect: true })
  show = false;

  @property({ type: String, reflect: true })
  path: string;

  render() {
    return html`
      <style>
        :host {
          display: ${this.show ? 'block' : 'none'};
        }
      </style>
      <slot></slot>
    `;
  }
}
