import { customElement, property } from 'lit-element';
import { event, EventEmitter } from '../../internal/decorators';
import EhrElement from '../base/base';

@customElement('mb-context')
export default class MbContext extends EhrElement {
  @property({ type: Object })
  data: any;

  @event('mb-input')
  input: EventEmitter<any>;

  @property({ type: Boolean })
  autocontext: boolean = true;

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      this.input.emit();
    }, 50);
  }
}
