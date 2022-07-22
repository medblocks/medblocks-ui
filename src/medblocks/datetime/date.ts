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
  @property({ type: String }) data: string | undefined;

  @property({ type: String, reflect: true }) label: string = '';

  @property({ type: Boolean, reflect: true }) time: boolean = false;

  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @property({ type: Boolean, reflect: true }) disabled: boolean;

  @event('mb-input') _mbInput: EventEmitter<any>;

  handleInput(e: CustomEvent) {
    const inputElement = e.target as SlInput;
    if (this.time)
      this.data = inputElement.value
        ? new Date(inputElement.value).toISOString()
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

  render() {
    return html`
      <sl-input
        .disabled=${this.disabled}
        ?required=${this.required}
        type="${this.time ? 'datetime-local' : 'date'}"
        label=${this.label}
        @sl-input=${this.handleInput}
        value=${this.getValue(this.data, this.time) || ''}
      >
      </sl-input>
    `;
  }
}
