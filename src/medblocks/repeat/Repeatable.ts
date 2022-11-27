import { LitElement, property } from 'lit-element';
import { event, EventEmitter, watch } from '../../internal/decorators';

export function getRepeatableRegex(path: string) {
  return new RegExp(`(${path}):(\\d+)`, 'g');
}

export default class Repeatable extends LitElement {
  isRepeatable: boolean = true;

  @property({ type: Number, reflect: true })
  count: number = 0;

  @property({ type: String, reflect: true })
  path: string;

  @event('mb-count')
  _mbCount: EventEmitter<number>;

  @event('mb-connect-repeatable')
  _mbConnectRepeatable: EventEmitter<string>;

  get regex(): RegExp {
    return getRepeatableRegex(this.path);
  }

  connectedCallback() {
    super.connectedCallback();
    this._mbConnectRepeatable.emit({ detail: this.path });
  }

  @watch('count')
  handleCountChange(_: number, newCount: number) {
    this._mbCount.emit({ detail: newCount });
  }
}
