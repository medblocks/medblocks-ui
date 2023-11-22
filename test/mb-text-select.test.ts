import {
  html,
  fixture,
  expect,
  oneEvent,
  elementUpdated,
} from '@open-wc/testing';
import {
  querySelectorDeep,
  querySelectorAllDeep,
} from 'query-selector-shadow-dom';
import MbTextSelect from '../src/medblocks/text/text-select';
import '../src/medblocks/text/text-select';
import '../src/medblocks/codedtext/option';
import { SlMenuItem, SlSelect } from '@shoelace-style/shoelace';

describe('MbTextSelect', () => {
  it('emits data on input', async () => {
    const mbtextselect = await fixture<MbTextSelect>(
      html`<mb-text-select label="Hello there">
        <mb-option value="testUnit" label="Test Unit"></mb-option>
        <mb-option value="testUnit1" label="Test Unit1"></mb-option>
      </mb-text-select>`
    );
    const select = querySelectorDeep(
      'sl-select'
    ) as unknown as HTMLSelectElement;
    select.value = 'testUnit';
    select.dispatchEvent(new CustomEvent('sl-change'));
    const event: any = await oneEvent(mbtextselect, 'mb-input');
    expect(event.target.data).to.eql('testUnit');
  });

  it('changes input on setting data', async () => {
    const mbtextselect = await fixture<MbTextSelect>(
      html`<mb-text-select label="Hello there">
        <mb-option value="testUnit" label="Test Unit"></mb-option>
        <mb-option value="testUnit1" label="Test Unit1"></mb-option>
      </mb-text-select>`
    );
    const select = querySelectorDeep(
      'sl-select'
    ) as unknown as HTMLSelectElement;
    mbtextselect.data = 'testUnit';
    await oneEvent(mbtextselect, 'mb-input');
    await elementUpdated(mbtextselect);
    expect(select.value).to.eq('testUnit');
  });

  it('emits data on multiple input', async () => {
    const mbtextselect = await fixture<MbTextSelect>(
      html`<mb-text-select multiple label="Hello there">
        <mb-option value="testUnit" label="Test Unit"></mb-option>
        <mb-option value="testUnit1" label="Test Unit1"></mb-option>
      </mb-text-select>`
    );
    const menuItem = querySelectorAllDeep('sl-menu-item');
    const select = querySelectorDeep('sl-select') as SlSelect;
    menuItem[0].click();
    await oneEvent(mbtextselect, 'mb-input');
    await elementUpdated(mbtextselect);
    expect(mbtextselect.data).to.eql(['testUnit']);
    menuItem[1].click();
    await oneEvent(mbtextselect, 'mb-input');
    await elementUpdated(mbtextselect);
    expect(mbtextselect.data).to.eql(['testUnit', 'testUnit1']);
    expect(select.value).to.eql(['testUnit', 'testUnit1']);
  });
  it('changes input on setting data', async () => {
    const mbtextselect = await fixture<MbTextSelect>(
      html`<mb-text-select multiple label="Hello there">
        <mb-option value="testUnit" label="Test Unit"></mb-option>
        <mb-option value="testUnit1" label="Test Unit1"></mb-option>
      </mb-text-select>`
    );
    const menuItem = querySelectorAllDeep('sl-menu-item') as SlMenuItem[];
    const select = querySelectorDeep('sl-select') as SlSelect;
    mbtextselect.data = ['testUnit'];
    await elementUpdated(mbtextselect);
    expect(menuItem[0].checked).to.eq(true);
    mbtextselect.data = ['testUnit', 'testUnit1'];
    await elementUpdated(mbtextselect);
    expect(menuItem[0].checked).to.eq(true);
    expect(menuItem[1].checked).to.eq(true);
    expect(select.value).to.eql(['testUnit', 'testUnit1']);
  });
});
