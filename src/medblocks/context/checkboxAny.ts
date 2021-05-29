import { SlCheckbox } from '@shoelace-style/shoelace';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox';
import { customElement, html, property } from 'lit-element';
import EhrElement from '../EhrElement';

@customElement('mb-checkbox-any')
export default class MbCheckBox extends EhrElement {
  @property({ type: Object }) data: any = undefined;
  @property({ type: Object }) bind: any = undefined;
  _handleChange(e: CustomEvent) {
    const checkbox = e.target as SlCheckbox;
    this.data = checkbox.checked ? this.bind : undefined;
  }
  render() {
    return html`<sl-checkbox
      ?checked=${this.data ? true : false}
      @sl-change=${this._handleChange}
      >${this.label}</sl-checkbox
    >`;
  }
}
