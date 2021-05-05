import { css, customElement, html, property } from 'lit-element';
import { event, EventEmitter } from '../../internal/decorators';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import EhrElement from '../EhrElement';

@customElement('mb-date')
export default class MbDateTime extends EhrElement {
  static styles = css`
    sl-input::part(base) {
      width: unset;
    }
  `;
  @property({ type: String }) data: string;

  @property({ type: String, reflect: true }) label: string = '';

  @property({ type: Boolean, reflect: true }) time: boolean = false;

  @event('mb-input') _mbInput: EventEmitter<any>;

  handleInput(e: CustomEvent) {
    const inputElement = e.target as SlInput;
    this.data = inputElement.value;
    this._mbInput.emit();
  }

  render() {
    return html`
      <sl-input
        type="${this.time ? 'datetime-local' : ('date' as any)}"
        label=${this.label}
        @sl-input=${this.handleInput}
        value=${this.data || ''}
      >
      </sl-input>
    `;
  }
}
