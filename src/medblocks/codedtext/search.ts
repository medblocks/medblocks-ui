import { SlMenuItem } from '@shoelace-style/shoelace';
import { customElement, html } from 'lit-element';
import MbSearchAbstract from './abstractSearch';
import { SearchResult } from './searchFunctions';

@customElement('mb-search')
export default class MbSearch extends MbSearchAbstract {
  _handleSelect(data: SearchResult, menuItem: SlMenuItem): void {
    if (data.text) {
      this.data = data.text;
    } else {
      this.data = {
        code: data.code,
        value: data.value,
        terminology: data.terminology,
      };
    }
    this._mbInput.emit({ detail: { item: menuItem } });
  }
  render() {
    if (this.variant === 'text') {
      return html`<div>
        ${this._label()}
        <p>${this.data?.value || this.data || '-'}</p>
      </div>`;
    } else {
      return this._searchBar();
    }
  }
}
