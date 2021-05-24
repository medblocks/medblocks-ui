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
import { AxiosInstance } from 'axios';

import { unflattenComposition, openEHRFlatPlugin } from './plugins/openEHRFlat';
import { MbPlugin } from './plugins/plugins';
import MbSubmit from '../submit/submit';

/**
 * Reactive form that responds to changes in custom elements nested inside.
 * @fires mb-input - When contents of the form change. The result must be obtained using `e=>e.target.data`.
 * @fires mb-load - Triggered when the form first loads.
 * @fires mb-submit - Triggered with all the serialized data in the detail of the Event.
 */
@customElement('mb-form')
export default class MedblockForm extends LitElement {
  /** @ignore */
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

  @event('mb-load') load: EventEmitter<any>;

  /** Plugin to handle serialization and parsing of the input. openEHR and FHIR Plugins are built-in.*/
  @property({ type: Object }) plugin: MbPlugin = openEHRFlatPlugin;

  /** Hermes instance to communicate with for SNOMED CT search elements. */
  @property({ type: Object }) hermes: AxiosInstance;

  /** The child elements are loaded  */
  @state() mbElements: { [path: string]: EhrElement } = {};

  /**Runs validation on all the elements. Returns validation message. */
  validate() {}

  /**Parse output format to internal representation. */
  parse(data: any) {
    return this.plugin.parse(this.mbElements, data);
  }
  
  /**Serialize EHRElement to the output format - eg: openEHR FLAT format, FHIR resource.*/
  serialize(mbElements = this.mbElements) {
    return this.plugin.serialize(mbElements);
  }

  /**Parses and sets the form data to current data */
  import(data: any){
    this.data = this.parse(data)
  }

  export = this.serialize.bind(this)

  getStructured(flat: Data, path?: string) {
    return unflattenComposition(flat, path);
  }

  @event('mb-submit') submit: EventEmitter<any>;
  async handleSubmit() {
    this.insertContext();
    await 0;
    const data = this.serialize();
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

  
  get submitButton(): MbSubmit | null {
    return this.querySelector('mb-submit');
  }

  get data(): Data {
    let newValue: { [path: string]: any } = {};
    Object.entries(this.mbElements).map(([path, node]) => {
      newValue[path] = (node as any).data;
    });
    return newValue;
  }

  set data(data: Data) {
    const mbElementPaths = Object.keys(this.mbElements);
    const dataPaths = Object.keys(data)
    mbElementPaths.forEach(path => {
      let element = this.mbElements[path] as EhrElement;
      const value = data[path]
      element.data = value;
    });
    // Warnings
    const inDataButNotElements = dataPaths.filter(path => !mbElementPaths.includes(path))
    if (inDataButNotElements.length > 0) {
      console.warn(`These paths are not present in the current form, but were set: ${inDataButNotElements.join(', ')}.\nTry the "parse" method before setting the data on the form.`)
    }
  }

  handleInput(e: CustomEvent) {
    e.stopPropagation();
    this.input.emit();
  }

  handleSlotChange() {
    this.input.emit();
  }

  handleChildConnect(e: CustomEvent) {
    const path = e.detail;
    this.mbElements[path] = e.target as EhrElement;
    this.input.emit();
  }

  handleChildDisconnect(e: CustomEvent) {
    const path = e.detail;
    const { [path]: _, ...rest } = this.mbElements;
    this.mbElements = rest;
    this.input.emit();
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
    this.addEventListener('mb-connect', this.handleChildConnect);
    this.addEventListener('mb-disconnect', this.handleChildDisconnect);
    this.load.emit();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mb-dependency', this.handleDependency);
    this.removeEventListener('mb-connect', this.handleChildConnect);
    this.removeEventListener('mb-disconnect', this.handleChildDisconnect);
  }

  render() {
    return html`<slot
      @slotchange=${this.handleSlotChange}
      @mb-input=${this.handleInput}
      @mb-trigger-submit=${this.handleSubmit}
    ></slot> `;
  }
}
