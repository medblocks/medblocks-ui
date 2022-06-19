import {
  html,
  fixture,
  expect,
  oneEvent,
  elementUpdated,
} from '@open-wc/testing';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import MbQuantity from '../src/medblocks/quantity/quantity';
import '../src/medblocks/quantity/quantity';
import { SlInput } from '@shoelace-style/shoelace';

describe('MbQuantity', () => {
  it('emits data on input', async () => {
    const mbquantity = await fixture<MbQuantity>(
      html` <mb-quantity path="test/1">
        <mb-unit unit="cm" label="cm" min="0" max="1000"></mb-unit>
      </mb-quantity>`
    );
    const input = querySelectorDeep('sl-input') as SlInput;
    const select = querySelectorDeep('sl-select') as HTMLSelectElement;
    input.value = '234';
    select.value = 'cm';
    input.dispatchEvent(new CustomEvent('sl-input', { bubbles: true }));
    const event: any = await oneEvent(mbquantity, 'mb-input');
    // console.log("quantity",event.target.data)
    expect(event.target.data).to.eql({ unit: 'cm', magnitude: 234 });

    input.value = '';
    input.dispatchEvent(new CustomEvent('sl-input', { bubbles: true }));
    const event2: any = await oneEvent(mbquantity, 'mb-input');
    expect(event2.target.data).to.eql(undefined);
  });

  it('changes input on setting data', async () => {
    const mbquantity = await fixture<MbQuantity>(
      html` <mb-quantity path="test/1">
        <mb-unit unit="cm" label="cm" min="0" max="1000"></mb-unit>
      </mb-quantity>`
    );
    const input = querySelectorDeep('input') as HTMLInputElement;
    const select = querySelectorDeep('sl-select') as HTMLSelectElement;
    mbquantity.data = { magnitude: 334, unit: 'cm' };
    await oneEvent(mbquantity, 'mb-input');
    await elementUpdated(mbquantity);
    // console.log(input)
    // console.log("quantity",select)
    expect(input.value).to.eq('334');
    expect(select.value).to.eq('cm');
  });
});
