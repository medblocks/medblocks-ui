import {
  html,
  fixture,
  expect,
  oneEvent,
  elementUpdated
} from '@open-wc/testing';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import MbSelect from '../src/medblocks/codedtext/select';
import '../src/medblocks/codedtext/select'
import '../src/medblocks/codedtext/option'

describe('MbSelect', () => {

  it('emits data on input', async () => {
    const mbselect = await fixture<MbSelect>(
      html`<mb-select label="Hello there">
        <mb-option value="testUnit" label="Test Unit"></mb-option>
      </mb-select>`
    );
    const select = querySelectorDeep('sl-select') as HTMLSelectElement
    select.value = 'testUnit';
    select.dispatchEvent(new CustomEvent('sl-change'));
    const event: any = await oneEvent(mbselect, 'mb-input');
    expect(event.target.data).to.eql({code: 'testUnit', value: 'Test Unit', terminology: 'local'});
  });

  it('emits data with correct terminology', async ()=>{

    const mbselect = await fixture<MbSelect>(
      html`<mb-select label="Hello there" terminology="SOME-TERMINOLOGY">
        <mb-option value="testUnit" label="Test Unit"></mb-option>
      </mb-select>`
    );
    const select = querySelectorDeep('sl-select') as HTMLSelectElement
    select.value = 'testUnit';
    select.dispatchEvent(new CustomEvent('sl-change'));
    const event: any = await oneEvent(mbselect, 'mb-input');
    expect(event.target.data).to.eql({code: 'testUnit', value: 'Test Unit', terminology: 'SOME-TERMINOLOGY'});
  })
  it('changes input on setting data', async () => {
    const mbselect = await fixture<MbSelect>(
      html`<mb-select label="Hello there" terminology="SOME-TERMINOLOGY">
        <mb-option value="testUnit" label="Test Unit"></mb-option>
      </mb-select>`
    );
    const select = querySelectorDeep('sl-select') as HTMLSelectElement
    mbselect.data = {code: 'testUnit', value: 'Test Unit', terminology: 'SOME-TERMINOLOGY'}
    await oneEvent(mbselect, 'mb-input')
    await elementUpdated(mbselect);
    expect(select.value).to.eq('testUnit');
  });
});
