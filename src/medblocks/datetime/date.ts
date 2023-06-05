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
    .placeholder::part(input) {
      color: var(--sl-input-placeholder-color);
    }
  `;
  @property({ type: String }) data: string | undefined;

  @property({ type: String, reflect: true }) label: string = '';

  @property({ type: String, reflect: true }) max: string = '';

  @property({ type: String, reflect: true }) min: string = '';

  @property({ type: Boolean, reflect: true }) time: boolean = false;

  @property({ type: Boolean, reflect: true }) dvdatetime: boolean = false;

  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @property({ type: Boolean, reflect: true }) disabled: boolean;

  @property({ type: Boolean, reflect: true }) id: string = 'date';


  @event('mb-input') _mbInput: EventEmitter<any>;

  handleInput(e: CustomEvent) {
    const inputElement = e.target as SlInput;
    if (this.time)
      this.data = inputElement.value
        ? new Date(inputElement.value).toISOString()
        : undefined;
    else if (this.dvdatetime)
      this.data = inputElement.value
        ? inputElement.value + 'T00:00:00Z'
        : undefined;
    else this.data = inputElement.value ? inputElement.value : undefined;
    this._mbInput.emit();
  }

  reportValidity() {
    const input = this.shadowRoot!.querySelector('sl-input') as SlInput;
    return input.reportValidity();
  }

  getValue(data: string | undefined, time: boolean) {
    if (time) {
      if (data) {
        const date = data.split('T')[0]; //  ["2022-07-09", "06:27:00.000Z"]
        const timeString = new Date(data).toTimeString(); //   "11:57:00 GMT+0530 (India Standard Time)"
        const time = timeString.slice(0, 5); //   "11:57"
        const dateTime_ = `${date}T${time}`;
        return dateTime_; //   "2022-07-09T11:57"
      } else return '';
    } else {
      if (data) return new Date(data).toISOString().split('T')[0];
      else return '';
    }
  }

  getTextData(data: string) {
    const [date, time] = data.split('T');
    if (this.dvdatetime) {
      return `${date}`;
    } else if (time) {
      const [hours, minutes] = time.split(':');
      return `${date} ${hours}:${minutes}`;
    } else {
      return date;
    }
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
