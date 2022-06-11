import { SlInput } from '@shoelace-style/shoelace';
import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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
      margin: var(--sl-spacing-x-small) var(--sl-spacing-xx-small) 0 0;
    }
    sl-icon {
      font-size: var(--sl-font-size-large);
      cursor: pointer;
    }
  `;
  @property({ type: Array }) data: string[] = [];

  @property({ type: Boolean }) multiple: boolean = true;

  @property({ type: String, reflect: true }) placeholder: string = '';

  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @state() value: string = '';

  handleClear(tagIndex: number) {
    this.data = this.data.filter((_, i) => i !== tagIndex);
    this._mbInput.emit();
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
    if(this.data.length>0){
      return true
    }
    return input.reportValidity();
  }

  render() {
    return html`
      <sl-input
        ?required=${this.required }
        help-text=${`Press enter to add ${this.placeholder}`}
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
              size="medium"
              @sl-clear=${() => this.handleClear(i)}
              clearable
              >${s}</sl-tag
            >`
        )}
      </div>
    `;
  }
}
