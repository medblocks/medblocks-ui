import '../../medblocks';
import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { html } from 'lit-html';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import MbForm from '../../src/medblocks/form/form';

describe('text-select validation test', () => {
  it('empty', async () => {
    const form = await fixture<MbForm>(
      html`
        <mb-form>
          <mb-text-select path="test/1">
            <mb-option value="mother" label="Mother"></mb-option>
            <mb-option value="father" label="Father"></mb-option
          ></mb-text-select>
        </mb-form>
      `
    );
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
  it('data', async () => {
    const form = await fixture<MbForm>(
      html`
        <mb-form>
          <mb-text-select path="test/1">
            <mb-option value="mother" label="Mother"></mb-option>
            <mb-option value="father" label="Father"></mb-option
          ></mb-text-select>
        </mb-form>
      `
    );
    const input = querySelectorDeep('mb-text-select') as any;
    input.data = 'testUnit';
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
  it('required but empty', async () => {
    const form = await fixture<MbForm>(
      html`
        <mb-form>
          <mb-text-select required path="test/1">
            <mb-option value="mother" label="Mother"></mb-option>
            <mb-option value="father" label="Father"></mb-option
          ></mb-text-select>
        </mb-form>
      `
    );
    await elementUpdated(form);
    expect(form.validate()).to.be.false;
  });
  it('required with data', async () => {
    const form = await fixture<MbForm>(
      html`
        <mb-form>
          <mb-text-select required path="test/1">
            <mb-option value="mother" label="Mother"></mb-option>
            <mb-option value="father" label="Father"></mb-option
          ></mb-text-select>
        </mb-form>
      `
    );
    const input = querySelectorDeep('mb-text-select') as any;
    input.data = 'testUnit';
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
});
