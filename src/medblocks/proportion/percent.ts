import { customElement, html, property } from 'lit-element';
import EhrElement from '../EhrElement';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/input/input';
import { ifDefined } from 'lit-html/directives/if-defined';

@customElement('mb-percent')
export default class MbPercent extends EhrElement {
  @property({ type: Object }) data:
    | {
        denominator: number;
        numerator: number;
        type: number;
      }
    | undefined = undefined;

  _handleChange(e: CustomEvent) {
    const inputElement = e.target as SlInput;
    this.data = {
      numerator: parseFloat(inputElement.value),
      denominator: 100,
      type: 2,
    };
    this._mbInput.emit();
  }

  render() {
    return html`<sl-input
      type="number"
      label=${ifDefined(this.label)}
      @sl-input=${this._handleChange}
      .value=${this.data?.numerator?.toString() || ''}
    ></sl-input>`;
  }
}
