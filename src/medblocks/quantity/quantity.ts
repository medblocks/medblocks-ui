import { css, customElement, html, property } from 'lit-element';
import { event, EventEmitter } from '../../internal/decorators';
import EhrElement from '../EhrElement';
import MbUnit from './unit';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/menu/menu'
import '@shoelace-style/shoelace/dist/components/select/select'
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button'
import { ifDefined } from 'lit-html/directives/if-defined';

interface Quantity {
  magnitude?: number;
  unit?: string;
}

@customElement('mb-quantity')
export default class MbQuantity extends EhrElement {
  static styles = css`
    :host {
      display: flex;
      flex: 1;
      align-items: flex-end;
    }

    sl-input {
      width: 0;
      flex: 1 1 auto;
      margin-right: var(--sl-spacing-x-small);
    }

    sl-select {
      flex: 1 1 auto;
      width: 0;
    }
  `;

  @property({ type: Object }) data: Quantity | undefined;
  @property({ type: String, reflect: true }) default: string;

  @property({ type: Boolean, reflect: true }) hideunit: boolean = false;

  @property({ type: Array })
  units: MbUnit[] = [];
  @event('mb-input') _mbInput: EventEmitter<Quantity>;

  handleChildChange() {
    this.units = [...(this.querySelectorAll('mb-unit') as NodeListOf<MbUnit>)];
  }

  connectedCallback() {
    super.connectedCallback();
    const observer = new MutationObserver(() => {
      this.handleChildChange();
    });
    observer.observe(this, { attributes: true, childList: true });
    setTimeout(() => {
      if (this.default) {
        this.data = {
          ...this.data,
          unit: this.default,
        };
        this._mbInput.emit();
      }
    }, 50);
  }

  handleInput(e: CustomEvent) {
    const input = e.target as SlInput;
    this.data = {
      ...this.data,
      magnitude: parseFloat(input.value),
    };
  }

  handleSelect(e: CustomEvent) {
    const select = e.target as SlSelect;
    this.data = {
      ...this.data,
      unit: select.value as string,
    };
  }
  @property({ type: String }) label: string;
  render() {
    return html`
      <sl-input
        label=${ifDefined(this.label)}
        type="number"
        @sl-input=${this.handleInput}
        .value=${this.data?.magnitude?.toString() || ''}
      ></sl-input>
      <sl-select
        style="${this.hideunit ? 'display: none' : ''}"
        placeholder="Select units"
        .value=${this.data?.unit ?? ''}
        @sl-change=${this.handleSelect}
      >
        ${this.units.map(
          unit =>
            html`<sl-menu-item value=${unit.unit}>${unit.label}</sl-menu-item>`
        )}
      </sl-select>
      <slot style="display: none" @slotchange=${this.handleChildChange}></slot>
    `;
  }
}
