import '../../medblocks';
import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import type MbForm from '../../src/medblocks/form/form';

describe('search validation test', () => {
  it('empty', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-search path="test/1"></mb-search>
            </mb-form>
            `
    );
    const search = querySelectorDeep('mb-search') as any;
    search.searchTerm = '';
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
  it('data', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-search path="test/1"></mb-search>
            </mb-form>
            `
    );
    const search = querySelectorDeep('mb-search') as any;
    search.data = 'testUnit';
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
  it('no searchTerm', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-search path="test/1"></mb-search>
            </mb-form>
            `
    );
    const search = querySelectorDeep('mb-search') as any;
    search.searchTerm = '';
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
  it('required but empty', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-search required path="test/1"></mb-search>
            </mb-form>
            `
    );
    await elementUpdated(form);
    expect(form.validate()).to.be.false;
  });
  it('required with no searchTerm', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-search required path="test/1"></mb-search>
            </mb-form>
            `
    );
    const search = querySelectorDeep('mb-search') as any;
    search.searchTerm = '';
    await elementUpdated(form);
    expect(form.validate()).to.be.false;
  });
  it('required with searcTerm and no data', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-search required path="test/1"></mb-search>
            </mb-form>
            `
    );
    const search = querySelectorDeep('mb-search') as any;
    search.searchTerm = 'testUnit';
    await elementUpdated(form);
    expect(form.validate()).to.be.false;
  });
  it('required with no searcTerm and no data', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-search required path="test/1"></mb-search>
            </mb-form>
            `
    );
    const search = querySelectorDeep('mb-search') as any;
    search.searchTerm = '';
    await elementUpdated(form);
    expect(form.validate()).to.be.false;
  });
  it('required with data', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-search required path="test/1"></mb-search>
            </mb-form>
            `
    );
    const search = querySelectorDeep('mb-search') as any;
    search.data = 'testUnit';
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
});
