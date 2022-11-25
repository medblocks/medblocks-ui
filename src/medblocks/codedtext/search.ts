import { SlMenuItem } from '@shoelace-style/shoelace';
import { customElement, html } from 'lit-element';
import MbSearchAbstract from './abstractSearch';
import { CodedText } from './CodedTextElement';

@customElement('mb-search')
export default class MbSearch extends MbSearchAbstract {
  _handleSelect(data: string | CodedText, menuItem: SlMenuItem): void {
    this.data = data;
    this._mbInput.emit({ detail: { item: menuItem } });
  }
  render() {
    if (this.variant === 'text') {
      return html`<div>
        ${this._label()}
        <p>${this.data?.value || '-'}</p>
      </div>`;
    } else {
      return this._searchBar();
    }
  }
}
