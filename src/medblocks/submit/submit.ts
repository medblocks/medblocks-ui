import { customElement, html, LitElement, property } from 'lit-element';
import { event, EventEmitter } from '../../internal/decorators';

@customElement('mb-submit')
export default class MbSubmit extends LitElement {
  @event('mb-trigger-submit') submit: EventEmitter<any>;

  @property({ type: String, reflect: true }) type:
    | 'primary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'text'
    | 'default' = 'default';

  @property({ type: Boolean, reflect: true }) loading: boolean = false;
  @property({ type: String, reflect: true }) label: string = '';
  render() {
    return html`
      ${this.label
        ? html`<label part="label" class="label">${this.label}</label><br />`
        : null}
      <sl-button
        type=${this.type}
        .loading=${this.loading}
        @click=${() => this.submit.emit()}
        ><slot></slot>
      </sl-button>
    `;
  }
}
