import { css, customElement, html, property } from 'lit-element';
import { event, EventEmitter } from '../../internal/decorators';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import EhrElement from '../EhrElement';

@customElement('mb-date')
export default class MbDateTime extends EhrElement {
  /** @ignore */
  static styles = css`
    sl-input::part(base) {
      width: unset;
    }
  `;
  @property({ type: String }) data: string;

  @property({ type: String, reflect: true }) label: string = '';

  @property({ type: Boolean, reflect: true }) time: boolean = false;

  @property({ type: Boolean, reflect: true }) required: boolean = false;
  
  @property({type: Boolean, reflect: true}) disabled: boolean;

  @event('mb-input') _mbInput: EventEmitter<any>;

  handleInput(e: CustomEvent) {
    const inputElement = e.target as SlInput;
    this.data = inputElement.value;
    this._mbInput.emit();
  }

  reportValidity() {
    const input = this.shadowRoot!.querySelector('sl-input') as SlInput;
    return input.reportValidity();
  }

  render() {
    return html`
      <sl-input
      .disabled=${this.disabled}
        ?required=${this.required}
        type="${this.time ? 'datetime-local' : ('date' as any)}"
        label=${this.label}
        @sl-input=${this.handleInput}
        value=${this.data || ''}
      >
      </sl-input>
    `;
  }
}
