import {
  html,
  fixture,
  expect,
  oneEvent,
  elementUpdated,
} from '@open-wc/testing';
import MbInput from '../src/medblocks/text/input';
import '../src/medblocks/text/input';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';

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
  // it('increases the counter on button click', async () => {
  //   const el = await fixture<ExampleComp>(html`<example-comp></example-comp>`);
  //   el.shadowRoot!.querySelector('button')!.click();

  //   expect(el.counter).to.equal(6);
  // });

  // it('can override the title via attribute', async () => {
  //   const el = await fixture<ExampleComp>(
  //     html`<example-comp title="attribute title"></example-comp>`
  //   );

  //   expect(el.title).to.equal('attribute title');
  // });

  // it('passes the a11y audit', async () => {
  //   const el = await fixture<ExampleComp>(html`<example-comp></example-comp>`);

  //   await expect(el).shadowDom.to.be.accessible();
  // });
});
