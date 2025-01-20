import { css, customElement, html, LitElement, property } from 'lit-element';
import {
  bindRepeatables,
  createAutoFormByTemplateId,
  type MBComposition,
} from './autoform-utils';
import { watch } from '../../internal/decorators';
import type MedblockForm from './form';
import type { SearchFunction } from '../codedtext/searchFunctions';

@customElement('mb-auto-form')
export class MedblocksAutoForm extends LitElement {
  // Styling for the component
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    #autoForm {
      padding: 0.5rem;
    }
    .flex {
      display: flex;
    }
    .justify-end {
      justify-content: flex-end;
    }
    .hidden {
      display: none;
    }
    .addButton {
      display: flex;
      margin: 8px;
    }
    .deleteButton {
      margin: 8px 8px 8px 0px;
    }
    .leaf-child {
      padding: 0px 16px 8px;
    }
    .heading {
      font-family: system-ui;
      margin: 8px;
      border-radius: 8px;
      border: 2px solid #e2e8f0;
    }
    margin-bottom-4 : {
      margin-bottom: 16px;
    }
    .p-depth {
      margin: -2px;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      padding: 8px 12px;
      margin-bottom: 8px;
      color: white;
    }
    .bg-slate-700 {
      background-color: #334155;
    }
    .bg-slate-600 {
      background-color: #475569;
    }
    .bg-slate-500 {
      background-color: #64748b;
    }
    .bg-slate-400 {
      background-color: #94a3b8;
    }
  `;

  // Properties that can be set from outside
  @property({ type: String, reflect: true }) templateId = '';

  @property({ type: Object }) ctx = {};

  @property({ type: Object }) config = {};

  @property({ type: Object }) webTemplate = undefined;

  @property({ type: String, reflect: true }) variant = 'small';

  @property({ type: Boolean, reflect: true }) addContext = false;

  @property({ type: Function })
  handleSearch: SearchFunction;


  // Input handler method (placeholder for custom input handling)
  handleInput(event: CustomEvent) {
    this.dispatchEvent(
      new CustomEvent('mb-input', {
        detail: event.detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  // Lifecycle method to handle component first update
  firstUpdated() {
    this.generateAutoForm();
  }

  @watch('webTemplate')
  generateAutoForm() {
    if (this.webTemplate) {
      try {
        createAutoFormByTemplateId(this.config, this.webTemplate,this.addContext);
      } catch (error) {
        console.error('Error generating auto form:', error);
      }
    }
  }

  import(composition: MBComposition) {
    this.bindValue(composition);
  }

  clear() {
    this.bindValue({});
  }

  bindValue(composition: MBComposition) {
    const mbForm = this.renderRoot.querySelector('mb-form') as MedblockForm;
    mbForm.data = {};
    const container = mbForm.querySelector('#autoForm') as Element;
    const formNode = container.children[1];
    const mbRepeatables = [
      ...formNode.querySelectorAll('mb-repeatable-headless'),
    ];
    bindRepeatables(
      mbRepeatables,
      mbRepeatables,
      formNode,
      composition,
      this.config
    );
    setTimeout(() => {
      mbForm.import(composition);
    }, 10);
  }

  export() {
    return this.submit();
  }

  submit() {
    const mbForm = this.renderRoot.querySelector('mb-form') as MedblockForm;
    if (mbForm.validate()) {
      mbForm.insertContext();
      return mbForm.serialize();
    }
  }

  // Lifecycle method to render the component
  render() {
    return html`
      <mb-form
        variant=${this.variant}
        templateId=${this.templateId}
        .ctx=${this.ctx}
        overwritectx
        @mb-input=${this.handleInput}
        .handleSearch=${this.handleSearch}
      >
        <div id="autoForm"></div>
      </mb-form>
    `;
  }
}
