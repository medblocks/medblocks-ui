import '../../medblocks';
import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import type MbForm from '../../src/medblocks/form/form';

describe('percent validation test', () => {
  it('empty', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-percent path="test/1"></mb-percent>
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
                <mb-percent path="test/1"></mb-percent>
            </mb-form>
            `
    );
    const percent = querySelectorDeep('mb-percent') as any;
    percent.data = { numerator: 12, denominator: 100, type: 2 };
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
  it('required but empty', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-percent required path="test/1"></mb-percent>
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
                <mb-percent required path="test/1"></mb-percent>
            </mb-form>
            `
    );
    const percent = querySelectorDeep('mb-percent') as any;
    percent.data = { numerator: 123, denominator: 100, type: 2 };
    await elementUpdated(form);
    const validation = form.validate();
    expect(validation).to.be.false;
  });
});
