import {
  customElement,
  LitElement,
  property,
  queryAssignedNodes,
  state,
} from 'lit-element';
import { html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { event, EventEmitter } from '../../internal/decorators';
import EhrElement from '../EhrElement';
@customElement('mb-repeatable')
export default class MbRepeatable extends LitElement {
  handleAdd() {
    this.count++;
  }

  _getSlotElements() {
    const slot = this.shadowRoot!.querySelector('slot');
    return slot?.assignedElements({ flatten: true });
  }

  @queryAssignedNodes(undefined, true)
  assignedNodes: Array<HTMLElement>;

  @state()
  slotNode: HTMLElement;

  reloadSlot() {
    this.slotNode = this.assignedNodes[0];
  }

  replacePath(html: string, i: number) {
    const regex = new RegExp(`(${this.path}):(\\d+)`, 'g');
    const replaced = html.replace(regex, `$1:${i}`);
    return replaced;
  }

  @state() observer: MutationObserver;

  @event('mb-disconnect')
  _mbDisconnect: EventEmitter<string>;

  connectedCallback(): void {
    super.connectedCallback();
    this.observer = new MutationObserver((mutationList, _) => {
      // let updated = false;
      mutationList.forEach(record => {
        if (record.removedNodes.length > 0) {
          record.removedNodes.forEach((node: EhrElement) => {
            if (node.isMbElement) {
              this._mbDisconnect.emit({ detail: node.path });
            } else {
              if (node.nodeType === node.ELEMENT_NODE) {
                const allNodes = node.querySelectorAll('*'); // DOM queries are slow. There's scope to optimize.
                allNodes.forEach((node: EhrElement) => {
                  if (node.isMbElement) {
                    this._mbDisconnect.emit({ detail: node.path });
                  }
                });
              }
            }
          });
        }
      });
    });
    this.observer.observe(this.renderRoot, {
      childList: true,
      subtree: true,
      // Does not need to watch attributes, because path is tracked using EhrElement's mb-path-change.
      // Makes it slightly faster.
      attributes: false,
    });
  }

  @property()
  count: number = 0;

  @property({ type: String, reflect: true })
  path: string;

  @property({ type: String, reflect: true })
  css: string = '';

  render() {
    return html`
      <slot @slotchange=${this.reloadSlot}></slot>
      ${[...Array(this.count)].map(
        (_, i) =>
          html`${unsafeHTML(this.replacePath(this.slotNode?.outerHTML, i + 1))}`
      )}

      <slot name="add">
        <sl-button
          @click=${() => {
            this.count++;
          }}
          >Add</sl-button
        >
      </slot>
      <slot name="delete">
        <sl-button @click=${() => this.count > 0 && this.count--}
          >Delete</sl-button
        >
      </slot>
      <link rel="stylesheet" href=${this.css} />
    `;
  }
}
