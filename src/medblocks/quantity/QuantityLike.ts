import {
  css,

  html,
  property,
  query,
  state,
} from 'lit-element';
import MbUnit from './unit';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/menu/menu';
import '@shoelace-style/shoelace/dist/components/select/select';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button';
import { ifDefined } from 'lit-html/directives/if-defined';
import EhrElement from '../EhrElement';

export default abstract class QuantityLike extends EhrElement {
  /** @ignore */
  static styles = css`
    .no-icon::part(icon) {
      display: none;
    }

    :host {
      display: flex;
      flex: 1;
      align-items: flex-end;
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
      sl-select {
        display: none;
      }
    }

    sl-input::part(input) {
      margin-right: -14px;
      -webkit-appearance: none;
      -moz-appearance: textfield;
    }
  `;

  /**The default unit to choose. Must be the `value` of a child mb-option element */
  @property({ type: String, reflect: true }) default: string;

  /** Required form validation */
  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @property({ type: Number, reflect: true }) max: number | string | null;

  @property({ type: Number, reflect: true }) min: number | string | null = 0;
  /** Hides the units. Make sure to set a default unit, or set it programatically. */
  @property({ type: Boolean, reflect: true }) hideunit: boolean = false;

  @property({ type: Boolean, reflect: true }) disabled: boolean;

  @property({ type: Number, reflect: true }) step: number;

  @property({ type: String, reflect: true }) placeholder = '';

  @property({ type: Boolean }) hideicon = false;

  /** Automatically disables the unit if only a single unit is present */
  @property({ type: Boolean, reflect: true }) enablesingleunit: boolean = false;
  @state()
  units: MbUnit[] = [];

  handleChildChange() {
    this.units = [...(this.querySelectorAll('mb-unit') as NodeListOf<MbUnit>)];
  }

  reportValidity() {
    const input = this.shadowRoot!.querySelector('sl-input') as SlInput;
    return input.reportValidity();
  }

  @query('sl-input')
  inputElement: SlInput;

  @query('sl-select')
  selectElement: SlSelect;

  connectedCallback() {
    super.connectedCallback();
    const observer = new MutationObserver(() => {
      this.handleChildChange();
    });
    observer.observe(this, { attributes: true, childList: true });
  }

  _disabled() {
    return (
      this.disabled || (this.enablesingleunit ? false : this.units.length === 1)
    );
  }

  handleInput() {
    const magnitude = this.inputElement.value
      ? parseFloat(this.inputElement.value)
      : undefined;
    const unit = (this.selectElement.value as string) || this.default;
    if (magnitude == null) {
      this.data = undefined;
    } else {
      this.data = {
        unit,
        magnitude,
      };
    }
    let Unit = this.units.filter(
      unit => unit.unit === this.selectElement.value
    )[0];

    this.max = Unit ? Unit.max : null;
    this.min = Unit ? Unit.min : null;
    this._mbInput.emit();
  }

  get displayUnit() {
    if (this.data?.unit) {
      return this.data?.unit;
    }
    if (this.default) {
      return this.default;
    }
    return '';
  }

  render() {
    if (this.variant === 'text') {
      return html`<div>
        ${this._label()}
        <div style="display:flex;gap:0 8px">
          <p>${this.data?.magnitude || '-'}</p>
          <p>${this.data?.unit || '-'}</p>
        </div>
      </div>`;
    }
    return html`
      <sl-input
        class=${this.hideunit ? '' : 'margin-xs'}
        .size=${this.variant === 'small' ? 'small' : 'medium'}
        .disabled=${this.disabled}
        .step=${this.step ?? 'any'}
        .required=${this.required}
        .max=${this.max}
        .min=${this.min}
        label=${ifDefined(this.label)}
        type="number"
        @sl-input=${this.handleInput}
        .value=${this.data?.magnitude?.toString() || ''}
        placeholder=${this.placeholder}
      ></sl-input>
      <sl-select
        .disabled=${this._disabled()}
        class="${this._disabled() || this.hideicon ? 'no-icon' : ''}"
        style="${this.hideunit ? 'display: none' : ''}"
        placeholder="Select units"
        .hoist=${true}
        .value=${this.displayUnit}
        .size=${this.variant === 'small' ? 'small' : 'medium'}
        @sl-change=${this.handleInput}
      >
        ${this.units.map(
          unit =>
            html`<sl-menu-item
              value=${unit.unit}
              max=${unit.max}
              min=${unit.min}
              >${unit.label}</sl-menu-item
            >`
        )}
      </sl-select>
      <slot style="display: none" @slotchange=${this.handleChildChange}></slot>
      <p class="print-only">${this.data?.magnitude || '-'}</p>
    `;
  }
}
