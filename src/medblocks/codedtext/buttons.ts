import { css, customElement, html, state } from 'lit-element';
import { CodedTextElement } from './CodedText';
import MbOption from './option';
import '@shoelace-style/shoelace/dist/components/button/button';
import '@shoelace-style/shoelace/dist/components/spinner/spinner';

/**
 * An array of buttons to choose from. Expects nested mb-options to actually render buttons.
 * @inheritdoc
 */
@customElement('mb-buttons')
export default class CodedTextButtons extends CodedTextElement {
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

  _handleInput(option: MbOption) {
    this.data = {
      code: option.value,
      value: option.label,
      terminology: this.terminology,
    };
  }
  
  render() {
    return html`
      <div part="base">
        ${this.label
          ? html`<label part="label" class="label">${this.label}</label>`
          : null}
        <div class="buttons">
          ${this._options.map(
            option =>
              html` <sl-button
                @click=${() => this._handleInput(option)}
                type=${this.data?.code === option.value ? 'primary' : 'default'}
                >${option.label}</sl-button
              >`
          )}
        </div>
      </div>
    `;
  }
}
