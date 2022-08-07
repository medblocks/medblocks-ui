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
import { Data, getDeletedPaths } from './utils';
import { AxiosInstance } from 'axios';
import { unflattenComposition, openEHRFlatPlugin } from './plugins/openEHRFlat';
import { MbPlugin } from './plugins/plugins';
import MbSubmit from '../submit/submit';
import SuggestWrapper, { SuggestEvent } from '../suggestionWrapper';
import Repeatable from '../repeat/Repeatable';
import MbHide from '../hide';

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

  @property({ type: String, reflect: true }) templateId: string = '';

  /** Should sending suggestions be disabled? */
  @property({ type: Boolean, reflect: true }) nosuggest: boolean = false;

  @event('mb-input') input: EventEmitter<any>;

  @event('mb-load') load: EventEmitter<any>;

  /** Plugin to handle serialization and parsing of the input. openEHR and FHIR Plugins are built-in.*/
  @property({ type: Object }) plugin: MbPlugin = openEHRFlatPlugin;

  /** Hermes instance to communicate with for SNOMED CT search elements. */
  @property({ type: Object }) hermes: AxiosInstance;

  /** Should data points that are set, but don't have a corresponding EhrElement be serialized? */
  @property({ type: Boolean, reflect: true }) serializeDeferredData: boolean =
    true;

  /** The child elements are loaded  */
  @state() mbElements: { [path: string]: EhrElement } = {};

  @state() repeatables: { [path: string]: Repeatable } = {};

  /** Runs validation on all the elements. Returns validation message. */
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
    const toSerialize = this.serializeDeferredData
      ? { ...mbElements, ...this.dataToContextElements(this.deferredData) }
      : mbElements;
    return this.plugin.serialize(toSerialize);
  }

  dataToContextElements(data: { [key: string]: any }): {
    [key: string]: EhrElement;
  } {
    const result: { [key: string]: EhrElement } = {};
    Object.keys(data).forEach(key => {
      const context = new MbContext();
      context.data = data[key];
      result[key] = context;
    });
    return result;
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
    // Delete context for paths where there is
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
    this.deferredData = {};
    const mbElementPaths = Object.keys(this.mbElements);
    const dataPaths = Object.keys(data);
    // Set calculate and set count of repeatable elements (mb-repeatable)
    Object.values(this.repeatables).forEach(el => {
      const regex = el.regex;
      const matches = dataPaths
        .map(path => regex.exec(path))
        .map(match => match?.[2])
        .filter(match => match)
        .map(str => str && parseInt(str)) as number[];
      const count = Math.max(...matches) + 1;
      el.count = count;
    });

    // storing in a deferredData and seting after mb-connect below.

    // Set data points
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
      // console.warn(
      //   `These paths are not present in the current form, but were set: ${inDataButNotElements.join(
      //     ', '
      //   )}.\nTry the "parse" method before setting the data on the form. Storing this for later use if the path becomes available later.`
      // );
      const object = Object.fromEntries(
        inDataButNotElements.map(key => [key, data[key]])
      );
      this.deferredData = { ...this.deferredData, ...object };
    }
  }

  @state()
  deferredData: Data = {};

  /** The domain to use in postMessage when sending suggestions */
  @property({ type: String, reflect: true }) suggestDomain: string = '*';

  handleInput(e: CustomEvent) {
    e.stopPropagation();
    // If loaded in iframe, send suggestions out.
    if (window.top && !this.nosuggest) {
      const message = {
        type: 'mb-input',
        data: {
          composition: this.data,
          templateId: this.templateId,
          format: 'MB-FLAT',
        },
      };
      window.top.postMessage(message, this.suggestDomain);
    }
    this.input.emit();
  }

  handleSlotChange() {
    this.input.emit();
  }

  getTarget(e: CustomEvent) {
    // For getting input from within shadow dom
    return e.composedPath()[0];
  }

  handleChildConnect(e: CustomEvent) {
    const path = e.detail;
    this.mbElements[path] = this.getTarget(e) as EhrElement;
    // Check if data is present in deferred data
    if (this.deferredData[path] != null) {
      console.log('deferred data present!!');
      const { [path]: data, ...excluded } = this.deferredData;
      this.mbElements[path].data = data;
      this.deferredData = excluded;
    }
    this.input.emit();
  }

  handleRepeatableConnect(e: CustomEvent) {
    const path = e.detail;
    this.repeatables[path] = this.getTarget(e) as Repeatable;
    // Check if data is present in deferred data
    this.input.emit();
  }

  // Does not work except for mb-repeat due to https://github.com/WICG/webcomponents/issues/678, https://github.com/whatwg/dom/issues/533
  // Handled using Mutation Observer.
  handleChildDisconnect(e: CustomEvent) {
    const path = e.detail;
    const { [path]: _, ...cleaned } = this.mbElements;
    this.mbElements = cleaned;
    this.mbElements = this.mbElements;
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

    // Handle mb-hide elements
    const hideElements = this.querySelectorAll('mb-hide');
    // console.log({ hideElements });
    hideElements.forEach((el: MbHide) => {
      if (data[el.path]) {
        el.show = true;
      } else {
        el.show = false;
      }
    });

    // Handle composition level suggestions
    const globalSuggests = this.querySelectorAll('mb-suggest[global]');
    // console.log({ globalSuggests });
    globalSuggests.forEach((el: SuggestWrapper) => {
      const suggestion = data[el.path];
      // console.log({ el, suggestion });
      if (suggestion) {
        el.suggestions = suggestion;
      }
    });
  }

  handleSuggestion(e: CustomEvent<SuggestEvent>) {
    const { suggestion, path, global } = e.detail;

    if (global) {
      this.import(suggestion.data);

      // If changing to internal data format instead of FLAT
      // this.data = suggestion.data
      return;
    }

    // console.log('Handling suggestion', path, suggestion);
    const element = this.mbElements[path];
    if (element) {
      const oldData = element.data;
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
  }

  handleParentMessage = (e: MessageEvent) => {
    const message = e?.data;
    if (message?.type === 'mb-suggestion') {
      const suggestion = message?.data?.suggestion;
      const templateId = message?.data?.templateId;
      if (suggestion && this.templateId === templateId) {
        this.addSuggestion(suggestion);
      }
    }
  };

  @state() observer: MutationObserver;

  async connectedCallback() {
    super.connectedCallback();
    this.observer = new MutationObserver((mutationList, _) => {
      const { ehrElementsRemoved, repeatablesRemoved } =
        getDeletedPaths(mutationList);
      ehrElementsRemoved.forEach(path => {
        const { [path]: _, ...rest } = this.mbElements;
        this.mbElements = rest;
      });
      repeatablesRemoved.forEach(path => {
        const { [path]: _, ...rest } = this.repeatables;
        this.repeatables = rest;
      });
      if (repeatablesRemoved.length + ehrElementsRemoved.length > 0) {
        this.input.emit();
      }
    });

    this.observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    this.addEventListener('mb-connect', this.handleChildConnect);
    this.addEventListener(
      'mb-connect-repeatable',
      this.handleRepeatableConnect
    );
    // Only for mb-repeat. Otherwise using MutationObserver
    this.addEventListener('mb-disconnect', this.handleChildDisconnect);
    this.addEventListener('mb-dependency', this.handleDependency);
    this.addEventListener('mb-path-change', this.handleChildPathChange);
    this.addEventListener('mb-suggestion', this.handleSuggestion);
    if (window.top && !this.nosuggest) {
      window.addEventListener('message', this.handleParentMessage);
    }
    this.load.emit();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mb-connect', this.handleChildConnect);
    this.removeEventListener(
      'mb-connect-repeatable',
      this.handleRepeatableConnect
    );
    this.removeEventListener('mb-disconnect', this.handleChildDisconnect);
    this.removeEventListener('mb-dependency', this.handleDependency);
    this.removeEventListener('mb-path-change', this.handleChildPathChange);
    this.removeEventListener('mb-suggestion', this.handleSuggestion);
    if (window.top && !this.nosuggest) {
      window.removeEventListener('message', this.handleParentMessage);
    }
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
