import { customElement, html, property, state } from 'lit-element';

import { CodedText } from './CodedTextElement';

import '@shoelace-style/shoelace/dist/components/spinner/spinner';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/tag/tag';
import MbSearchAbstract from './abstractSearch';
import { SearchResult } from './searchFunctions';

@customElement('mb-search-multiple')
export default class MbSearchMultiple extends MbSearchAbstract {
  @property({ type: Boolean }) multiple: boolean = true;

  @state() value: any = {};
  _handleSelect(data: SearchResult): void {
    if (data.text) {
      this.value = data.text;
    } else {
      this.value = {
        code: data.code,
        value: data.value,
        terminology: data.terminology,
      };
    }
    if (this.data == null) {
      this.data = [];
    }
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
            ? this.data
                ?.map((item: CodedText | string) => this.getDisplay(item))
                .join(', ')
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
              exportparts="base"
              style="margin: var(--sl-spacing-x-small) var(--sl-spacing-x-small) 0 0;"
              type=${typeof s === 'string' ? 'neutral' : 'primary'}
              size=${this.variant === 'small' ? "small":"medium"}
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
