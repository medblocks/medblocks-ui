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
import SuggestWrapper, { Suggestion } from '../SuggestWrapper';

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
      // console.log(data);
      this.submit.emit({ detail: data, cancelable: true });
    }
  }

  isNotEmpty(value: any) {
    // array check
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    // object check
    if (value && Object.getPrototypeOf(value) === Object.prototype) {
      return Object.keys(value).length > 0;
    }

    if (value === '') {
      return false;
    }
    // null and undefined check
    return value != null;
  }

  isContextElement(element: EhrElement) {
    return (element as any)?.autocontext != null;
  }
  nonEmptyPaths() {
    // undefined, null, [], {} are considered empty
    // Context elements are also considered empty for this purpose
    return Object.keys(this.mbElements).filter(
      k =>
        this.isNotEmpty(this.mbElements[k].data) &&
        !this.isContextElement(this.mbElements[k])
    );
    // .filter(k => (this.mbElements[k] as MbContext)?.autocontext != null);
  }

  nonContextPaths() {
    return Object.keys(this.mbElements).filter(
      k => (this.mbElements[k] as MbContext)?.autocontext == null
    );
  }

  insertContext() {
    const nonNullPaths = this.nonEmptyPaths();
    // TODO: Delete context for paths where there is
    Object.values(this.mbElements)
      .filter((element: MbContext) => !!element.autocontext)
      .forEach((element: MbContext) => {
        const path = element.path;
        const valueToInsert = this.plugin.getContext(
          path,
          this.ctx,
          nonNullPaths,
          this.mbElements
        );

        if (valueToInsert != null) {
          // Insert old value or new value depending on overwritectx
          const contextData = this.overwritectx
            ? this.plugin.getContext(
                path,
                this.ctx,
                nonNullPaths,
                this.mbElements
              )
            : element.data ??
              this.plugin.getContext(
                path,
                this.ctx,
                nonNullPaths,
                this.mbElements
              );
          element.data = contextData;
        } else {
          element.data = undefined;
        }
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

  @property({ type: Boolean }) iframeCds: boolean = true;

  handleInput(e: CustomEvent) {
    e.stopPropagation();
    if (window.top && this.iframeCds) {
      window.top.postMessage({ type: 'mb-input', data: this.data }, '*');
    }
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

  handleChildPathChange(e: CustomEvent<{ oldPath: string; newPath: string }>) {
    const detail = e.detail;
    const element = this.mbElements[detail.oldPath];
    this.removeMbElement(detail.oldPath);
    this.mbElements[detail.newPath] = element;
    this.input.emit();
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

  addSuggestion(data: any) {
    const suggestElements = Object.keys(data)
      .map(key => {
        return {
          key,
          suggest: this.mbElements[key]?.parentElement as SuggestWrapper,
        };
      })
      .filter(({ suggest }) => suggest?.nodeName === 'MB-SUGGEST');
    suggestElements.forEach(({ key, suggest }) => {
      const suggestions = data[key];
      suggest.suggestions = suggestions;
      suggest.path = key;
    });
  }

  handleSuggestion(e: CustomEvent<{ suggestion: Suggestion; path: string }>) {
    const { suggestion, path } = e.detail;
    console.log('Handling suggestion', path, suggestion);
    const element = this.mbElements[path];
    const oldData = element.data;
    console.log({ oldData, element });
    if (suggestion.op === 'replace') {
      element.data = suggestion.data;
    } else if (suggestion.op === 'add') {
      if (Array.isArray(element.data)) {
        element.data = [...oldData, suggestion.data];
      } else if (element.data == null) {
        element.data = [suggestion.data];
      } else {
        // replace if it's not array
        element.data = suggestion.data;
      }
    } else {
      // default to replace
      element.data = suggestion.data;
    }
  }

  @state() observer: MutationObserver;

  async connectedCallback() {
    super.connectedCallback();
    this.observer = new MutationObserver((mutationList, _) => {
      let updated = false;
      mutationList.forEach(record => {
        // if (record.addedNodes.length > 0) {
        //   record.addedNodes.forEach((node: EhrElement) => {
        //     if (node.isMbElement) {
        //       console.log("adding", node.path)
        //       this.mbElements[node.path] = node
        //       updated = true
        //     }
        //   })
        // }
        if (record.removedNodes.length > 0) {
          record.removedNodes.forEach((node: EhrElement) => {
            if (node.isMbElement) {
              const { [node.path]: _, ...rest } = this.mbElements;
              this.mbElements = rest;
              updated = true;
            } else {
              if (node.nodeType === node.ELEMENT_NODE) {
                const allNodes = node.querySelectorAll('*'); //Very slow
                allNodes.forEach((node: EhrElement) => {
                  if (node.isMbElement) {
                    const { [node.path]: _, ...rest } = this.mbElements;
                    this.mbElements = rest;
                    updated = true;
                  }
                });
              }
            }
          });
        }

        if (updated) {
          this.input.emit();
        }
      });
    });
    this.observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: false,
    });
    this.addEventListener('mb-connect', this.handleChildConnect);
    this.addEventListener('mb-dependency', this.handleDependency);
    this.addEventListener('mb-path-change', this.handleChildPathChange);
    this.addEventListener('mb-suggestion', this.handleSuggestion);
    this.load.emit();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mb-connect', this.handleChildConnect);
    this.removeEventListener('mb-dependency', this.handleDependency);
    this.removeEventListener('mb-path-change', this.handleChildPathChange);
    this.removeEventListener('mb-suggestion', this.handleSuggestion);
    this.observer.disconnect();
  }

  render() {
    return html`<slot
      @slotchange=${this.handleSlotChange}
      @mb-input=${this.handleInput}
      @mb-trigger-submit=${this.handleSubmit}
    ></slot>`;
  }
}
