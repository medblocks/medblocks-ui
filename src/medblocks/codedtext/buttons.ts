import { css, customElement, html, state, property } from 'lit-element';
import { CodedTextElement } from './base';
import MbOption from './option';
import '@shoelace-style/shoelace/dist/components/button/button';
import '@shoelace-style/shoelace/dist/components/spinner/spinner';

/**
 * An array of buttons to choose from
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
  @property({ type: String }) terminology: string;

  @property({ type: String, reflect: true }) label: string;

  @state() options: MbOption[] = [];

  get optionElements(): NodeListOf<MbOption> {
    return this.querySelectorAll('mb-option');
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

  handleInput(option: MbOption) {
    this.data = {
      code: option.code,
      value: option.display,
      terminology: this.terminology,
      _type: () => 'codedtext',
    };
    /**
     * Dispatched when the input changes
     */
    this.input.emit();
  }
  render() {
    return html`
      <div part="base">
        ${this.label
          ? html`<label part="label" class="label">${this.label}</label>`
          : null}
        <div class="buttons">
          ${this.options.map(
            option =>
              html` <sl-button
                @click=${() => this.handleInput(option)}
                type=${this.data?.code === option.code ? 'primary' : 'default'}
                >${option.display}</sl-button
              >`
          )}
        </div>
      </div>
    `;
  }
}
