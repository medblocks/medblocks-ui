import '../../medblocks';
import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
// import { html } from 'lit-html';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import { SlInput } from '@shoelace-style/shoelace';
import MbForm from '../../src/medblocks/form/form';
// import { TemplateResult } from 'lit-html';


describe('quantity validation test', () => {
  it('empty', async () => {
    const form = await fixture<MbForm>(
      `
        <mb-form>
          <mb-quantity path="test/1">
            <mb-unit unit="cm" label="cm" min="0" max="1000"></mb-unit>
          </mb-quantity>
        </mb-form>
      `
    );
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
  it('data', async () => {
    const form = await fixture<MbForm>(
      `
        <mb-form>
          <mb-quantity path="test/1">
            <mb-unit unit="cm" label="cm" min="0" max="1000"></mb-unit>
          </mb-quantity>
        </mb-form>
      `
    );
    const quantity = querySelectorDeep('mb-quantity') as any;
    quantity.data = { magnitude: '12', unit: 'cm' };
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
  it('required but empty', async () => {
    const form = await fixture<MbForm>(
      `
        <mb-form>
          <mb-quantity required path="test/1">
            <mb-unit unit="cm" label="cm" min="0" max="1000"></mb-unit>
          </mb-quantity>
        </mb-form>
      `
    );
    await elementUpdated(form);
    expect(form.validate()).to.be.false;
  });
  it('required with data', async () => {
    const form = await fixture<MbForm>(
      `
        <mb-form>
          <mb-quantity required path="test/1">
            <mb-unit unit="cm" label="cm" min="0" max="1000"></mb-unit>
          </mb-quantity>
        </mb-form>
      `
    );
    const quantity = querySelectorDeep('mb-quantity') as any;
    quantity.data = { magnitude: '12', unit: 'cm' };
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
  it('data with less than min', async () => {
    const form = await fixture<MbForm>(
      `
        <mb-form>
          <mb-quantity path="test/1" default="cm">
            <mb-unit unit="cm" label="cm" min="20" max="1000"></mb-unit>
          </mb-quantity>
        </mb-form>
      `
    );
    const input = querySelectorDeep('sl-input') as SlInput;
    const select = querySelectorDeep(
      'sl-select'
    ) as unknown as HTMLSelectElement;
    input.value = '2';
    select.value = 'cm';
    input.dispatchEvent(new CustomEvent('sl-input', { bubbles: true }));
    await elementUpdated(form);
    expect(form.validate()).to.be.false;
  });
  it('data with greater than max', async () => {
    const form = await fixture<MbForm>(
      `
        <mb-form>
          <mb-quantity path="test/1">
            <mb-unit unit="cm" label="cm" min="20" max="1000"></mb-unit>
          </mb-quantity>
        </mb-form>
      `
    );
    const input = querySelectorDeep('sl-input') as SlInput;
    const select = querySelectorDeep(
      'sl-select'
    ) as unknown as HTMLSelectElement;
    input.value = '2000';
    select.value = 'cm';
    input.dispatchEvent(new CustomEvent('sl-input', { bubbles: true }));
    await elementUpdated(form);
    expect(form.validate()).to.be.false;
  });
  it('data between min and max', async () => {
    const form = await fixture<MbForm>(
      `
        <mb-form>
          <mb-quantity path="test/1">
            <mb-unit unit="cm" label="cm" min="20" max="1000"></mb-unit>
          </mb-quantity>
        </mb-form>
      `
    );
    const input = querySelectorDeep('sl-input') as SlInput;
    const select = querySelectorDeep(
      'sl-select'
    ) as unknown as HTMLSelectElement;
    input.value = '200';
    select.value = 'cm';
    input.dispatchEvent(new CustomEvent('sl-input', { bubbles: true }));
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
  it('data with no min and max', async () => {
    const form = await fixture<MbForm>(
      `
        <mb-form>
          <mb-quantity path="test/1">
            <mb-unit unit="cm" label="cm"></mb-unit>
          </mb-quantity>
        </mb-form>
      `
    );
    const input = querySelectorDeep('sl-input') as SlInput;
    const select = querySelectorDeep(
      'sl-select'
    ) as unknown as HTMLSelectElement;
    input.value = '200';
    select.value = 'cm';
    input.dispatchEvent(new CustomEvent('sl-input', { bubbles: true }));
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
});
