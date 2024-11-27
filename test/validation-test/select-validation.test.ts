import '../../medblocks';
import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import type MbForm from '../../src/medblocks/form/form';
import type MbSelect from '../../src/medblocks/codedtext/select';

describe('select validation test', () => {
  it('empty', async () => {
    const form = await fixture<MbForm>(
      `
        <mb-form>
          <mb-select path="test/1">
            <mb-option value="mother" label="Mother"></mb-option>
            <mb-option value="father" label="Father"></mb-option
          ></mb-select>
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
          <mb-select label="select" path="test/1">
            <mb-option value="mother" label="Mother"></mb-option>
            <mb-option value="father" label="Father"></mb-option
          ></mb-select>
        </mb-form>
      `
    );
    const select = querySelectorDeep('mb-select') as MbSelect;
    select.data = { code: 'mother', value: 'mother', terminology: 'local' };
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
  it('required but empty', async () => {
    const form = await fixture<MbForm>(
      `
        <mb-form>
          <mb-select required path="test/1">
            <mb-option value="mother" label="Mother"></mb-option>
            <mb-option value="father" label="Father"></mb-option
          ></mb-select>
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
          <mb-select required path="test/1">
            <mb-option value="mother" label="Mother"></mb-option>
            <mb-option value="father" label="Father"></mb-option
          ></mb-select>
        </mb-form>
      `
    );
    const select = querySelectorDeep('mb-select') as MbSelect;
    select.data = { code: 'mother', value: 'mother', terminology: 'local' };
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
});
