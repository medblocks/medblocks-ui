import { SlCheckbox } from '@shoelace-style/shoelace';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox';
import { customElement, html, property, css } from 'lit-element';
import EhrElement from '../EhrElement';

@customElement('mb-checkbox')
export default class MbCheckBox extends EhrElement {
  @property({ type: Boolean }) data: boolean | undefined = undefined;

  @property({ type: Boolean, reflect: true }) disabled: boolean = false;

  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @property({ type: String, reflect: true }) id: string = 'checkbox';

  _handleChange(e: CustomEvent) {
    const checkbox = e.target as SlCheckbox;
    this.data = !!checkbox.checked;
    this._mbInput.emit();
  }

  reportValidity() {
    const checked = this.shadowRoot!.querySelector('sl-checkbox') as any;
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
      style="--sl-toggle-size: 1rem; "
      >${this.label}</sl-checkbox
    >`;
  }
}

export interface MbCheckboxInputEvent extends CustomEvent {
  target: MbCheckBox;
}
