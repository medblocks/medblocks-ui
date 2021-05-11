import { customElement, internalProperty, property } from 'lit-element';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { CodedTextElement } from './CodedTextElement';
import MbOption from './option';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select';

import '@shoelace-style/shoelace/dist/components/menu/menu';
import '@shoelace-style/shoelace/dist/components/select/select';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button';

@customElement('mb-select')
export default class MbSelect extends CodedTextElement {
  @property({ type: String }) terminology: string;

  @property({ type: String, reflect: true }) placeholder: string;

  @internalProperty() options: MbOption[] = [];

  getLabel(code: string) {
    return this.options.filter(option => option.value === code)[0].label;
  }

  get optionElements(): NodeListOf<MbOption> {
    return this.querySelectorAll('mb-option');
  }

  handleInput(e: CustomEvent) {
    const select = e.target as SlSelect;
    if (select.value && typeof select.value === 'string') {
      this.data = {
        code: select.value,
        value: this.getLabel(select.value),
        terminology: this.terminology,
      };
      this._mbInput.emit();
    }
  }
  connectedCallback() {
    super.connectedCallback();
    const observer = new MutationObserver(() => {
      this.handleChildChange();
    });
    observer.observe(this, { childList: true });
    this.handleChildChange();
  }

  handleChildChange() {
    this.options = [
      ...(this.querySelectorAll('mb-option') as NodeListOf<MbOption>),
    ];
  }

  render() {
    {
      console.log(this.options);
    }
    return html`
      <sl-select
        clearable
        placeholder=${this.placeholder ?? 'Please select'}
        label=${ifDefined(this.label)}
        @sl-change=${this.handleInput}
        @sl-clear=${() => {
          this.data = undefined;
          this._mbInput.emit();
        }}
        .value=${this.data?.code || ''}
      >
        ${this.options.map(
          option =>
            html`<sl-menu-item .value=${option.value}
              >${option.label}
            </sl-menu-item>`
        )}
      </sl-select>
      <slot @slotchange=${this.handleChildChange}></slot>
    `;
  }
}
