import '../../medblocks';
import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import type MbForm from '../../src/medblocks/form/form';

describe('date validation test', () => {
  it('empty', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-date path="test/1"></mb-date>
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
                <mb-date path="test/1"></mb-date>
            </mb-form>
            `
    );
    const date = querySelectorDeep('mb-date') as any;
    date.data = '2021-10-01';
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
  it('required but empty', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-date required path="test/1"></mb-date>
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
                <mb-date required path="test/1"></mb-date>
            </mb-form>
            `
    );
    const date = querySelectorDeep('mb-date') as any;
    date.data = '2021-10-01';
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
});
