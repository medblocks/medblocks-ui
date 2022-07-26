import { css, customElement, html, LitElement, property } from 'lit-element';
import '@shoelace-style/shoelace/dist/components/tag/tag';
import { event, EventEmitter } from '../internal/decorators';

export interface Suggestion {
  id: string | number;
  data: any;
  label: string;
  op: 'replace' | 'add' | 'remove';
}

@customElement('mb-suggest')
export default class SuggestWrapper extends LitElement {
  /** @ignore */
  static styles = css`
    .suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sl-spacing-xx-small);
      margin-top: var(--sl-spacing-x-small);
    }

    sl-tag {
      cursor: pointer;
    }
  `;
  @event('mb-suggestion') _suggestionEvent: EventEmitter<{
    suggestion: Suggestion;
    path: string;
  }>;

  _handleSuggestion(suggestion: Suggestion) {
    console.log({ suggestion });
    this._suggestionEvent.emit({ detail: { suggestion, path: this.path } });
    this.suggestions = this.suggestions.filter(s => s.id !== suggestion.id);
  }

  @property({ type: String }) path: string;

  @property({ type: Array }) suggestions: Suggestion[] = [];

  render() {
    return html`
      <slot></slot>
      <div class="suggestions">
        ${this.suggestions.map(
          suggestion => html`
            <sl-button
              @click=${() => this._handleSuggestion(suggestion)}
              size="small"
              pill
              removable
              >${suggestion.label}</sl-button
            >
          `
        )}
      </div>
    `;
  }
}
