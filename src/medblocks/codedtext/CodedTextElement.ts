import { property } from 'lit-element';
import { event, type EventEmitter } from '../../internal/decorators';
import EhrElement from '../EhrElement';

export interface CodedText {
  code: string;
  value: string;
  ordinal?: number;
  terminology: string;
}
/**
 * @inheritdoc
 * An Abstract class to extend CodedText elements
 */
export class CodedTextElement extends EhrElement {
  getDisplay(value: CodedText | string | undefined) {
    if (typeof value === 'string') {
      return value;
    }
    if (value?.value) {
      return value.value;
    }
    return '';
  }

  /** Data of CodedText */
  @property({ type: Object }) data: CodedText | string | undefined | any;

  /** Terminology of preference. Eg: SNOMED-CT, LOINC, local (for openEHR) */
  @property({ type: String }) terminology = 'local';

  @property({ type: String }) value = '';

  @event('mb-input') _mbInput: EventEmitter<CodedText>;
}
