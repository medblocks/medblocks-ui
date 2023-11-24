import { customElement, property, state } from 'lit-element';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import MbOption from '../codedtext/option';

import '@shoelace-style/shoelace/dist/components/menu/menu';
import '@shoelace-style/shoelace/dist/components/select/select';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button';
import EhrElement from '../EhrElement';

@customElement('mb-text-select')
export default class MbTextSelect extends EhrElement {
  @property({ type: Object }) data: string[] | string | undefined;

  @property({ type: String }) terminology: string;

  @property({ type: Boolean, reflect: true }) disabled: boolean;

  @property({ type: Boolean, reflect: true }) multiple: boolean = false;

  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @property({ type: String, reflect: true }) placeholder: string;

  @property({ type: String, reflect: true }) id: string = 'text_select';

  @state() _options: MbOption[] = [];

  get _optionElements(): NodeListOf<MbOption> {
    return this.querySelectorAll('mb-option');
  }

  handleInput(e: CustomEvent) {
    const select = e.target as SlSelect;
    if (select.value) {
      this.data = select.value;
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
    this._options = [
      ...(this.querySelectorAll('mb-option') as NodeListOf<MbOption>),
    ];
  }

  reportValidity() {
    const select = this.shadowRoot!.querySelector('sl-select') as SlSelect;
    return select.reportValidity();
  }

  render() {
    if (this.variant === 'text') {
      return html`<div>
        ${this._label()}
        <p>${this.data || '-'}</p>
      </div> `;
    }
    return html`
      <sl-select
        id=${this.id}
        exportparts="menu"
        .size=${this.variant === 'small' ? 'small' : 'medium'}
        clearable
        .disabled=${this.disabled}
        ?required=${this.required}
        ?multiple=${this.multiple}
        placeholder=${this.placeholder ?? 'Please select'}
        label=${ifDefined(this.label)}
        @sl-change=${this.handleInput}
        @sl-clear=${() => {
          this.data = undefined;
          this._mbInput.emit();
        }}
        .hoist=${true}
        .value=${this.data || ''}
      >
        ${this._options.map(
          option =>
            html`<sl-menu-item
              .value=${option.value}
              id=${`${this.id}-${option.label}`}
              >${option.label}
            </sl-menu-item>`
        )}
      </sl-select>
      <slot @slotchange=${this.handleChildChange}></slot>
    `;
  }
}
