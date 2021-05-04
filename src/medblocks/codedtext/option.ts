import { customElement, LitElement, property } from 'lit-element';

@customElement('mb-option')
export default class MbOption extends LitElement {
  @property({ type: String, reflect: true }) code: string;
  @property({ type: String, reflect: true }) display: string;
}
