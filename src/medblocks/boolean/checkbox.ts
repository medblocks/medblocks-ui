import { SlCheckbox } from '@shoelace-style/shoelace';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox';
import { customElement, html, property } from 'lit-element';
import EhrElement from '../EhrElement';

@customElement('mb-checkbox')
export default class MbCheckBox extends EhrElement {
  @property({ type: Boolean }) data: boolean | undefined = undefined;
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;
  @property({ type: Boolean, reflect: true }) required: boolean = false;

  _handleChange(e: CustomEvent) {
    const checkbox = e.target as SlCheckbox;
    this.data = checkbox.checked ? true : false;
    this._mbInput.emit();
  }
  reportValidity() {
  const checked = this.shadowRoot!.querySelector('sl-checkbox') as any;
  return checked.reportValidity();
  }

  render() {
    return html`<sl-checkbox
      ?required=${this.required}
      ?disabled=${this.disabled}
      ?checked=${this.data}
      ?indeterminate=${this.data == null}
      @sl-change=${this._handleChange}
      >${this.label}</sl-checkbox
    >`;
  }
}
