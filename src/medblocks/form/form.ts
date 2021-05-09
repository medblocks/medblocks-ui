import {
  css,
  customElement,
  html,
  state,
  LitElement,
  property,
} from 'lit-element';
import { event, EventEmitter, watch } from '../../internal/decorators';
import EhrElement from '../EhrElement';
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

  handleChildConnect(e: CustomEvent){
    const path = e.detail
    this.pathElementMap[path] = e.target as HTMLElement
  }

  handleChildDisconnect(e: CustomEvent){
    console.log({connected: e.detail})
  }

  handleDependency(e: CustomEvent<{ key: string; value: any }>) {
    const dependencies: { [key: string]: any } = {
      hermes: this.hermes,
    };

    e.detail.value = dependencies[e.detail.key];
  }
  async connectedCallback() {
    super.connectedCallback();
    this.addEventListener('mb-dependency', this.handleDependency);
    this.addEventListener('mb-connect', this.handleChildConnect)
    this.addEventListener('mb-disconnect', this.handleChildDisconnect)
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  
  render() {
    return html`<slot
      @slotchange=${this.handleSlotChange}
      @mb-input=${this.handleInput}
      @mb-submit=${this.handleSubmit}
    ></slot> `;
  }
}
