import type { SlCheckbox } from '@shoelace-style/shoelace';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox';
import { customElement, html, property } from 'lit-element';
import EhrElement from '../EhrElement';

@customElement('mb-checkbox')
export default class MbCheckBox extends EhrElement {
  @property({ type: Boolean }) data: boolean | undefined = undefined;

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ type: Boolean, reflect: true }) required = false;

  @property({ type: String, reflect: true }) id = 'checkbox';

  _handleChange(e: CustomEvent) {
    const checkbox = e.target as SlCheckbox;
    this.data = !!checkbox.checked;
    this._mbInput.emit();
  }

  reportValidity() {
    const checked = this.shadowRoot?.querySelector(
      'sl-checkbox'
    ) as unknown as HTMLInputElement;
    return checked.reportValidity();
  }

  render() {
    if (this.variant === 'text') {
      return html`<div>
        ${this._label()}
        <p>${this.data ? 'Yes' : 'No'}</p>
      </div>`;
    }
    return html`<sl-checkbox
      id=${this.id}
      ?required=${this.required}
      ?disabled=${this.disabled}
      ?checked=${this.data}
      ?indeterminate=${this.data == null}
      @sl-change=${this._handleChange}
      >${this.label}</sl-checkbox
    >`;
  }
}
