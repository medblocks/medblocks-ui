import { customElement, LitElement, property } from 'lit-element';

@customElement('mb-unit')
export default class MbUnit extends LitElement {
  @property({ type: String, reflect: true }) unit: string;
  @property({ type: String, reflect: true }) label: string;
}
