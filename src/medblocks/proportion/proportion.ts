import { customElement, property } from 'lit-element';

import '@shoelace-style/shoelace/dist/components/input/input';

import './MbProportion';
import MbProportion from './MbProportion';

@customElement('mb-proportion')
export default class MbPercent extends MbProportion {
  @property({ type: String, reflect: true }) type = 'unitary';

  @property({ type: String, reflect: true }) min = '0';

  @property({ type: String, reflect: true }) max = '1';
}
