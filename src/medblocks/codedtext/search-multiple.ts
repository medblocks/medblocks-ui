import { customElement, html, state } from 'lit-element';

import { CodedText } from './CodedTextElement';

import '@shoelace-style/shoelace/dist/components/spinner/spinner';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/tag/tag';
import MbSearchAbstract from './abstractSearch';

@customElement('mb-search-multiple')
export default class MbSearchMultiple extends MbSearchAbstract {
  @state() value: any = {};
  _handleSelect(data: string | CodedText): void {
    this.value = data;
    if (this.data == null) this.data = [];
    this.data = [...this.data, this.value];
    this.value = {};
    this.searchTerm = '';
    this._mbInput.emit();
  }

  get _hasValue() {
    return this?.value?.value && this?.value?.code ? true : false;
  }

  get _display() {
    return this._hasValue ? this.value?.value : undefined;
  }

  get _code() {
    return this._hasValue ? this.value?.code : undefined;
  }

  handleClear(tagIndex: number) {
    this.data = this.data.filter((_: any, i: any) => i !== tagIndex);
    this._mbInput.emit();
  }

  render() {
    if (this.variant === 'text') {
      return html`<div>
        ${this._label()}
        <p>
          ${Array.isArray(this?.data)
            ? this.data?.map((item: CodedText) => item?.value || '').join(', ')
            : ''}
        </p>
      </div>`;
    }
    return html`
      ${this._searchBar()}
      <div>
        ${this.data?.map(
          (s: any, i: any) =>
            html`<sl-tag
              style="margin: var(--sl-spacing-x-small) var(--sl-spacing-x-small) 0 0;"
              type=${typeof s === 'string' ? 'neutral' : 'primary'}
              size="medium"
              @sl-clear=${() => this.handleClear(i)}
              clearable
              >${typeof s === 'string' ? s : s.value}</sl-tag
            >`
        )}
      </div>
      <slot @slotchange=${this._handleChildChange}></slot>
    `;
  }
}
