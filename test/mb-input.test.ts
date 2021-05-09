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

  it('emits data on settind data', async ()=>{
    mbinput.data = 'Hello there'
    const event: any = await oneEvent(mbinput, 'mb-input');
    expect(event.target.data).to.eq('Hello there')
  })

  it('changes input on setting data', async () => {
    mbinput.data = 'To be changed';
    const event = (await oneEvent(mbinput, 'mb-input')) as any;
    expect(event.target.data).to.eq('To be changed');
    await elementUpdated(mbinput);
    expect(input.value).to.eq('To be changed');
  });
});
