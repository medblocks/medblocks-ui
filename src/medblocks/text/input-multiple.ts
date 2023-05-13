import { SlInput } from '@shoelace-style/shoelace';
import { customElement, property, html, state, css } from 'lit-element';
import EhrElement from '../EhrElement';
import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/tag/tag';

@customElement('mb-input-multiple')
export default class MbInputMultiple extends EhrElement {
  /** @ignore */
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
    }
    sl-tag {
      margin: var(--sl-spacing-x-small) var(--sl-spacing-x-small) 0 0;
    }
    sl-icon {
      font-size: var(--sl-font-size-large);
      cursor: pointer;
    }

    .print-only {
      display: none;
    }

    @media print {
      sl-tag {
        display: none;
      }

      sl-input {
        display: none;
      }
      .print-only {
        display: inline-block;
        margin: 0px;
        padding: 2px;
      }
    }
  `;
  @property({ type: Array }) data: string[] = [];

  @property({ type: Boolean }) multiple: boolean = true;

  @property({ type: Boolean, reflect: true }) hidehelp: boolean = false;

  @property({ type: String, reflect: true }) placeholder: string = '';

  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @property({ type: Boolean, reflect: true }) disabled: boolean;

  @state() value: string = '';

  handleClear(tagIndex: number) {
    if (!this.disabled) {
      this.data = this.data.filter((_, i) => i !== tagIndex);
      this._mbInput.emit();
    }
  }

  handleInput(e: CustomEvent) {
    const target = e.target as SlInput;
    this.value = target.value;
  }

  addValue() {
    if (this.value !== '') {
      this.data = [...this.data, this.value];
      this.value = '';
      this._mbInput.emit();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keypress', event => {
      if (event.key === 'Enter') {
        this.addValue();
      }
    });
  }

  reportValidity() {
    const input = this.shadowRoot!.querySelector('sl-input') as SlInput;
    if (this.data.length > 0) {
      return true;
    }
    return input.reportValidity();
  }

  render() {
    if (this.variant === 'text') {
      return html`<div>
        ${this._label()}
        <p>${this.data?.join(', ') || '-'}</p>
      </div>`;
    }
    return html`
      <sl-input
        .size=${this.variant === 'small' ? 'small' : 'medium'}
        .disabled=${this.disabled}
        ?required=${this.required}
        help-text=${this.hidehelp
          ? ''
          : `Press enter to add ${this.placeholder}`}
        @sl-input=${this.handleInput}
        label=${this.label || ''}
        .value=${this.value}
        @sl-blur=${() => this.addValue()}
      >
        ${this.value &&
        html`<sl-icon @click=${this.addValue} library="medblocks" name="arrow-right-circle" slot="suffix"></sl-icon>
                </sl-icon>`}
      </sl-input>
      <div>
        ${this.data.map(
          (s, i) =>
            html`<sl-tag
              type="neutral"
              size=${this.variant === 'small' ? 'small' : 'medium'}
              @sl-clear=${() => this.handleClear(i)}
              clearable
              >${s}</sl-tag
            >`
        )}
      </div>
      <p class="print-only">
        <span>${this.data.join(', ') || '-'}</span>
      </p>
    `;
  }
}
