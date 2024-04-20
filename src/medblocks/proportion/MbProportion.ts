import { css, html, property } from 'lit-element';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import { ifDefined } from 'lit-html/directives/if-defined';
import EhrElement from '../EhrElement';

export default abstract class MbProportion extends EhrElement {
  static styles = css`
    .no-icon::part(icon) {
      display: none;
    }

    sl-input {
      width: 0;
      flex: 3 1 auto;
      min-width: 75px;
    }

    .margin-xs {
      margin-right: var(--sl-spacing-x-small);
    }

    sl-select {
      flex: 1 1 auto;
      width: 0;
      min-width: 100px;
    }

    :host {
      display: flex;
      flex: 1;
      align-items: flex-end;
    }
  `;

  abstract type: string;

  abstract max: number | string;

  abstract min: number | string;

  @property({ type: Object }) data:
    | {
        denominator: number;
        numerator: number;
        type: number;
      }
    | undefined = undefined;

  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @property({ type: Boolean, reflect: true }) hoist: boolean = false;

  @property({ type: String, reflect: true }) step: string;

  @property({ type: Boolean, reflect: true }) disabled: boolean;

  @property({ type: String, reflect: true }) placeholder = '';

  @property({ type: String, reflect: true }) id = 'proportion';

  @property({ type: Boolean }) hideunit = false;

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

  getStep() {
    if (this.step) {
      return this.step;
    }
    if (this.type === 'unitary') {
      return '0.01';
    }
    return '';
  }

  getText() {
    if (this.data?.numerator) {
      if (this.type === 'percent') {
        return `${this.data?.numerator} %`;
      }
      return this.data?.numerator;
    }
    return '-';
  }

  render() {
    if (this.variant === 'text') {
      return html`<div>
        ${this._label()}
        <p>${this.getText()}</p>
      </div>`;
    }
    return html`<sl-input
        id=${`${this.id}-magnitude`}
        .required=${this.required}
        .min=${this.min}
        .max=${this.max}
        .size=${this.variant === 'small' ? 'small' : 'medium'}
        .disabled=${this.disabled}
        type="number"
        .step=${this.getStep()}
        label=${ifDefined(this.label)}
        @sl-input=${this._handleChange}
        class=${this.hideunit ? '' : 'margin-xs'}
        .value=${this.data?.numerator?.toString() || ''}
        placeholder=${this.placeholder}
      >
      </sl-input>
      <sl-select
        id=${`${this.id}-unit`}
        style="${this.hideunit ? 'display: none' : ''}"
        placeholder="Select units"
        class="no-icon"
        .hoist=${this.hoist}
        value="unit"
        .size=${this.variant === 'small' ? 'small' : 'medium'}
        disabled
      >
        <sl-menu-item value="unit"
          >${this.type === 'unitary' ? '/ 1' : '%'}</sl-menu-item
        >
      </sl-select> `;
  }
}
