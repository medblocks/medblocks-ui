import '../../medblocks';
import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import MbForm from '../../src/medblocks/form/form';

describe('search validation test', () => {
  it('with empty', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-search-multiple path="test/1"></mb-search-multiple>
            </mb-form>
            `
    );
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
  it('with data', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-search-multiple path="test/1"></mb-search-multiple>
            </mb-form>
            `
    );
    const search = querySelectorDeep('mb-search-multiple') as any;
    search.data = ['testUnit'];
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
  it('required but empty', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-search-multiple required path="test/1"></mb-search-multiple>
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
                <mb-search-multiple required path="test/1"></mb-search-multiple>
            </mb-form>
            `
    );
    const search = querySelectorDeep('mb-search-multiple') as any;
    search.data = ['testUnit'];
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
});
