import { customElement, html, LitElement, property } from 'lit-element';
import { event, EventEmitter } from '../../internal/decorators';

@customElement('mb-submit')
export default class MbSubmit extends LitElement {
  @event('mb-submit') submit: EventEmitter<any>;

  @property({ type: String, reflect: true }) type:
    | 'primary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'text'
    | 'default' = 'default';

  @property({ type: Boolean, reflect: true }) loading: boolean = false;

  render() {
    return html`
      <sl-button
        type=${this.type}
        .loading=${this.loading}
        @click=${() => this.submit.emit()}
        ><slot></slot>
      </sl-button>
    `;
  }
}
