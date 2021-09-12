import {
  html,
  fixture,
  expect,
  oneEvent,
  elementUpdated,
} from '@open-wc/testing';
import {
  querySelectorAllDeep,
  querySelectorDeep,
} from 'query-selector-shadow-dom';
import MbInputMultiple from '../src/medblocks/text/input-multiple';
import '../src/medblocks/text/input-multiple';
import { SlInput, SlTag } from '@shoelace-style/shoelace';

describe('MbInputMultiple', async () => {
  it('emits data on input', async () => {
    let mbinputmultiple = await fixture<MbInputMultiple>(
      html`<mb-input-multiple> </mb-input-multiple>`
    );
    let input = querySelectorDeep('input') as SlInput;
    input.value = 'testUnit1';
    input.dispatchEvent(new Event('input'))
    mbinputmultiple.dispatchEvent(
      new KeyboardEvent('keypress', {
        'key': 'Enter',
      })
    );
    await oneEvent(mbinputmultiple, 'mb-input');
    await elementUpdated(mbinputmultiple);
    expect(mbinputmultiple.data).to.eql(['testUnit1']);
    input.value = 'testUnit2';
    input.dispatchEvent(new Event('input'))
    mbinputmultiple.dispatchEvent(
      new KeyboardEvent('keypress', {
        'key': 'Enter',
      })
    );
    await oneEvent(mbinputmultiple, 'mb-input');
    await elementUpdated(mbinputmultiple);
    expect(mbinputmultiple.data).to.eql(['testUnit1','testUnit2']);
  });

  it('changes input on setting data', async () => {
    let mbinputmultiple = await fixture<MbInputMultiple>(
      html`<mb-input-multiple> </mb-input-multiple>`
    );
    let input = querySelectorDeep('input') as HTMLInputElement;
    mbinputmultiple.data = ['testUnit', 'testUnit1'];
    await oneEvent(mbinputmultiple, 'mb-input');
    await elementUpdated(mbinputmultiple);
    let tag = querySelectorAllDeep('sl-tag') as SlTag[];
    expect(input.value).to.eql('');
    expect(tag[0].innerText).to.eql('testUnit');
  });
  
});
