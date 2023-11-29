import { customElement, html, property } from 'lit-element';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import { event, EventEmitter } from '../../internal/decorators';
import EhrElement from '../EhrElement';

/**
 * An input element to capture number
 * @inheritdoc
 */
@customElement('mb-count')
export default class MbCount extends EhrElement {
  @property({ type: Number }) data: number;

  @property({ type: String }) label: string = '';

  @property({ type: String, reflect: true }) placeholder: string = '';

  @property({ type: String, reflect: true }) id: string = 'count';

  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @property({ type: Boolean, reflect: true }) disabled: boolean;

  @property({ type: Number, reflect: true }) max: number | string | null;

  @property({ type: Number, reflect: true }) min: number | string | null = 0;

  @event('mb-input')
  _mbInput: EventEmitter<number>;

  handleInput(e: CustomEvent) {
    const inputElement = e.target as SlInput;
    this.data = parseFloat(inputElement.value);
    this._mbInput.emit();
  }

  reportValidity() {
    const input = this.shadowRoot!.querySelector('sl-input') as SlInput;
    return input.reportValidity();
  }

  render() {
    if (this.variant === 'text') {
      return html`<div>
        ${this._label()}
        <p>${this.data >= Number(this.min || 0) ? this.data : '-'}</p>
      </div>`;
    }
    return html`
      <sl-input
        id=${this.id}
        .disabled=${this.disabled}
        type="number"
        .size=${this.variant === 'small' ? 'small' : 'medium'}
        .min=${this.min}
        .max=${this.max}
        ?required=${this.required}
        label=${this.label}
        @sl-input=${this.handleInput}
        value=${this.data >= Number(this.min || 0) ? this.data : ''}
        placeholder=${this.placeholder}
      ></sl-input>
    `;
  }
}

export interface MbCountInputEvent extends CustomEvent{
  target: MbCount;
}

let x: MbCountInputEvent;
