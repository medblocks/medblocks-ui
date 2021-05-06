import {
  html,
  fixture,
  expect,
  oneEvent,
  elementUpdated,
} from '@open-wc/testing';
import MbInput from '../src/medblocks/text/input';
import '../src/medblocks/text/input';
import { SlInput } from '@shoelace-style/shoelace';

describe('MbInput', () => {
  let mbinput: MbInput;
  let slinput: SlInput;
  let input: HTMLInputElement;

  beforeEach(async () => {
    mbinput = await fixture<MbInput>(
      html`<mb-input label="Hello there"></mb-input>`
    );
    slinput = mbinput.shadowRoot?.querySelector('sl-input') as SlInput;
    input = slinput.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement
  });
  it('emits data on input', async () => {
    input.value = 'Test input';
    input.dispatchEvent(new Event('input'));
    const event = (await oneEvent(mbinput, 'mb-input')) as any;
    expect(event.target.data).to.eq('Test input');
  });

  it('changes input on setting data', async () => {
    mbinput.data = 'To be changed';
    const event = (await oneEvent(mbinput, 'mb-input')) as any;
    expect(event.target.data).to.eq('To be changed');
    await elementUpdated(mbinput);
    expect(input.value).to.eq('To be changed');
  });
});
