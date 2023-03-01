import { customElement, html, property } from 'lit-element';
import { event, EventEmitter } from '../../internal/decorators';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import EhrElement from '../EhrElement';

/**
 * An input element to capture number
 * @inheritdoc
 */
@customElement('mb-count')
export default class MbCount extends EhrElement {
  @property({ type: Number }) data: number;

  @property({ type: String }) label: string = '';

  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @property({ type: Boolean, reflect: true }) disabled: boolean;

  @property({ type: String, reflect: true }) min = '0';

  @event('mb-input')
  _mbInput: EventEmitter<number>;

  handleInput(e: CustomEvent) {
    const inputElement = e.target as SlInput;
    this.data = parseFloat(inputElement.value);
    this._mbInput.emit();
  }

  reportValidity() {
    let input;
    input = this.shadowRoot!.querySelector('sl-input') as SlInput;
    return input.reportValidity();
  }

  render() {
    if (this.variant === 'text') {
      return html`<div>
        ${this._label()}
        <p>${this.data>=Number(this.min || 0) ? this.data : '-'}</p>
      </div>`;
    }
    return html`
      <sl-input
        .disabled=${this.disabled}
        type="number"
        .size=${this.variant === 'small' ? 'small' : 'medium'}
        .min=${this.min}
        ?required=${this.required}
        label=${this.label}
        @sl-input=${this.handleInput}
        value=${this.data>=Number(this.min || 0) ? this.data : ''}
      ></sl-input>
    `;
  }
}
