import { customElement, LitElement, property } from 'lit-element';

@customElement('mb-option')
export default class MbOption extends LitElement {
  @property({ type: String, reflect: true }) value: string;

  @property({ type: String, reflect: true }) label: string;

  @property({ type: Number, reflect: true }) ordinal: number;

  @property({ type: String, reflect: true }) type: string;
}
