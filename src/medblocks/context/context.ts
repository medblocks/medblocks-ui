import { customElement, property} from 'lit/decorators.js';
import {css} from "lit";
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

  @property({ type: Object }) bind: any = undefined;

  @event('mb-input')
  _mbInput: EventEmitter<any>;

  @property({ type: Boolean })
  autocontext: boolean = true;

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      this._mbInput.emit();
    }, 50);
  }
}
