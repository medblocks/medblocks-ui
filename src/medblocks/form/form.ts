import {
  css,
  customElement,
  html,
  state,
  LitElement,
  property,
} from 'lit-element';
import { event, type EventEmitter, watch } from '../../internal/decorators';
import type EhrElement from '../EhrElement';
import type { Variant } from '../EhrElement';
import MbContext from '../context/context';
import type { Data } from './utils';
import { unflattenComposition, openEHRFlatPlugin } from './plugins/openEHRFlat';
import type { MbPlugin } from './plugins/plugins';
import type MbSubmit from '../submit/submit';
import type SuggestWrapper from '../suggestionWrapper';
import type { SuggestEvent } from '../suggestionWrapper';
import type Repeatable from '../repeat/Repeatable';
import { getRepeatableRegex } from '../repeat/Repeatable';
import type MbHide from '../hide';
import type { SearchFunction } from '../codedtext/searchFunctions';

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

  /** Context object that is set before submitting form. Automatic inferences are made where possible. */
  @property({ type: Object }) ctx: any;

  /** Context will not be automatically inferd. What you pass in will be directly reflected. */
  @property({ type: Boolean, reflect: true }) overwritectx = false;

  /** Skip validation of form */
  @property({ type: Boolean, reflect: true }) novalidate = false;

  @property({ type: String, reflect: true }) templateId = '';

  /** Should sending suggestions be disabled? */
  @property({ type: Boolean, reflect: true }) nosuggest = false;

  @property({ type: String, reflect: true }) variant: Variant = 'normal';

  @property({ type: Function })
  handleSearch: SearchFunction;

  @watch('variant')
  handleVariantChange(_: Variant, newVariant: Variant) {
    this.mbElementSet.forEach(el => {
      if (!el.variant) {
        el.variant = newVariant;
      }
    });
  }
  @watch('handleSearch')
  handleSearchChange(_: Variant, newHandleSearch: SearchFunction) {
    this.mbElementSet.forEach(el => {
      if (!el.handleSearch) {
        el.handleSearch = newHandleSearch;
      }
    });
  }

  @event('mb-input') _input: EventEmitter<any>;

  @event('mb-load') load: EventEmitter<any>;

  /** Plugin to handle serialization and parsing of the input. openEHR and FHIR Plugins are built-in. */
  @property({ type: Object }) plugin: MbPlugin = openEHRFlatPlugin;

  /** Should data points that are set, but don't have a corresponding EhrElement be serialized? */
  @property({ type: Boolean, reflect: true }) serializeDeferredData = true;

  /** The child elements are loaded  */
  @state() mbElementSet: Set<EhrElement> = new Set();

  get mbElements(): { [path: string]: EhrElement } {
    const result: { [path: string]: EhrElement } = {};
    this.mbElementSet.forEach(el => {
      const { path } = el;
      result[path] = el;
    });
    return result;
  }

  @state() repeatables: { [path: string]: Repeatable } = {};

  @state() updates: Function[] = [];

  /** Runs validation on all the elements. Returns validation message. */
  validate(): boolean {
    if (this.novalidate) {
      return true;
    }
    const report = Object.values(this.mbElements).map((el: EhrElement) =>
      el.reportValidity()
    );
    return report.every(a => a === true);
  }

  /** Parse output format to internal representation. */
  parse(data: any) {
    return this.plugin.parse(this.mbElements, data);
  }

  /** Serialize EHRElement to the output format - eg: openEHR FLAT format, FHIR resource. */
  serialize(mbElements = this.mbElements) {
    const toSerialize = this.serializeDeferredData
      ? { ...mbElements, ...this.dataToContextElements(this.deferredData) }
      : mbElements;
    const filteredObject: { [path: string]: EhrElement } = {};
    Object.keys(toSerialize).forEach((key: string) => {
      // remove paths with data as ""
      if (this.hasValue(toSerialize[key].data))
        filteredObject[key] = toSerialize[key];
    });
    return this.plugin.serialize(filteredObject);
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

  /** Parses and sets the form data to current data */
  import(data: any) {
    this.data = this.parse(data);
  }

  export() {
    if (this.validate()) {
      this.insertContext();
      return this.serialize();
    }
  }

  clear() {
    this.data = this.parse({});
  }

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
      this.sendWebMessage(true);
    }
  }

  hasValue(value: any) {
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
        this.hasValue(this.mbElements[k].data) &&
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
        const { path } = element;
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

  async ensureContextsRegistered() {
    // Wait for initial render
    await new Promise(resolve => setTimeout(resolve, 0));
    // Find all context elements
    const contexts = Array.from(this.querySelectorAll('mb-context'));
    // Ensure each context is in mbElements
    contexts.forEach(context => {
      const path = context.getAttribute('path');
      if (path && !this.mbElements[path]) {
        this.mbElementSet.add(context as EhrElement);
      }
    });
  }

  get submitButton(): MbSubmit | null {
    return this.querySelector('mb-submit');
  }

  get data(): Data {
    const newValue: { [path: string]: any } = {};
    Object.entries(this.mbElements).forEach(([path, node]) => {
      newValue[path] = (node as any).data;
    });
    return newValue;
  }

  getCount(pathString: string | RegExp, data: any): number {
    let regex: RegExp;
    if (typeof pathString === 'string') {
      regex = getRepeatableRegex(pathString);
    } else {
      regex = pathString;
    }
    const keys = Object.keys(data);
    const matches = keys
      .map(path => {
        const match = regex.exec(path);
        regex.lastIndex = 0;
        return match;
      })
      .map(match => match?.[2])
      .filter(match => match)
      .map(str => str && parseInt(str, 10)) as number[];
    if (matches.length === 0) {
      return 0;
    }
    const count = Math.max(...matches) + 1;
    return count;
  }

  set data(data: Data) {
    this.deferredData = {};
    const { mbElements } = this;
    const mbElementPaths = Object.keys(mbElements);

    // Set calculate and set count of repeatable elements (mb-repeatable)
    Object.values(this.repeatables).forEach(el => {
      const { regex } = el;
      el.count = this.getCount(regex, data);
    });

    // storing in a deferredData and seting after mb-connect below.

    // Set data points - TODO: This does not scale well
    // (becomes slow as form grows)
    mbElementPaths.forEach(path => {
      const element = mbElements[path] as EhrElement;
      const value = data[path];
      element.data = value;
    });

    // Warnings
    const inDataButNotElements = Object.keys(data).filter(
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
    this.sendWebMessage();
  }

  @state()
  deferredData: Data = {};

  /** Sends message to the top iframe for suggestions and CDS
   * @param {Object} data Payload to send
   */
  sendWebMessage(postSubmit = false, data: any = this.data) {
    if (window.top && !this.nosuggest) {
      const message = {
        type: 'mb-input',
        data: {
          composition: data,
          templateId: this.templateId,
          format: 'MB-FLAT',
          postSubmit,
        },
      };
      window.top.postMessage(message, this.suggestDomain);
    }
  }

  /** The domain to use in postMessage when sending suggestions */
  @property({ type: String, reflect: true }) suggestDomain: string = '*';

  handleInput(e: CustomEvent) {
    e.stopPropagation();
    this.triggerInput();
  }

  triggerInputRequested = false;

  // Batching trigger input for performance reasons - https://medium.com/ing-blog/litelement-a-deepdive-into-batched-updates-b9431509fc4f
  async triggerInput() {
    if (!this.triggerInputRequested) {
      this.triggerInputRequested = true;
      this.triggerInputRequested = await false;
      this._input.emit();
      this.sendWebMessage();
    }
    // TOOD: recalculate mb-count-repeatable.count (currently only doing that when directly setting data on form)
  }

  handleSlotChange() {
    this.triggerInput();
  }

  getTarget(e: CustomEvent) {
    // For getting input from within shadow dom
    return e.composedPath()[0];
  }

  handleChildConnect(e: CustomEvent) {
    const path = e.detail;
    const element = this.getTarget(e) as EhrElement;
    element.mbForm = this;
    element.variant = this.variant;
    this.mbElementSet.add(element);
    // Check if data is present in deferred data
    if (this.deferredData[path] != null) {
      const { [path]: data, ...excluded } = this.deferredData;
      this.mbElements[path].data = data;
      this.deferredData = excluded;
    }
    this.triggerInput();
    // this.updates.push(todo);
  }

  handleRepeatableConnect(e: CustomEvent) {
    const path = e.detail;
    this.repeatables[path] = this.getTarget(e) as Repeatable;
    // Check if data is present in deferred data
    this.triggerInput();
  }

  // Does not work except for mb-repeat due to https://github.com/WICG/webcomponents/issues/678, https://github.com/whatwg/dom/issues/533
  // Handled using Mutation Observer.
  handleChildDisconnect(e: CustomEvent) {
    this.mbElementSet.delete(e.detail.target);
    this.triggerInput();
  }

  handleChildPathChange(_: CustomEvent<{ oldPath: string; newPath: string }>) {
    this.triggerInput();
    // this.updates.push(todo);
  }

  // handleDependency(e: CustomEvent<{ key: string; value: any }>) {
  //   const dependencies: { [key: string]: any } = {
  //     hermes: this.hermes,
  //   };

  //   e.detail.value = dependencies[e.detail.key];
  // }

  addSuggestion(data: any) {
    const suggestElements = Object.keys(data)
      .map(key => ({
        key,
        suggest: this.mbElements[key]?.parentElement as SuggestWrapper,
      }))
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
    this.triggerInput();
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

  @state() intervalId: NodeJS.Timeout;

  handleTodos() {
    this.triggerInput();
    this.updates.forEach(todo => todo.bind(this));
    this.updates = [];
  }

  async connectedCallback() {
    super.connectedCallback();

    // Ensure contexts are registered after form connection
    if (Object.keys(this.deferredData).length > 0) {
      const contextElements = this.dataToContextElements(this.deferredData);
      Object.entries(contextElements).forEach(([path, element]) => {
        console.log('Registering context:', path);
        this.mbElementSet.add(element);
      });
    }

    // this.observer = new MutationObserver((mutationList, _) => {
    //   const deletedPaths = getDeletedPaths(mutationList);
    //   console.log({ deletedPaths });
    //   const { ehrElementsRemoved, repeatablesRemoved } = deletedPaths;
    //   if (repeatablesRemoved.length + ehrElementsRemoved.length > 0) {
    //     const todo = () => {
    //       ehrElementsRemoved.forEach(path => {
    //         const { [path]: _, ...rest } = this.mbElements;
    //         this.mbElements = rest;
    //       });
    //       repeatablesRemoved.forEach(path => {
    //         const { [path]: _, ...rest } = this.repeatables;
    //         this.repeatables = rest;
    //       });
    //     };
    //     this.updates.unshift(todo);
    //   }
    // });

    // this.observer.observe(this, {
    //   childList: true,
    //   subtree: true,
    //   attributes: true,
    // });

    this.addEventListener('mb-connect', this.handleChildConnect);
    this.addEventListener(
      'mb-connect-repeatable',
      this.handleRepeatableConnect
    );
    // Only for mb-repeat. Otherwise using MutationObserver
    this.addEventListener('mb-disconnect', this.handleChildDisconnect);
    // this.addEventListener('mb-dependency', this.handleDependency);
    this.addEventListener('mb-path-change', this.handleChildPathChange);
    this.addEventListener('mb-suggestion', this.handleSuggestion);
    if (window.top && !this.nosuggest) {
      window.addEventListener('message', this.handleParentMessage);
    }
    await this.ensureContextsRegistered();
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
    // this.removeEventListener('mb-dependency', this.handleDependency);
    this.removeEventListener('mb-path-change', this.handleChildPathChange);
    this.removeEventListener('mb-suggestion', this.handleSuggestion);
    if (window.top && !this.nosuggest) {
      window.removeEventListener('message', this.handleParentMessage);
    }
    this.sendWebMessage(false, {});
  }

  render() {
    return html`<slot
      @slotchange=${this.handleSlotChange}
      @mb-input=${this.handleInput}
      @mb-trigger-submit=${this.handleSubmit}
    ></slot>`;
  }
}
