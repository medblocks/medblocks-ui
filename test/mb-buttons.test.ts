import {
  html,
  fixture,
  expect,
  oneEvent,
  elementUpdated
} from '@open-wc/testing';
import { querySelectorAllDeep } from 'query-selector-shadow-dom';
import MbButtons from '../src/medblocks/codedtext/buttons';
import '../src/medblocks/codedtext/buttons'
import '../src/medblocks/codedtext/option'

describe('MbButtons', () => {

  it('emits data on input', async () => {
    const mbbuttons = await fixture<MbButtons>(
      html`<mb-buttons label="Hello there">
        <mb-option value="option1" label="Option 1"></mb-unit>
        <mb-option value="option2" label="Option 2"></mb-unit>
      </mb-buttons>`
    );
    const buttons = querySelectorAllDeep('button')
    expect(buttons).to.length(2)
    buttons[0].click()
    const event1: any = await oneEvent(mbbuttons, 'mb-input');
    expect(event1.target.data).to.eql({code: 'option1', value: 'Option 1', terminology: 'local'});
    buttons[1].click()
    const event2: any = await oneEvent(mbbuttons, 'mb-input');
    expect(event2.target.data).to.eql({code: 'option2', value: 'Option 2', terminology: 'local'});
  });

  it('emits data with correct terminology', async ()=>{
    const mbbuttons = await fixture<MbButtons>(
      html`<mb-buttons label="Hello there" terminology="SOME-TERMINOLOGY">
      <mb-option value="option1" label="Option 1"></mb-unit>
      <mb-option value="option2" label="Option 2"></mb-unit>
    </mb-buttons>`
    );
    const buttons = querySelectorAllDeep('button')
    expect(buttons).to.have.length(2)
    buttons[0].click()
    const event1: any = await oneEvent(mbbuttons, 'mb-input');
    expect(event1.target.data).to.eql({code: 'option1', value: 'Option 1', terminology: 'SOME-TERMINOLOGY'});
    buttons[1].click()
    const event2: any = await oneEvent(mbbuttons, 'mb-input');
    expect(event2.target.data).to.eql({code: 'option2', value: 'Option 2', terminology: 'SOME-TERMINOLOGY'});
  })
  it('changes input on setting data', async () => {
    const mbbuttons = await fixture<MbButtons>(
      html`<mb-buttons label="Hello there" terminology="SOME-TERMINOLOGY">
      <mb-option value="option1" label="Option 1"></mb-unit>
      <mb-option value="option2" label="Option 2"></mb-unit>
      <mb-option value="option3" label="Option 3"></mb-unit>
    </mb-buttons>`
    );
    const buttons = querySelectorAllDeep('button')
    mbbuttons.data = {code: 'option2', value: 'Option 2', terminology: 'SOME-TERMINOLOGY'}
    await oneEvent(mbbuttons, 'mb-input')
    await elementUpdated(mbbuttons);
    expect(buttons[0]).to.not.have.class('button--primary')
    expect(buttons[1]).to.have.class('button--primary')
    expect(buttons[2]).to.not.have.class('button--primary')

    mbbuttons.data = {code: 'option3', value: 'Option 3', terminology: 'SOME-TERMINOLOGY'}
    await oneEvent(mbbuttons, 'mb-input')
    await elementUpdated(mbbuttons);
    expect(buttons[0]).to.not.have.class('button--primary')
    expect(buttons[1]).to.not.have.class('button--primary')
    expect(buttons[2]).to.have.class('button--primary')
  });
});
