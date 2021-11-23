import { customElement, html, property } from 'lit-element';
import EhrElement from '../EhrElement';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/input/input';
import { ifDefined } from 'lit-html/directives/if-defined';

@customElement('mb-proportion')
export default class MbPercent extends EhrElement {
  @property({ type: Object }) data:
    | {
        denominator: number;
        numerator: number;
        type: number;
      }
    | undefined = undefined;

  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @property({ type: Number, reflect: true }) max: number | string;

  @property({ type: Number, reflect: true }) min: number | string;

  @property({ type: String, reflect: true }) step: string = "0.01";

  @property({type: String, reflect: true}) type: 'percent' | 'unitary'

  _handleChange(e: CustomEvent) {
    const inputElement = e.target as SlInput;
    if (inputElement.value === '') {
      this.data = undefined;
    } else {
      this.data = {
        numerator: parseFloat(inputElement.value),
        denominator: this.type === 'unitary' ? 1 : 100,
        type: this.type === 'unitary' ? 1 : 2,
      };
    }
    this._mbInput.emit();
  }

  reportValidity() {
    const input = this.shadowRoot!.querySelector('sl-input') as SlInput;
    return input.reportValidity();
  }

  render() {
    return html`<sl-input
      ?required=${this.required}
      .min=${this.min}
      .max=${this.max}
      type="number"
      step=${this.step}
      label=${ifDefined(this.label)}
      @sl-input=${this._handleChange}
      .value=${this.data?.numerator?.toString() || ''}
    >
    <sl-icon name=${this.type === 'unitary' ? 'decimal': 'percent'} library="medblocks" slot="prefix"></sl-icon>
    </sl-input>`;
  }
}
