import { customElement, html, property, css } from 'lit-element';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import SlTextarea from '@shoelace-style/shoelace/dist/components/textarea/textarea';
import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/textarea/textarea';
import { event, EventEmitter } from '../../internal/decorators';
import EhrElement from '../EhrElement';

/**
 * An input element to capture text
 * @inheritdoc
 */
@customElement('mb-input')
export default class MbInput extends EhrElement {
  static styles = css`
    .print-only {
      display: none;
    }

    @media print {
      .print-only {
        display: inline-block;
        margin: 0px;
        padding: 2px;
      }

      sl-input {
        display: none;
      }
      sl-textarea {
        display: none;
      }
    }
  `;

  @property({ type: String }) data: string | undefined;

  @property({ type: Boolean, reflect: true }) textarea: boolean = false;

  @property({ type: String }) label: string = '';

  @property({ type: String, reflect: true }) id: string = 'input';

  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @property({ type: String, reflect: true }) type: string;

  @property({ type: String, reflect: true }) placeholder: string = '';

  @property({ type: Number, reflect: true }) min: number;

  @property({ type: Number, reflect: true }) max: number;

  @property({ type: Number, reflect: true }) minlength: number;

  @property({ type: Number, reflect: true }) maxlength: number;

  @property({ type: Boolean, reflect: true }) disabled: boolean;

  @property({ type: String }) rows = '3';

  @property({ type: String, reflect: true }) resize = 'auto';

  @event('mb-input')
  _mbInput: EventEmitter<string>;

  handleInput(e: CustomEvent) {
    const inputElement = e.target as SlInput;
    this.data = inputElement.value ? inputElement.value : undefined;
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
    if (this.variant === 'text') {
      return html`<div>
        ${this._label()}
        <p>${this.data || '-'}</p>
      </div>`;
    }
    return this.textarea
      ? html`
          <sl-textarea
            id=${this.id}
            .size=${this.variant === 'small' ? 'small' : 'medium'}
            .disabled=${this.disabled}
            .maxlength=${this.maxlength}
            .minlength=${this.minlength}
            ?required=${this.required}
            label=${this.label}
            placeholder=${this.placeholder}
            @sl-input=${this.handleInput}
            value=${this.data || ''}
            rows=${this.rows}
            resize=${this.resize}
          ></sl-textarea>
          <p class="print-only">${this.data || '-'}</p>
        `
      : html`
          <sl-input
            id=${this.id}
            .size=${this.variant === 'small' ? 'small' : 'medium'}
            .disabled=${this.disabled}
            .min=${this.min}
            .max=${this.max}
            .maxlength=${this.maxlength}
            .minlength=${this.minlength}
            .type=${this.type as any}
            ?required=${this.required}
            label=${this.label}
            placeholder=${this.placeholder}
            @sl-input=${this.handleInput}
            value=${this.data || ''}
          ></sl-input>
          <p class="print-only">${this.data || '-'}</p>
        `;
  }
}
