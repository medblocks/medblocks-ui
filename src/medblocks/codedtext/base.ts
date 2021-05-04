import { property } from 'lit-element';
import { event, EventEmitter } from '../../internal/decorators';
import EhrElement from '../base/base';

interface CodedText {
  code: string;
  value: string;
  terminology: string;
  _type: () => 'codedtext';
}
/**
 * An Abstract class to extend CodedText elements
 * @fires mb-input - Dispatched when the input changes
 */
export class CodedTextElement extends EhrElement {
  /**Data of CodedText */
  @property({ type: Object }) data: CodedText | undefined;
  /**Terminology of preference. Eg: SNOMED-CT, LOINC, local (for openEHR) */
  @property({ type: String }) terminology: string = 'local';
  @event('mb-input') input: EventEmitter<CodedText>;
}
