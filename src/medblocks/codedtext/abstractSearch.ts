import { css, html, state, property, TemplateResult, query } from 'lit-element';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import { until } from 'lit-html/directives/until.js';
import { classMap } from 'lit-html/directives/class-map';
import { ifDefined } from 'lit-html/directives/if-defined';
import { CodedTextElement } from './CodedTextElement';
import MbFilter from './filter';
import SlDropdown from './dropdown';
import { AxiosInstance } from 'axios';
import { event, EventEmitter, watch } from '../../internal/decorators';

import './dropdown';
import '@shoelace-style/shoelace/dist/components/spinner/spinner';
import '@shoelace-style/shoelace/dist/components/menu/menu';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item';
import '@shoelace-style/shoelace/dist/components/icon/icon';
import '@shoelace-style/shoelace/dist/components/tag/tag';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button';
import '@shoelace-style/shoelace/dist/components/menu-divider/menu-divider';
import '@shoelace-style/shoelace/dist/components/menu-label/menu-label';
import '@shoelace-style/shoelace/dist/components/skeleton/skeleton';

import { hermesPlugin, SearchOptions, SearchResult } from './searchFunctions';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item';

export default abstract class MbSearchAbstract extends CodedTextElement {
  /** @ignore */
  static styles = css`
    :host,
    mb-dropdown {
      display: block;
    }

    sl-input.pointer::part(base) {
      cursor: default;
    }

    .tags {
      padding: var(--sl-spacing-xx-small) var(--sl-spacing-x-small);
    }

    .more {
      display: flex;
      justify-content: space-between;
      padding: var(--sl-spacing-xxx-small) var(--sl-spacing-small);
    }
    .tags sl-tag {
      padding: var(--sl-spacing-xx-small);
    }

    sl-tag::part(base) {
      cursor: pointer;
    }
  `;

  @property({ type: String }) searchTerm: string;

  @property({ type: Array }) _filters: MbFilter[];

  @property({ type: Array }) _cancelledFilters: string[] = [];

  @property({ type: Array }) mock: string[] = [];

  @property({ type: Object }) axios: AxiosInstance;

  @property({ type: Number }) debounceInterval = 150;

  @property({ type: Number }) hits = 10;

  @property({ type: String }) parentAxiosKey: string = 'hermes';

  @property({ type: String, reflect: true }) placeholder = 'Type to search';

  @property({ type: String }) textFallbackLabel = 'Add custom';

  @property({ type: String }) filtersLabel = 'Filters';

  @property({ type: Boolean }) disablefallback = false;

  @property({ type: Boolean, reflect: true }) disablesearch = false;

  @property({ type: String, attribute: 'filter-type', reflect: true })
  filterType: 'or' | 'and' = 'or';

  @property({ type: Object }) plugin = hermesPlugin;

  @state() _moreHits: number = 0;

  @state() _debouncing: boolean = false;

  @state() _debounceTimeout: number;

  get _maxHits() {
    return this.hits + this._moreHits;
  }

  @watch('searchTerm')
  _searchTermChange() {
    clearTimeout(this._debounceTimeout);
    this._debouncing = true;
    this._debounceTimeout = window.setTimeout(() => {
      this._debouncing = false;
    }, this.debounceInterval);
  }

  @event('mb-search') _mbSearch: EventEmitter<SearchOptions>;

  @query('mb-dropdown')
  dropdown: SlDropdown;

  _handleInput(e: CustomEvent) {
    const inputElement = e.target as SlInput;
    this.searchTerm = inputElement.value;
    this.dropdown.show();
    this._emitSearchEvent();

    // this._mbInput.emit();
  }

  _emitSearchEvent() {
    const searchOptions: SearchOptions = {
      maxHits: this._maxHits,
      searchString: this.searchTerm,
      axios: this.axios || this._parentAxios,
      terminology: this.terminology,
      constraints: this._selectedFilters,
    };
    this._mbSearch.emit({ detail: searchOptions });
  }

  get _selectedFilters() {
    const filters = this._filters
      ?.filter(filter => !filter.disabled)
      ?.map(filter => filter.value);
    return filters;
  }

  get _viewMore() {
    return html` <div class="more">
      <sl-button
        type="text"
        @click=${() => {
          this._moreHits += 10;
        }}
        >More</sl-button
      >
      ${this._maxHits > this.hits
        ? html`<sl-button
            type="text"
            @click=${() => {
              this._moreHits -= 10;
            }}
            >Less</sl-button
          >`
        : null}
    </div>`;
  }

  get _parentAxios(): AxiosInstance {
    const dependencyEvent = this._mbDependency.emit({
      detail: { key: this.parentAxiosKey },
    });
    return dependencyEvent.detail.value;
  }

  /**Function to get results from an external source */
  async getResults(): Promise<{
    result: TemplateResult[];
    error?: string;
  }> {
    if (this.mock.length) {
      return {
        result: this.mock.map(
          r =>
            html`<sl-menu-item .value=${{ code: r, value: r }}
              ><p>${r}</p></sl-menu-item
            >`
        ),
      };
    }
    if (!this.searchTerm) {
      return {
        result: [],
      };
    }
    try {
      const axios = this.axios ? this.axios : this._parentAxios;
      const result = await this.plugin({
        maxHits: this._maxHits,
        searchString: this.searchTerm,
        axios,
        constraints: this._selectedFilters,
      });
      const results = result.map(
        r =>
          html`
            <sl-menu-item .value=${r}> ${r.value || r.text} </sl-menu-item>
          `
      );
      return {
        result:
          this._maxHits === results.length
            ? [...results, this._viewMore]
            : results,
      };
    } catch (e) {
      return {
        result: [],
        error: 'An unexpected error occured',
      };
    }
  }

  async _results() {
    if (!this.searchTerm) {
      return;
    }

    if (this._debouncing) {
      return this._loadingResults();
    }

    const { result, error } = await this.getResults();

    if (error) {
      return html`<sl-menu-item disabled>
        <sl-icon
          name="exclamation-triangle"
          slot="prefix"
          library="medblocks"
        ></sl-icon>
        An unexpected error occured
      </sl-menu-item>`;
    }

    if (this.searchTerm && result.length === 0) {
      return html`<sl-menu-label>No results</sl-menu-label>`;
    }

    return result;
  }

  _textFallback() {
    return html`<sl-menu-divider></sl-menu-divider>
      <sl-menu-item .value=${{ text: this.searchTerm }}
        ><span
          slot="suffix"
          style="font-size: small; color: var(--sl-color-neutral-100)"
          >${this.textFallbackLabel}</span
        >${this.searchTerm}</sl-menu-item
      >`;
  }

  _loadingResults(): TemplateResult {
    const skeletons = 5;
    return html`${[...Array(skeletons)].map(
      () => html` <sl-menu-item disabled class="loading">
        <sl-skeleton effect="sheen"></sl-skeleton>
      </sl-menu-item>`
    )}`;
  }

  abstract _handleSelect(data: SearchResult, menuItem: SlMenuItem): void;

  _handleSlSelect(e: CustomEvent) {
    console.log(e.detail.item);
    const menuItem = e.detail.item;
    this.searchTerm = '';
    if (menuItem.value) {
      return this._handleSelect(menuItem.value, menuItem);
    }
  }

  _handleMouseDown(event: MouseEvent) {
    const path = event.composedPath();
    if (!path.includes(this) && this.dropdown) {
      this.dropdown.hide();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    // Emit register event
    // Get axios instance from parent
    // If not, default or error
    const observer = new MutationObserver(() => {
      this._handleChildChange();
    });
    this._handleMouseDown = this._handleMouseDown.bind(this);
    document.addEventListener('mousedown', this._handleMouseDown);
    this.addEventListener('sl-select', this._handleSlSelect);
    observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }

  disconnectedCallback(): void {
    this.removeEventListener('sl-select', this._handleSlSelect);
    document.removeEventListener('mousedown', this._handleMouseDown);
    super.disconnectedCallback();
  }

  _handleChildChange() {
    this._filters = [
      ...(this.querySelectorAll('mb-filter') as NodeListOf<MbFilter>),
    ];
  }

  _handleClear() {
    this.data = undefined;
    this._moreHits = 0;
    this._mbInput.emit();
  }

  _handleFilterClick(tag: MbFilter, tags: MbFilter[]) {
    if (this.filterType === 'and') {
      tags.forEach(t => {
        console.log(t);
        t.disabled = true;
      });
      tag.disabled = false;
    } else {
      tag.disabled = !tag.disabled;
    }
    this._emitSearchEvent();
  }

  _searchBar() {
    return html`
      <mb-dropdown
        .containingElement=${this}
        .hoist=${true}
        .open=${true}
        .focusKeys=${['Enter']}
        .typeToSelect=${false}
        @sl-after-hide=${() => {
          this._cancelledFilters = [];
        }}
      >
        <sl-input
          class=${classMap({ pointer: this._hasValue })}
          slot="trigger"
          .size=${this.variant === 'small' ? 'small' : 'medium'}
          .label=${this.label || ''}
          @sl-input=${this._handleInput}
          value=${ifDefined(this._display ?? this.searchTerm ?? '')}
          ?readonly=${this._hasValue}
          ?clearable=${this._hasValue}
          @sl-clear=${this._handleClear}
          placeholder=${this.placeholder}
        >
          ${this._hasValue
            ? null
            : html`<sl-icon
                library="medblocks"
                name="search"
                slot="prefix"
              ></sl-icon>`}
        </sl-input>
        ${this._hasValue || !this.searchTerm
          ? null
          : html`
              <sl-menu style="min-width: 300px">
                ${this.disablesearch ? null : until(this._results())}
                <slot name="results"></slot>
                ${this.disablefallback ? null : this._textFallback()}
                ${this._filters?.length > 0
                  ? html` <sl-menu-divider></sl-menu-divider>
                      <sl-menu-label>Filters</sl-menu-label>
                      <div class="tags">
                        ${this._filters.map(
                          f =>
                            html`<sl-tag
                              ?clearable=${this.filterType === 'or' &&
                              !f.disabled}
                              size="medium"
                              type=${f.disabled ? 'neutral' : 'primary'}
                              @click=${() =>
                                this._handleFilterClick(f, this._filters)}
                              >${f.label}</sl-tag
                            >`
                        )}
                      </div>`
                  : null}
              </sl-menu>
            `}
      </mb-dropdown>
      <slot @slotchange=${this._handleChildChange}></slot>
    `;
  }

  get _hasValue() {
    return (this?.data?.value && this?.data?.code) ||
      (typeof this.data === 'string' && this.data !== '')
      ? true
      : false;
  }

  get _display() {
    if (typeof this.data === 'string') {
      return this.data;
    }
    return this._hasValue ? this.data?.value : undefined;
  }

  get _code() {
    return this._hasValue ? this.data?.code : undefined;
  }
}
