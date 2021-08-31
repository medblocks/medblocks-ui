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

  /**Skip validation of form */
  @property({ type: Boolean, reflect: true }) novalidate: boolean = false;

  @event('mb-input') input: EventEmitter<any>;

  @event('mb-load') load: EventEmitter<any>;

  /** Plugin to handle serialization and parsing of the input. openEHR and FHIR Plugins are built-in.*/
  @property({ type: Object }) plugin: MbPlugin = openEHRFlatPlugin;

  /** Hermes instance to communicate with for SNOMED CT search elements. */
  @property({ type: Object }) hermes: AxiosInstance;

  /** The child elements are loaded  */
  @state() mbElements: { [path: string]: EhrElement } = {};

  /**Runs validation on all the elements. Returns validation message. */
  validate(): boolean {
    if (this.novalidate) {
      return true;
    }
    const report = Object.values(this.mbElements).map((el: EhrElement) => {
      return el.reportValidity();
    });
    return report.every(a => a === true);
  }

  /**Parse output format to internal representation. */
  parse(data: any) {
    return this.plugin.parse(this.mbElements, data);
  }

  /**Serialize EHRElement to the output format - eg: openEHR FLAT format, FHIR resource.*/
  serialize(mbElements = this.mbElements) {
    return this.plugin.serialize(mbElements);
  }

  /**Parses and sets the form data to current data */
  import(data: any) {
    this.data = this.parse(data);
  }

  export = this.serialize.bind(this);

  getStructured(flat: Data, path?: string) {
    return unflattenComposition(flat, path);
  }

  @event('mb-submit') submit: EventEmitter<any>;
  async handleSubmit() {
    if (this.validate()) {
      this.insertContext();
      await 0;
      const data = this.serialize();
      this.submit.emit({ detail: data, cancelable: true });
    }
  }

  insertContext() {
    const nonNullPaths = Object.keys(this.mbElements).filter(
      k => this.mbElements[k].data != null                                 ///// check if breaks ////
    );
    Object.values(this.mbElements)
      .filter((element: MbContext) => !!element.autocontext)
      .forEach((element: MbContext) => {
        const path = element.path;
        const contextData = this.overwritectx
          ? this.plugin.getContext(path, this.ctx, nonNullPaths)
          : element.data ??
          this.plugin.getContext(path, this.ctx, nonNullPaths);
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
    const dataPaths = Object.keys(data);
    mbElementPaths.forEach(path => {
      let element = this.mbElements[path] as EhrElement;
      const value = data[path];
      element.data = value;
    });
    // Warnings
    const inDataButNotElements = dataPaths.filter(
      path => !mbElementPaths.includes(path)
    );
    if (inDataButNotElements.length > 0) {
      console.warn(
        `These paths are not present in the current form, but were set: ${inDataButNotElements.join(
          ', '
        )}.\nTry the "parse" method before setting the data on the form.`
      );
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


  handleChildPathChange(e: CustomEvent<{ oldPath: string, newPath: string }>) {
    console.log("Path changed", e.detail)
    const detail = e.detail
    const element = this.mbElements[detail.oldPath]
    this.removeMbElement(detail.oldPath)
    this.mbElements[detail.newPath] = element
    this.input.emit()
  }

  removeMbElement(path: string) {
    const { [path]: _, ...rest } = this.mbElements;
    this.mbElements = rest;
  }

  handleDependency(e: CustomEvent<{ key: string; value: any }>) {
    const dependencies: { [key: string]: any } = {
      hermes: this.hermes,
    };

    e.detail.value = dependencies[e.detail.key];
  }

  @state() observer: MutationObserver

  async connectedCallback() {
    super.connectedCallback();
    this.observer = new MutationObserver((mutationList, _) => {
      let updated = false
      mutationList.forEach(record => {
        if (record.addedNodes.length > 0) {
          record.addedNodes.forEach((node: EhrElement) => {
            if (node.isMbElement) {
              console.log("adding", node.path)
              this.mbElements[node.path] = node
              updated = true
            }
          })
        }

        if (record.removedNodes.length > 0) {
          record.removedNodes.forEach((node: EhrElement) => {
            if (node.isMbElement) {
              console.log("removing", node.path)
              const { [node.path]: _, ...rest } = this.mbElements;
              this.mbElements = rest;
              updated = true
            }
          })
        }

        if (updated) {
          this.input.emit()
        }
      })
    })
    this.observer.observe(this, { childList: true, attributes: false, subtree: true })
    this.addEventListener('mb-connect', this.handleChildConnect)
    this.addEventListener('mb-dependency', this.handleDependency);
    this.addEventListener('mb-path-change', this.handleChildPathChange);
    this.load.emit();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mb-connect', this.handleChildConnect)
    this.removeEventListener('mb-dependency', this.handleDependency);
    this.removeEventListener('mb-path-change', this.handleChildPathChange);
    this.observer.disconnect()
  }

  render() {
    return html`<slot @slotchange=${this.handleSlotChange} @mb-input=${this.handleInput} @mb-trigger-submit=${this.handleSubmit}></slot>`;
  }
}
