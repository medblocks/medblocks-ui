import { customElement, LitElement, property } from 'lit-element';

@customElement('mb-filter')
export default class MbFilter extends LitElement {
  @property({ type: String, reflect: true }) label: string;

  @property({ type: String, reflect: true }) value: string;

  @property({ type: Boolean, reflect: true }) disabled = false;
}
