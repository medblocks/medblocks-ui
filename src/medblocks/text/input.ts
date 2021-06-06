import { customElement, html, property } from 'lit-element';
import { event, EventEmitter } from '../../internal/decorators';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/textarea/textarea';
import EhrElement from '../EhrElement';
import SlTextarea from '@shoelace-style/shoelace/dist/components/textarea/textarea';

/**
 * An input element to capture text
 * @inheritdoc
 */
@customElement('mb-input')
export default class MbInput extends EhrElement {
  @property({ type: String }) data: string;

  @property({ type: Boolean, reflect: true }) textarea: boolean = false;

  @property({ type: String }) label: string = '';

  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @property({ type: String, reflect: true }) type: string;

  @property({ type: Number, reflect: true }) min: number;

  @property({ type: Number, reflect: true }) max: number;

  @property({ type: Number, reflect: true }) minlength: number;

  @property({ type: Number, reflect: true }) maxlength: number;

  @event('mb-input')
  _mbInput: EventEmitter<string>;

  handleInput(e: CustomEvent) {
    const inputElement = e.target as SlInput;
    this.data = inputElement.value;
    this._mbInput.emit();
  }

  reportValidity() {
    let input;
    if (this.textarea) {
      input = this.shadowRoot!.querySelector('sl-textarea') as SlTextarea;
    } else {
      input = this.shadowRoot!.querySelector('sl-input') as SlInput;
    }
    return input.reportValidity();
  }

  render() {
    return this.textarea
      ? html`
          <sl-textarea
            .maxlength=${this.maxlength}
            .minlength=${this.minlength}
            ?required=${this.required}
            label=${this.label}
            @sl-input=${this.handleInput}
            value=${this.data || ''}
          ></sl-textarea>
        `
      : html`
          <sl-input
            .min=${this.min}
            .max=${this.max}
            .maxlength=${this.maxlength}
            .minlength=${this.minlength}
            .type=${this.type as any}
            ?required=${this.required}
            label=${this.label}
            @sl-input=${this.handleInput}
            value=${this.data || ''}
          ></sl-input>
        `;
  }
}
