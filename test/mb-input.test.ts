import {
  html,
  fixture,
  expect,
  oneEvent,
  elementUpdated,
} from '@open-wc/testing';
import MbInput from '../src/medblocks/text/input';
import '../src/medblocks/text/input';
import { querySelectorDeep } from 'query-selector-shadow-dom';

describe('MbInput', () => {
  let mbinput: MbInput;
  let input: HTMLInputElement;

  beforeEach(async () => {
    mbinput = await fixture<MbInput>(
      html`<mb-input label="Hello there"></mb-input>`
    );
    input = querySelectorDeep('input') as HTMLInputElement
  });
  it('emits data on input', async () => {
    input.value = 'Test input';
    input.dispatchEvent(new Event('input'));
    const event: any = await oneEvent(mbinput, 'mb-input');
    expect(event.target.data).to.eq('Test input');
  });

  it('changes input on setting data', async () => {
    mbinput.data = 'To be changed';
    await oneEvent(mbinput, 'mb-input')
    await elementUpdated(mbinput);
    expect(input.value).to.eq('To be changed');
  });
});
