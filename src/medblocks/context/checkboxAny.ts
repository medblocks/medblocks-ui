import { SlCheckbox } from '@shoelace-style/shoelace';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox';
import { customElement, html, property } from 'lit-element';
import EhrElement from '../EhrElement';

@customElement('mb-checkbox-any')
export default class MbCheckBox extends EhrElement {
  @property() data: any = undefined;

  @property() bind: any = undefined;

  @property({ type: Boolean, reflect: true }) disabled: boolean = false;

  _handleChange(e: CustomEvent) {
    const checkbox = e.target as SlCheckbox;
    this.data = checkbox.checked ? this.bind : undefined;
    this._mbInput.emit();
  }

  render() {
    if (this.variant === 'text') {
      return html`<div>
        ${this._label()}
        <p>${this.data || '-'}</p>
      </div>`;
    }
    return html`<sl-checkbox
      .size=${this.variant === 'small' ? 'small' : 'medium'}
      ?disabled=${this.disabled}
      ?checked=${!!this.data}
      @sl-change=${this._handleChange}
      >${this.label}</sl-checkbox
    >`;
  }
}
