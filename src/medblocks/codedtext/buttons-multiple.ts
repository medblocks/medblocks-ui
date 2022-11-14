import { css, customElement, html, state } from 'lit-element';
import { CodedText, CodedTextElement } from './CodedTextElement';
import MbOption from './option';
import '@shoelace-style/shoelace/dist/components/button/button';
import '@shoelace-style/shoelace/dist/components/spinner/spinner';
// import { SlSelect } from '@shoelace-style/shoelace';
import { property } from 'lit-element';
/**
 * An array of buttons to choose from. Expects nested mb-options to actually render buttons.
 * @inheritdoc
 */
@customElement('mb-buttons-multiple')
export default class CodedTextButtons extends CodedTextElement {
  @property({ type: Boolean, reflect: true }) required: boolean = false;
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;
  @property({ type: Boolean, reflect: true }) multiple: boolean = true;
  /** @ignore */
  static styles = css`
    .buttons {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sl-spacing-xx-small);
    }

    .label {
      font-size: var(--sl-input-label-font-size-medium);
      display: inline-block;
      color: var(--sl-input-label-color);
      margin-bottom: var(--sl-spacing-xxx-small);
    }
  `;

  @state() _options: MbOption[] = [];

  @state() value: any = {};

  get _optionElements(): NodeListOf<MbOption> {
    return this.querySelectorAll('mb-option');
  }

  connectedCallback() {
    super.connectedCallback();
    const observer = new MutationObserver(() => {
      this._handleChildChange();
    });
    observer.observe(this, { childList: true });
    this._handleChildChange();
  }
  _handleChildChange() {
    this._options = [
      ...(this.querySelectorAll('mb-option') as NodeListOf<MbOption>),
    ];
  }

  reportValidity() {
    const input = this.shadowRoot!.querySelector('input') as HTMLInputElement;
    return input.reportValidity();
  }

  _handleInput(option: MbOption) {
    let data: CodedText = {
      code: option.value,
      value: option.label,
      terminology: this.terminology,
    };

    if (option.ordinal) {
      data = { ...data, ordinal: parseInt(option.ordinal as any) };
    }
    this.value = data;
    this.addValue();
    this._mbInput.emit();
  }

  valueExists(code: string) {
    return this.data?.some((el: any) => el.code === code);
  }

  addValue() {
    if (this.data == null) this.data = [];
    if (this.valueExists(this.value.code)) {
      this.data = this.data?.filter((d: any) => d.code !== this.value.code);
    } else {
      this.data = [...this.data, this.value];
    }
    this.value = {};
    this._mbInput.emit();
  }

  render() {
    if (this.variant === 'text') {
      return html`<div>
        ${this._label()}
        <p>
          ${this.data?.map((item: CodedText) => item?.value || '').join(', ') ||
          ''}
        </p>
      </div>`;
    }
    return html`
      <div style="position:relative;z-index:2" part="base">
        ${this.label
          ? html`<label part="label" class="label">${this.label}</label>`
          : null}
        <div class="buttons">
          ${this._options.map(
            option =>
              html` <sl-button
                .size=${this.variant === 'small' ? 'small' : 'medium'}
                ?disabled=${this.disabled}
                @click=${() => this._handleInput(option)}
                type=${this.valueExists(option.value)
                  ? 'primary'
                  : option.type
                  ? option.type
                  : 'default'}
                >${this.valueExists(option.value)
                  ? html`<sl-icon
                      library="medblocks"
                      name="check2"
                      slot="prefix"
                    ></sl-icon>`
                  : null}${option.label}
              </sl-button>`
          )}
        </div>
        <input
          style="transform:scale(0.025);position:absolute;top:40px;opacity:0.1"
          name="input"
          ?required=${this.required}
        />
      </div>
    `;
  }
}
