import { customElement, html, property, state, css } from 'lit-element';

import { CodedText } from './CodedTextElement';

import '@shoelace-style/shoelace/dist/components/spinner/spinner';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/tag/tag';
import MbSearchAbstract from './abstractSearch';
import { SearchResult } from './searchFunctions';

@customElement('mb-search-multiple')
export default class MbSearchMultiple extends MbSearchAbstract {
  static styles = css`
    :host,
    mb-dropdown {
      display: block;
    }
    sl-input.pointer::part(base) {
      cursor: default;
    }
    .tags {
      padding: var(--sl-spacing-2x-small) var(--sl-spacing-x-small);
    }
    .more {
      display: flex;
      justify-content: space-between;
      padding: var(--sl-spacing-3x-small) var(--sl-spacing-small);
    }
    .tags sl-tag {
      padding: var(--sl-spacing-2x-small);
    }
    .tag-container {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      margin-top: var(--sl-spacing-x-small);
    }
    sl-tag {
      margin: var(--sl-spacing-x-small) var(--sl-spacing-x-small) 0 0;
      max-width: 100%;
      --sl-tag-content-spacing: var(--sl-spacing-2x-small)
        var(--sl-spacing-2x-small);
    }
    sl-tag::part(base) {
      max-width: 100%;
      overflow-wrap: break-word;
      word-break: break-word;
      white-space: normal;
      height: auto;
      min-height: var(--sl-input-height-small);
      line-height: 1.5;
      cursor: pointer;
    }
    sl-tag::part(content) {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;
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
    return !!(this?.value?.value && this?.value?.code);
  }

  get _display() {
    return this._hasValue ? this.value?.value : undefined;
  }

  get _code() {
    return this._hasValue ? this.value?.code : undefined;
  }

  handleClear(tagIndex: number) {
    if (!this.disabled) {
      this.data = this.data.filter((_: any, i: any) => i !== tagIndex);
      this._mbInput.emit();
    }
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
              variant=${typeof s === 'string' ? 'neutral' : 'primary'}
              size=${this.variant === 'small' ? 'small' : 'medium'}
              @sl-remove=${() => this.handleClear(i)}
              removable
              ><span>${typeof s === 'string' ? s : s.value}</span></sl-tag
            >`
        )}
      </div>
      <slot @slotchange=${this._handleChildChange}></slot>
    `;
  }
}
