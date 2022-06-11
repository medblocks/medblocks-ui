import { property } from 'lit/decorators.js';
import { event, EventEmitter } from '../../internal/decorators';
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
  /**Data of CodedText */
  @property({ type: Object }) data: CodedText | undefined | any;
  /**Terminology of preference. Eg: SNOMED-CT, LOINC, local (for openEHR) */
  @property({ type: String }) terminology: string = 'local';
  @property({ type: String }) value: string = '';
  @event('mb-input') _mbInput: EventEmitter<CodedText>;
}
