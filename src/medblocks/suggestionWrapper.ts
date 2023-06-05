import { css, customElement, html, LitElement, property } from 'lit-element';
import '@shoelace-style/shoelace/dist/components/tag/tag';
import { event, EventEmitter } from '../internal/decorators';

export interface Suggestion {
  data: any;
  label: string;
  op: 'replace' | 'add' | 'remove';
}

export interface SuggestEvent {
  suggestion: Suggestion;
  path: string;
  global: boolean;
}

@customElement('mb-suggest')
export default class SuggestWrapper extends LitElement {
  /** @ignore */
  static styles = css`
    .suggestions {
      display: block;
      flex-wrap: wrap;
      gap: var(--sl-spacing-2x-small);
      margin-top: var(--sl-spacing-2x-small);
    }

    .label {
      font-weight: var(--sl-font-weight-light);
      font-size: var(--sl-input-help-text-font-size-medium);
      color: var(--sl-input-help-text-color);
    }

    .suggest-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sl-spacing-2x-small);
      margin-top: var(--sl-spacing-2x-small);
    }

    sl-tag {
      cursor: pointer;
    }
  `;
  @event('mb-suggestion') _suggestionEvent: EventEmitter<SuggestEvent>;

  _handleSuggestion(suggestion: Suggestion) {
    // console.log({ suggestion });
    this._suggestionEvent.emit({
      detail: {
        suggestion,
        path: this.path,
        global: this.global,
      },
    });
  }

  @property({ type: String, reflect: true }) path: string;

  @property({ type: Array }) suggestions: Suggestion[] = [];

  @property({ type: Boolean, reflect: true }) global: boolean = false;

  @property({ type: String, reflect: true }) label: string = '';

  render() {
    return html`
      <slot></slot>
      <div class="suggestions">
        ${this.suggestions.length > 0
          ? html`<span class="label">${this.label}</span>`
          : null}
        <div class="suggest-buttons">
          ${this.suggestions.map(
            suggestion => html`
              <sl-button
                id=${suggestion.label}
                @click=${() => this._handleSuggestion(suggestion)}
                size="small"
                pill
                removable
                >${suggestion.label}</sl-button
              >
            `
          )}
        </div>
      </div>
    `;
  }
}
