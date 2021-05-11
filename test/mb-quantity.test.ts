import {
  html,
  fixture,
  expect,
  oneEvent,
  elementUpdated
} from '@open-wc/testing';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import MbQuantity from '../src/medblocks/quantity/quantity';
import '../src/medblocks/quantity/quantity'

describe('MbQuantity', () => {
  let mbquantity: MbQuantity;
  let input: HTMLInputElement;
  let select: HTMLSelectElement;

  beforeEach(async () => {
    mbquantity = await fixture<MbQuantity>(
      html`<mb-quantity label="Hello there">
      <mb-unit unit="testUnit" label="Test Unit"></mb-unit>
      </mb-quantity>`
    );
    input = querySelectorDeep('input') as HTMLInputElement
    select = querySelectorDeep('sl-select') as HTMLSelectElement
  });
  it('emits data on input', async () => {
    input.value = '234';
    input.dispatchEvent(new Event('input'));
    select.value = 'testUnit'
    select.dispatchEvent(new CustomEvent('sl-change'))
    const event: any = await oneEvent(mbquantity, 'mb-input');
    expect(event.target.data).to.eql({magnitude: 234, unit: 'testUnit'});
  });

  it('changes input on setting data', async () => {
    mbquantity.data = {magnitude: 334, unit: 'testUnit'}
    await oneEvent(mbquantity, 'mb-input')
    await elementUpdated(mbquantity);
    expect(input.value).to.eq('334');
    expect(select.value).to.eq('testUnit')
  });
});
