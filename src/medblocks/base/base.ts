import { LitElement, property } from 'lit-element';
import { event, EventEmitter, watch } from '../../internal/decorators';

export default abstract class EhrElement extends LitElement {
  @property({ type: String, reflect: true }) path: string;

  @property({ type: String, reflect: true }) label: string;

  abstract data: any;

  abstract input: EventEmitter<any>;

  checkValidation(): boolean {
    return true;
  }
  @event('mb-dependency') mbDependency: EventEmitter<{key: string, value: any}>
  
  @event('mb-connect') mbConnect : EventEmitter<{path: string}>

  @event('mb-disconnect') mbDisconnect: EventEmitter<{path: string}>

  connectedCallback(){
    super.connectedCallback()
    this.mbConnect.emit({detail: this.path})
  }

  disconnectedCallback(){
    super.disconnectedCallback()
    this.mbDisconnect.emit({detail: this.path})
  }

  @watch('data')
  handleDataChange() {
    this.input.emit();
  }
}
