import { LitElement, property } from 'lit-element';
import { event, EventEmitter, watch } from '../internal/decorators';
import MedblockForm from './form/form';

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

  @property({ type: String, reflect: true }) repeatsuffix?: string;
  @property({ type: String, reflect: true }) repeatprefix?: string;

  mbForm: MedblockForm;
  /**Data of the element. Setting this will emit an input event automatically. */
  abstract data: any;

  isMbElement: boolean = true;
  /**An internal representation of type to handle serializing */
  @property({ type: String, reflect: true })
  datatype?: string;

  /**Event Emitter for mb-input */
  @event('mb-input') _mbInput: EventEmitter<any>;

  /**Function to validate the element during form submit */
  reportValidity(): boolean {
    return true;
  }

  @event('mb-dependency') _mbDependency: EventEmitter<{
    key: string;
    value: any;
  }>;

  @event('mb-path-change')
  _pathChangeHandler: EventEmitter<{ oldPath: string; newPath: string }>;

  @event('mb-connect')
  _mbConnect: EventEmitter<string>;

  // Does not work due to https://github.com/WICG/webcomponents/issues/678, https://github.com/whatwg/dom/issues/533
  // Using MutationObserver in mb-form for now.
  @event('mb-disconnect')
  _mbDisconnect: EventEmitter<string>;

  @watch('path')
  handlePathChange(oldPath: string, newPath: string) {
    this._pathChangeHandler.emit({ detail: { oldPath, newPath } });
  }

  connectedCallback() {
    super.connectedCallback();
    this._mbConnect.emit({ detail: this.path });
    this._mbInput.emit();
  }

  disconnectedCallback(): void {
    if (this.mbForm) {
      this.mbForm.mbElementSet.delete(this);
      this.mbForm.input.emit();
    }
    super.disconnectedCallback();
  }

  // @watch('data')
  // _handleDataChange() {
  //   this._mbInput.emit();
  // }
}
