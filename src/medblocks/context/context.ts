import { customElement, property, css } from 'lit-element';
import { event, type EventEmitter } from '../../internal/decorators';
import EhrElement from '../EhrElement';

@customElement('mb-context')
export default class MbContext extends EhrElement {
  /** @ignore */
  static styles = css`
    :host {
      display: none;
    }
  `;

  @property({ type: Object })
  data = undefined;

  @property() bind = undefined;

  @event('mb-input')
  _mbInput: EventEmitter<any>;

  /** Automatically populate this context field if empty */
  @property({ type: Boolean }) autocontext = true;

  /** Automatically populate this context field if empty */

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      this._mbInput.emit();
    }, 50);
  }
}
