import '../../medblocks';
import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import type MbForm from '../../src/medblocks/form/form';

describe('duration validation test', () => {
  it('empty', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-duration year path="test/1"></mb-duration>
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
                <mb-duration year path="test/1"></mb-duration>
            </mb-form>
            `
    );
    const duration = querySelectorDeep('mb-duration') as any;
    duration.data = 'P2Y3MT2H';
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
  it('required but empty', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-duration year required path="test/1"></mb-duration>
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
                <mb-duration year required path="test/1"></mb-duration>
            </mb-form>
            `
    );
    const duration = querySelectorDeep('mb-duration') as any;
    duration.data = 'P1Y';
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });

  it('data with 0 should be invalid', async () => {
    const form = await fixture<MbForm>(
      `
            <mb-form>
                <mb-duration year required path="test/1"></mb-duration>
            </mb-form>
            `
    );
    const duration = querySelectorDeep('mb-duration') as any;
    duration.data = 'P0Y';
    await elementUpdated(form);
    expect(form.validate()).to.be.false;
  });
});
