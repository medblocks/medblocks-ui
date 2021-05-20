import { LitElement, property } from 'lit-element';
import { event, EventEmitter, watch } from '../internal/decorators';

/**This is an abstract base class to extend other elements from
 * @fires mb-input - Dispatched when the input changes
 * @fires mb-dependency - Dispatched if dependencies are needed from an external or parent source
 * @fires mb-connect - Dispatched when the component connects
 * @fires mb-disconnect - Dispatched when the component disconnects
 */
export default abstract class EhrElement extends LitElement {
  /**Path of the data element. Use the VSCode extension to get the appropriate paths */
  @property({ type: String, reflect: true }) path: string;
  /**Optional label for the element */
  @property({ type: String, reflect: true }) label?: string;

  /**Data of the element. Setting this will emit an input event automatically. */
  abstract data: any;

  /**An internal representation of type to handle serializing */
  @property({type: String, reflect: true})
  type?: string;

  /**Event Emitter for mb-input */
  @event('mb-input') _mbInput: EventEmitter<any>;

  /**Function to validate the element during form submit */
  checkValidation(): boolean {
    return true;
  }
  @event('mb-dependency') _mbDependency: EventEmitter<{
    key: string;
    value: any;
  }>;

  @event('mb-connect') _mbConnect: EventEmitter<{ path: string }>;

  @event('mb-disconnect') _mbDisconnect: EventEmitter<{ path: string }>;

  connectedCallback() {
    super.connectedCallback();
    this._mbConnect.emit({ detail: this.path });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._mbDisconnect.emit({ detail: this.path });
  }

  @watch('path')
  handlePathChange(oldPath: string, newPath: string) {
    this._mbDisconnect.emit({ detail: oldPath });
    this._mbConnect.emit({ detail: newPath });
  }
  @watch('data')
  _handleDataChange() {
    this._mbInput.emit();
  }
}
