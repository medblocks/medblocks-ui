import { customElement, html, property } from 'lit-element';
import { event, EventEmitter } from '../../internal/decorators';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/textarea/textarea';
import EhrElement from '../base/base';

@customElement('mb-input')
export default class MbInput extends EhrElement {
  @property({ type: String }) data: string;

  @property({ type: Boolean, reflect: true }) textarea: boolean = false;

  @property({ type: String }) label: string = '';

  @event('mb-input')
  input: EventEmitter<string>;

  handleInput(e: CustomEvent) {
    const inputElement = e.target as SlInput;
    this.data = inputElement.value;
    this.input.emit();
  }

  render() {
    return this.textarea
      ? html`
          <sl-textarea
            label=${this.label}
            @sl-input=${this.handleInput}
            value=${this.data || ''}
          ></sl-textarea>
        `
      : html`
          <sl-input
            label=${this.label}
            @sl-input=${this.handleInput}
            value=${this.data || ''}
          ></sl-input>
        `;
  }
}
