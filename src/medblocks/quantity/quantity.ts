import { css, customElement, html, property, state } from 'lit-element';
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
import QuantityElement from './QuantityElement';

/**
 * @inheritdoc
 * Quantity element with an input and select for units.
 */
@customElement('mb-quantity')
export default class MbQuantity extends QuantityElement {
  /** @ignore */
  static styles = css`
    :host {
      display: flex;
      flex: 1;
      align-items: flex-end;
    }

    sl-input {
      width: 0;
      flex: 3 1 auto;
      margin-right: var(--sl-spacing-x-small);
    }

    sl-select {
      flex: 2 1 auto;
      width: 0;
    }
  `;

  /**The default unit to choose. Must be the `value` of a child mb-option element */
  @property({ type: String, reflect: true }) default: string;

  /** Required form validation */
  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @property({ type: Number, reflect: true }) max: number | string;

  @property({ type: Number, reflect: true }) min: number | string;
  /** Hides the units. Make sure to set a default unit, or set it programatically. */
  @property({ type: Boolean, reflect: true }) hideunit: boolean = false;

  @property({type: Boolean, reflect: true}) disabled: boolean;

  @property({ type: Number, reflect: true }) step: number;
  @state()
  units: MbUnit[] = [];

  handleChildChange() {
    this.units = [...(this.querySelectorAll('mb-unit') as NodeListOf<MbUnit>)];
  }

  reportValidity() {
    const input = this.shadowRoot!.querySelector('sl-input') as SlInput;
    return input.reportValidity();
  }
  connectedCallback() {
    super.connectedCallback();
    const observer = new MutationObserver(() => {
      this.handleChildChange();
    });
    observer.observe(this, { attributes: true, childList: true });
  }

  handleInput(e: CustomEvent) {
    const input = e.target as SlInput;
    if (input.value === '') {
      this.data = undefined;
    } else {
      this.data = {
        unit: this.data?.unit || this.default,
        magnitude: parseFloat(input.value),
      };
    }
  }

  handleSelect(e: CustomEvent) {
    const select = e.target as SlSelect;
    if (select.value) {
      this.data = {
        ...this.data,
        unit: select.value as string,
      };
    } else {
      if (this.data?.magnitude) {
        this.data = {
          ...this.data,
          unit: undefined,
        };
      } else {
        this.data = undefined;
      }
    }

  }

  handleUnits(min: any,max: any){
    this.min = min
    this.max = max

    console.log("min,max =>",min,max)
  }


  render() {
    return html`
      <sl-input
        .disabled=${this.disabled}
        .step=${this.step ?? 'any'}
        .required=${this.required}
        .max=${this.max}
        .min=${this.min}
        label=${ifDefined(this.label)}
        type="number"
        @sl-input=${this.handleInput}
        .value=${this.data?.magnitude?.toString() || ''}
      ></sl-input>
      <sl-select
      .disabled=${this.disabled}
        style="${this.hideunit ? 'display: none' : ''}"
        placeholder="Select units"
        .value=${this.data?.unit ?? ''}
        @sl-change=${this.handleSelect}
      >
        ${this.units.map(
          unit =>
            html`<sl-menu-item value=${unit.unit} max=${unit.max} min=${unit.min} @sl-change=${this.handleUnits(unit.min,unit.max)}  >${unit.label}</sl-menu-item>`
        )}
      </sl-select>
      <slot style="display: none" @slotchange=${this.handleChildChange}></slot>
    `;
  }
}
