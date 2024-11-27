import { fixture, expect, oneEvent, elementUpdated } from '@open-wc/testing';
import { querySelectorAllDeep } from 'query-selector-shadow-dom';
import type MbButtons from '../src/medblocks/codedtext/buttons';
import '../src/medblocks/codedtext/buttons';
import '../src/medblocks/codedtext/option';

describe('MbButtons', () => {
  it('emits data on input', async () => {
    const mbbuttons = await fixture<MbButtons>(
      `<mb-buttons label="Hello there">
        <mb-option value="option1" label="Option 1"></mb-option>
        <mb-option value="option2" label="Option 2"></mb-option>
      </mb-buttons>`
    );
    const buttons = querySelectorAllDeep('button');
    expect(buttons).to.length(2);
    setTimeout(() => {
      buttons[0].click();
    }, 0);
    const event1: any = await oneEvent(mbbuttons, 'mb-input', true);
    expect(event1.target.data).to.eql({
      code: 'option1',
      value: 'Option 1',
      terminology: 'local',
    });
    setTimeout(() => {
      buttons[1].click();
    }, 0);
    const event2: any = await oneEvent(mbbuttons, 'mb-input', true);
    expect(event2.target.data).to.eql({
      code: 'option2',
      value: 'Option 2',
      terminology: 'local',
    });
    setTimeout(() => {
      buttons[1].click();
    }, 0);
    const event3: any = await oneEvent(mbbuttons, 'mb-input', true);
    expect(event3.target.data).to.eql(undefined);
  });

  it('emits data with correct terminology', async () => {
    const mbbuttons = await fixture<MbButtons>(
      `<mb-buttons label="Hello there" terminology="SOME-TERMINOLOGY">
        <mb-option value="option1" label="Option 1"></mb-option>
        <mb-option value="option2" label="Option 2"></mb-option>
      </mb-buttons>`
    );
    const buttons = querySelectorAllDeep('button');
    expect(buttons).to.have.length(2);
    setTimeout(() => {
      buttons[0].click();
    }, 0);
    const event1: any = await oneEvent(mbbuttons, 'mb-input', true);
    expect(event1.target.data).to.eql({
      code: 'option1',
      value: 'Option 1',
      terminology: 'SOME-TERMINOLOGY',
    });
    setTimeout(() => {
      buttons[1].click();
    }, 0);
    const event2: any = await oneEvent(mbbuttons, 'mb-input', true);
    expect(event2.target.data).to.eql({
      code: 'option2',
      value: 'Option 2',
      terminology: 'SOME-TERMINOLOGY',
    });
  });
  it('changes input on setting data', async () => {
    const mbbuttons = await fixture<MbButtons>(
      `<mb-buttons label="Hello there" terminology="SOME-TERMINOLOGY">
        <mb-option value="option1" label="Option 1"></mb-option>
        <mb-option value="option2" label="Option 2"></mb-option>
        <mb-option value="option3" label="Option 3"></mb-option>
      </mb-buttons>`
    );
    const buttons = querySelectorAllDeep('button');
    expect(buttons).to.have.lengthOf(3);

    mbbuttons.data = {
      code: 'option2',
      value: 'Option 2',
      terminology: 'SOME-TERMINOLOGY',
    };
    await elementUpdated(mbbuttons);
    expect(buttons[0]).to.not.have.class('button--primary');
    expect(buttons[1]).to.have.class('button--primary');
    expect(buttons[2]).to.not.have.class('button--primary');

    mbbuttons.data = {
      code: 'option3',
      value: 'Option 3',
      terminology: 'SOME-TERMINOLOGY',
    };
    await elementUpdated(mbbuttons);
    expect(buttons[0]).to.not.have.class('button--primary');
    expect(buttons[1]).to.not.have.class('button--primary');
    expect(buttons[2]).to.have.class('button--primary');
  });
});
