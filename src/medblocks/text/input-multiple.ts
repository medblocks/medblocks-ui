import type { SlInput } from '@shoelace-style/shoelace';
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
      display: block;
      width: 100%;
    }
    .input-container {
      width: 100%;
    }
    .tag-container {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }
    sl-tag {
      margin: var(--sl-spacing-x-small) var(--sl-spacing-x-small) 0 0;
      max-width: 100%;
      --sl-tag-content-spacing: var(--sl-spacing-2x-small)
        var(--sl-spacing-2x-small);
    }
    sl-tag::part(base) {
      max-width: 100%;
      overflow-wrap: break-word;
      word-break: break-word;
      white-space: normal;
      height: auto;
      min-height: var(--sl-input-height-small);
      line-height: 1.5;
    }
    sl-tag::part(content) {
      overflow: hidden;
      text-overflow: ellipsis;
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

  @property({ type: Boolean }) multiple = true;

  @property({ type: Boolean, reflect: true }) hidehelp = false;

  @property({ type: String, reflect: true }) placeholder = '';

  @property({ type: String, reflect: true }) id = 'input_multiple';

  @property({ type: Boolean, reflect: true }) required = false;

  @property({ type: Boolean, reflect: true }) autocomplete = false;

  @property({ type: Boolean, reflect: true }) disabled: boolean;

  @state() value = '';

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

  disconnectedCallback(): void {
    this.removeEventListener('keypress', event => {
      if (event.key === 'Enter') {
        this.addValue();
      }
    });
    super.disconnectedCallback();
  }

  reportValidity() {
    const input = this.shadowRoot?.querySelector('sl-input') as SlInput;
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
      <div class="input-container">
        <sl-input
          id=${this.id}
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
          autocomplete=${this.autocomplete ? 'on' : 'off'}
        >
          ${this.value &&
          html`<sl-icon @click=${this.addValue} library="medblocks" name="arrow-right-circle" slot="suffix"></sl-icon>
                </sl-icon>`}
        </sl-input>
      </div>
      <div class="tag-container">
        ${this.data?.map(
          (s, i) =>
            html`<sl-tag
              id=${`${this.id}_tag${i}`}
              variant="neutral"
              size=${this.variant === 'small' ? 'small' : 'medium'}
              @sl-remove=${() => this.handleClear(i)}
              removable
              ><span>${s}</span></sl-tag
            >`
        )}
      </div>
      <p class="print-only">
        <span>${this.data.join(', ') || '-'}</span>
      </p>
    `;
  }
}
