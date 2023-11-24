import {
  customElement,
  property,
  queryAssignedNodes,
  state,
} from 'lit-element';
import { html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { event, EventEmitter } from '../../internal/decorators';
import EhrElement from '../EhrElement';
import Repeatable from './Repeatable';
/** Simple repeat component that copies the markup in the slot.
 * DOES NOT work with interactive if the elements have interactivity via JS (since outerHTML is copied through a string).
 * Use mb-repeatable-headless for more complex scenarios.
 * */
@customElement('mb-repeatable-simple')
export default class MbRepeatable extends Repeatable {
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
    // Only supports one nested element currently
    const nodes = this.assignedNodes.filter(
      node => node.nodeType === node.ELEMENT_NODE
    );
    if (nodes.length > 1) {
      // eslint-disable-next-line no-console
      console.warn(
        `mb-repeatable [path=${this.path}] only support one nested element. Got ${nodes.length} elements. Only taking the first.`
      );
    }
    [this.slotNode] = nodes;
  }

  replacePath(htmlPath: string, i: number) {
    const replaced = htmlPath.replace(this.regex, `$1:${i}`);
    return replaced;
  }

  @state() observer: MutationObserver;

  @event('mb-disconnect')
  _mbDisconnect: EventEmitter<string>;

  connectedCallback(): void {
    super.connectedCallback();
    this.count = 1;
    this.observer = new MutationObserver((mutationList, _) => {
      // let updated = false;
      mutationList.forEach(record => {
        if (record.removedNodes.length > 0) {
          record.removedNodes.forEach((node: EhrElement) => {
            if (node.isMbElement) {
              this._mbDisconnect.emit({ detail: node.path });
            } else if (node.nodeType === node.ELEMENT_NODE) {
              const allNodes = node.querySelectorAll('*'); // DOM queries are slow. There's scope to optimize.
              allNodes.forEach((nod: EhrElement) => {
                if (nod.isMbElement) {
                  this._mbDisconnect.emit({ detail: nod.path });
                }
              });
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

  @property({ type: String, reflect: true })
  css: string = '';

  render() {
    return html`
      <slot @slotchange=${this.reloadSlot}></slot>
      ${[...Array(this.count - 1)].map(
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
        <sl-button
          @click=${() => this.count > 1 && this.count--}
          ?disabled=${this.count <= 1}
          >Delete</sl-button
        >
      </slot>
      <link rel="stylesheet" href=${this.css} />
    `;
  }
}
