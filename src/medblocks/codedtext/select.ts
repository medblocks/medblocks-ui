import { customElement, property, state } from 'lit-element';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select';
import MbOption from './option';
import { CodedTextElement, CodedText } from './CodedTextElement';

import '@shoelace-style/shoelace/dist/components/menu/menu';
import '@shoelace-style/shoelace/dist/components/select/select';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button';

@customElement('mb-select')
export default class MbSelect extends CodedTextElement {
  @property({ type: String }) terminology: string;

  @property({ type: Object }) data: CodedText | CodedText[] | undefined;

  @property({ type: String, reflect: true }) placeholder: string =
    'Please select';

  @property({ type: String, reflect: true }) id: string = 'select';

  @property({ type: Boolean, reflect: true }) multiple: boolean = false;

  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @property({ type: Boolean, reflect: true }) disabled: boolean;

  @state() _options: MbOption[] = [];

  getLabel(code: string) {
    return this._options.filter(option => option.value === code)[0].label;
  }

  getOrdinal(code: string) {
    return (
      this._options.filter(option => option.value === code)[0]?.ordinal ||
      undefined
    );
  }

  get _optionElements(): NodeListOf<MbOption> {
    return this.querySelectorAll('mb-option');
  }

  handleInput(e: CustomEvent) {
    const select = e.target as SlSelect;
    if (select.value && typeof select.value === 'object') {
      const data: CodedText[] = select.value.map((item: string) => {
        let codedtext: CodedText = {
          code: item,
          value: this.getLabel(item),
          terminology: this.terminology,
        };
        const ordinal = this.getOrdinal(item);
        if (ordinal) {
          codedtext = { ...codedtext, ordinal: parseInt(ordinal as any, 10) };
        }
        return codedtext;
      });
      if (JSON.stringify(this.data) !== JSON.stringify(data)) {
        this.data = data;
        this._mbInput.emit();
      }
    } else if (select.value && typeof select.value === 'string') {
      let data: CodedText = {
        code: select.value,
        value: this.getLabel(select.value),
        terminology: this.terminology,
      };
      const ordinal = this.getOrdinal(select.value);
      if (ordinal) {
        data = { ...data, ordinal: parseInt(ordinal as any, 10) };
      }
      this.data = data;
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

  getValue(data: CodedText | CodedText[] | undefined): string | string[] {
    if (data == null) return '';
    if (Array.isArray(data)) return data.map(item => item.code || '');
    return data?.code || '';
  }

  reportValidity() {
    const select = this.shadowRoot!.querySelector('sl-select') as SlSelect;
    return select.reportValidity();
  }

  getTextData(data: CodedText | CodedText[] | undefined): string {
    if (data == null) return '';
    if (Array.isArray(data))
      return data?.map(item => item.value || '').join(', ') || '';
    return data?.value || '';
  }

  render() {
    if (this.variant === 'text') {
      return html`<div>
        ${this._label()}
        <p>${this.getTextData(this.data) || '-'}</p>
      </div>`;
    }
    return html`
      <sl-select
        id=${this.id}
        .size=${this.variant === 'small' ? 'small' : 'medium'}
        .disabled=${this.disabled}
        clearable
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
        .value=${this.getValue(this.data)}
      >
        ${this._options.map(
          option =>
            html`<sl-menu-item
              .value=${option.value}
              id=${`${this.id}-${option.value}`}
            >
              ${option.label}
            </sl-menu-item>`
        )}
      </sl-select>
      <slot @slotchange=${this.handleChildChange}></slot>
    `;
  }
}
