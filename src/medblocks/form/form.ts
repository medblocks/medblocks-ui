import {
  css,
  customElement,
  html,
  state,
  LitElement,
  property,
} from 'lit-element';
import { event, EventEmitter, watch } from '../../internal/decorators';
import EhrElement from '../base/base';
import MbContext from '../context/context';
import { Data } from './utils';
import { openEHRPlugin } from './plugins';
import { AxiosInstance } from 'axios';

import { unflattenComposition } from './openEHR';
import { MbPlugin } from './plugins';
import MbSubmit from '../submit/submit';

@customElement('mb-form')
export default class MedblockForm extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;
  @property({ type: String }) selectorAttribute: string = 'path';

  @property({ type: Object }) data: Data;

  @property({ type: Object }) ctx: any;

  @property({ type: Boolean, reflect: true }) overwritectx: boolean = false;

  @event('mb-input') input: EventEmitter<any>;

  @event('load') load: EventEmitter<any>;

  @property({ type: Object }) cdr: AxiosInstance;

  @property({ type: String, reflect: true }) uid: string;

  @property({ type: String, reflect: true }) template: string;

  @property({ type: String, reflect: true }) ehr: string;

  @property({ type: Object }) plugin: MbPlugin = openEHRPlugin;

  @property({ type: Object }) hermes: AxiosInstance;

  @state() pathElementMap: { [path: string]: HTMLElement } = {};

  @state() observer: MutationObserver;

  @state() loadTimeout: number;

  @state() loaded: boolean = false;

  @state() loadDebounceMs = 80;

  get selector() {
    return `[${this.selectorAttribute}]`;
  }
  async get(uid: string = this.uid) {
    this.plugin.get(this.cdr, uid);
  }

  async post(data: Data) {
    this.plugin.post(this.cdr, data);
  }

  async put(uid: string, data: Data) {
    if (this.plugin.put) {
      return this.plugin.put(this.cdr, uid, data);
    }
    console.error(`put function is undefined in plugin`, this.plugin);
    return;
  }

  getStructured(flat: Data, path?: string) {
    return unflattenComposition(flat, path);
  }

  @watch('pathElementMap')
  handleElementsChange() {
    clearTimeout(this.loadTimeout);
    if (!this.loaded) {
      this.loadTimeout = window.setTimeout(() => {
        this.loaded = true;
        this.load.emit();
      }, this.loadDebounceMs);
    }
  }

  @watch('data')
  handleDataChange(_: any, newValue: any) {
    // Check only whichever has changed. This is also slow.
    Object.keys(this.pathElementMap).forEach(path => {
      let element = this.pathElementMap[path] as EhrElement;
      element.data = newValue[path];
    });
  }

  @event('submit') submit: EventEmitter<any>;
  async handleSubmit() {
    this.insertContext();
    await 0;
    const data = this.export();
    this.submit.emit({ detail: data, cancelable: true });
  }

  insertContext() {
    Object.values(this.pathElementMap)
      .filter((element: MbContext) => !!element.autocontext)
      .forEach((element: MbContext) => {
        const path = element.path;
        const contextData = this.overwritectx
          ? this.plugin.getContext(path, this.ctx)
          : element.data ?? this.plugin.getContext(path, this.ctx);
        element.data = contextData;
      });
  }

  export(data: Data = this.data) {
    return this.plugin.export(data);
  }

  get submitButton(): MbSubmit | null {
    return this.querySelector('mb-submit');
  }

  currentPathElementMap(el: HTMLElement): { [path: string]: HTMLElement } {
    // TODO: This is the slowest function. Find ways to speed it up.
    const selfElement = el.matches(this.selector) ? (el as EhrElement) : null;
    const childElements = el.querySelectorAll(this.selector);
    let map = {};
    childElements.forEach((el: any) => {
      const path = el.path;
      if (Object.keys(map).includes(path)) {
        console.debug(
          `${path} included twice. Only the last occurance will be considered.`
        );
      }
      map = { ...map, [el.path]: el };
    });
    if (selfElement) {
      map = { ...map, [selfElement.path]: selfElement };
    }
    return map;
  }

  currentData() {
    let newValue: { [path: string]: any } = {};
    Object.entries(this.pathElementMap).map(([path, node]) => {
      newValue[path] = (node as any).data;
    });
    return newValue;
  }

  handleInput(e: CustomEvent) {
    e.stopPropagation();
    // TODO Only handle current data for the event target. Not all. This is slow.
    this.data = this.currentData();
    this.input.emit();
  }
  handleSlotChange() {
    this.data = this.currentData();
    this.input.emit();
  }

  async connectedCallback() {
    // Set pathElementMap first
    super.connectedCallback();
    this.addEventListener('mb-dependency', this.handleDependency);
    await 0;
    this.pathElementMap = this.currentPathElementMap(this);
    this.observer = new MutationObserver(mutationRecord => {
      // Handle attribute change
      mutationRecord
        .filter(record => record.type === 'attributes')
        .forEach(record => {
          // Remove oldValue if exists in pathElementMap
          if (record.oldValue) {
            let newPathElementMap = { ...this.pathElementMap };
            delete newPathElementMap[record.oldValue];
            this.pathElementMap = newPathElementMap;
          }

          // Add getAttribute(path) if exists
          const target = record.target as HTMLElement;
          const attribute = target.getAttribute(this.selectorAttribute);
          if (attribute) {
            // TODO Will not work if path is still passed in as property and attribute is just for selector
            this.pathElementMap = {
              ...this.pathElementMap,
              [attribute]: target,
            };
          }
        });
      const addedNodes = mutationRecord
        .map(record => [...record.addedNodes])
        .flat();
      const removedNodes = mutationRecord
        .map(record => [...record.removedNodes])
        .flat();

      addedNodes
        .filter(node => node.nodeType === Node.ELEMENT_NODE)
        .map(node => this.currentPathElementMap(node as HTMLElement))
        .forEach(pathElement => {
          this.pathElementMap = { ...this.pathElementMap, ...pathElement };
        });

      removedNodes
        .filter(node => node.nodeType === Node.ELEMENT_NODE)
        .map(node => this.currentPathElementMap(node as HTMLElement))
        .forEach(pathElement => {
          const pathsToRemove = Object.keys(pathElement);
          let newPathElementMap = { ...this.pathElementMap };
          pathsToRemove.forEach(path => {
            delete newPathElementMap[path];
          });
          this.pathElementMap = newPathElementMap;
        });
      // TODO Only handle newly added/deleted nodes. Slow currently. Attribute/data change is handled by handleInput.
      // Update the path element map based on mutations
      this.data = this.currentData();
      this.input.emit();
    });
    this.observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [this.selectorAttribute],
      attributeOldValue: true,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer.disconnect();
  }

  handleDependency(e: CustomEvent<{ key: string; value: any }>) {
    const dependencies: { [key: string]: any } = {
      hermes: this.hermes,
    };

    e.detail.value = dependencies[e.detail.key];
  }
  render() {
    return html`<slot
      @slotchange=${this.handleSlotChange}
      @mb-input=${this.handleInput}
      @mb-submit=${this.handleSubmit}
    ></slot> `;
  }
}
