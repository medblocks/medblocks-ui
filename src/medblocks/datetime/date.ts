import { css, customElement, html, property } from 'lit-element';
import type SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import { event, type EventEmitter } from '../../internal/decorators';
import EhrElement from '../EhrElement';

@customElement('mb-date')
export default class MbDateTime extends EhrElement {
  /** @ignore */
  static styles = css`
    sl-input::part(base) {
      width: unset;
    }
    .placeholder::part(input) {
      color: var(--sl-input-placeholder-color);
    }
  `;

  @property({ type: String }) data: string | undefined;

  @property({ type: String, reflect: true }) label = '';

  @property({ type: String, reflect: true }) max = '';

  @property({ type: String, reflect: true }) min = '';

  @property({ type: Boolean, reflect: true }) time = false;

  @property({ type: Boolean, reflect: true }) dvdatetime = false;

  @property({ type: Boolean, reflect: true }) required = false;

  @property({ type: Boolean, reflect: true }) disabled: boolean;

  @property({ type: String, reflect: true }) id = 'date';

  @event('mb-input') _mbInput: EventEmitter<any>;

  handleInput(e: CustomEvent) {
    const inputElement = e.target as SlInput;
    if (this.time)
      this.data = inputElement.value
        ? new Date(inputElement.value).toISOString()
        : undefined;
    else if (this.dvdatetime)
      this.data = inputElement.value
        ? `${inputElement.value}T00:00:00Z`
        : undefined;
    else this.data = inputElement.value ? inputElement.value : undefined;
    this._mbInput.emit();
  }

  reportValidity() {
    const input = this.shadowRoot?.querySelector('sl-input') as SlInput;
    return input.reportValidity();
  }

  getValue(data: string | undefined, isTime: boolean) {
    if (isTime && data) {
      const date = data.split('T')[0];
      const timeString = new Date(data).toTimeString();
      const time = timeString.slice(0, 5);
      return `${date}T${time}`;
    }
    if (!isTime && data) {
      return new Date(data).toISOString().split('T')[0];
    }
    return '';
  }

  getTextData(data: string) {
    const [date, time] = data.split('T');
    if (this.dvdatetime) {
      return date;
    }
    if (time) {
      const [hours, minutes] = time.split(':');
      return `${date} ${hours}:${minutes}`;
    }
    return date;
  }

  render() {
    if (this.variant === 'text') {
      return html`<div>
        ${this._label()}
        <div style="display:flex;">
          <p>${this.data ? this.getTextData(this.data) : '-'}</p>
        </div>
      </div>`;
    }
    return html`
      <sl-input
        id=${this.id}
        part="sl-input"
        class=${this.data ? '' : 'placeholder'}
        .size=${this.variant === 'small' ? 'small' : 'medium'}
        .disabled=${this.disabled}
        ?required=${this.required}
        .max=${this.max}
        .min=${this.min}
        type="${this.time ? 'datetime-local' : 'date'}"
        label=${this.label}
        @sl-input=${this.handleInput}
        value=${this.getValue(this.data, this.time) || ''}
      >
      </sl-input>
    `;
  }
}
