import { property } from 'lit-element';
import { event, EventEmitter } from '../../internal/decorators';
import EhrElement from '../base/base';

interface CodedText {
  code: string;
  value: string;
  terminology: string;
  _type: () => 'codedtext';
}

export class CodedTextElement extends EhrElement {
  @property({ type: Object }) data: CodedText | undefined;
  @property({ type: String }) terminology: string = 'local';
  @event('mb-input') input: EventEmitter<CodedText>;
}
