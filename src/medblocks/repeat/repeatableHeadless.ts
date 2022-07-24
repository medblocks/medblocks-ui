import { css, customElement } from 'lit-element';
import Repeatable from './Repeatable';

@customElement('mb-repeatable-headless')
export default class MbRepeatableHeadless extends Repeatable {
  /** @ignore */
  static styles = css`
    :host {
      display: none;
    }
  `;
}
