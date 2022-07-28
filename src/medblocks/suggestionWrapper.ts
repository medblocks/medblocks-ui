import { css, customElement, html, LitElement, property } from 'lit-element';
import '@shoelace-style/shoelace/dist/components/tag/tag';
import { event, EventEmitter } from '../internal/decorators';

export interface Suggestion {
  id: string | number;
  data: any;
  label: string;
  op: 'replace' | 'add' | 'remove';
}

export interface SuggestEvent {
  suggestion: Suggestion;
  path: string;
  compositionLevel: boolean;
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
  @event('mb-suggestion') _suggestionEvent: EventEmitter<SuggestEvent>;

  _handleSuggestion(suggestion: Suggestion) {
    console.log({ suggestion });
    this._suggestionEvent.emit({
      detail: {
        suggestion,
        path: this.path,
        compositionLevel: this.compositionLevel,
      },
    });
    this.suggestions = this.suggestions.filter(s => s.id !== suggestion.id);
  }

  @property({ type: String }) path: string;

  @property({ type: Array }) suggestions: Suggestion[] = [];

  @property({ type: Boolean, reflect: true }) compositionLevel: boolean = false;

  @property({ type: String, reflect: true }) label: string = '';

  render() {
    return html`
      <slot></slot>
      <div class="suggestions">
        ${this.suggestions.length > 0 ? html`<span>${this.label}</span>` : null}
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
