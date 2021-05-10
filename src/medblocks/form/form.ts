import {
  css,
  customElement,
  html,
  state,
  LitElement,
  property,
} from 'lit-element';
import { event, EventEmitter } from '../../internal/decorators';
import EhrElement from '../EhrElement';
import MbContext from '../context/context';
import { Data } from './utils';
import { openEHRPlugin } from './plugins';
import { AxiosInstance } from 'axios';

import { unflattenComposition } from './openEHR';
import { MbPlugin } from './plugins';
import MbSubmit from '../submit/submit';

/**
 * Reactive form that responds to changes in custom elements nested inside.
 * @fires load - Triggered when the form first loads.
 * @fires mb-input - When contents of the form change. The result must be obtained using `e=>e.target.data`.
 */
@customElement('mb-form')
export default class MedblockForm extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;
  /**Context object that is set before submitting form. Automatic inferences are made where possible. */
  @property({ type: Object }) ctx: any;

  /**Context will not be automatically inferd. What you pass in will be directly reflected. */
  @property({ type: Boolean, reflect: true }) overwritectx: boolean = false;

  @event('mb-input') input: EventEmitter<any>;

  @event('load') load: EventEmitter<any>;

  /**openEHR or FHIR data repository to communicate with. Pass baseURL, authentication details and headers into an axios instance using `axios.create()`.*/
  @property({ type: Object }) cdr: AxiosInstance;
  
  /**Template ID of the openEHR template, as in the CDR */
  @property({ type: String, reflect: true }) template: string;

  /**EHR ID to commit the composition/resource on */
  @property({ type: String, reflect: true }) ehr: string;
  
  /** Plugin to handle serialization and parsing of the input. openEHR and FHIR Plugins are built-in. openEHR is set by default.*/
  @property({ type: Object }) plugin: MbPlugin = openEHRPlugin;

  /** Hermes instance to communicate with for SNOMED CT search elements. */
  @property({ type: Object }) hermes: AxiosInstance;

  /** The child elements are loaded  */
  @state() mbElements: { [path: string]: EhrElement } = {};


  async get(uid: string) {
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

  @event('submit') submit: EventEmitter<any>;
  async handleSubmit() {
    this.insertContext();
    await 0;
    const data = this.export();
    this.submit.emit({ detail: data, cancelable: true });
  }

  insertContext() {
    Object.values(this.mbElements)
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

  get data(): Data{
    let newValue: { [path: string]: any } = {};
    Object.entries(this.mbElements).map(([path, node]) => {
      newValue[path] = (node as any).data;
    });
    return newValue;
  }

  set data(data: Data){
    Object.keys(this.mbElements).forEach(path => {
      let element = this.mbElements[path] as EhrElement;
      element.data = data[path];
    });
  }

  handleInput(e: CustomEvent) {
    e.stopPropagation();
    this.input.emit();
  }

  handleSlotChange() {
    this.input.emit();
  }

  handleChildConnect(e: CustomEvent){
    const path = e.detail
    this.mbElements[path] = e.target as EhrElement
    this.input.emit()
  }

  handleChildDisconnect(e: CustomEvent){
    const path = e.detail
    const {[path]: _, ...rest} = this.mbElements
    this.mbElements = rest
    this.input.emit()
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
    this.load.emit()
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mb-dependency', this.handleDependency);
    this.removeEventListener('mb-connect', this.handleChildConnect)
    this.removeEventListener('mb-disconnect', this.handleChildDisconnect)
  }

  render() {
    return html`<slot
      @slotchange=${this.handleSlotChange}
      @mb-input=${this.handleInput}
      @mb-submit=${this.handleSubmit}
    ></slot> `;
  }
}
