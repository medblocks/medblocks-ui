import { customElement, property, css } from 'lit-element';
import { event, EventEmitter } from '../../internal/decorators';
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
  data: any;

  @property() bind: any = undefined;

  @event('mb-input')
  _mbInput: EventEmitter<any>;

  /** Automatically populate this context field if empty */
  @property({ type: Boolean })
  autocontext: boolean = true;

  /** Automatically populate this context field if empty */

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      this._mbInput.emit();
    }, 50);
  }
}

export interface MbContextInputEvent extends CustomEvent {
  target: MbContext;
}
