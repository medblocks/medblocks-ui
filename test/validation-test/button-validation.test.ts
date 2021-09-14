import '../../medblocks';
import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { html } from 'lit-html';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import MbForm from '../../src/medblocks/form/form';

describe('button validation test', () => {
  it('empty', async () => {
    const form = await fixture<MbForm>(
      html`
        <mb-form>
          <mb-buttons
            id="btn"
            type="code"
            label="Gender"
            path="gender"
          >
            <mb-option value="male" label="Male"></mb-option>
            <mb-option value="female" label="Female"></mb-option>
            <mb-option value="other" label="Other"></mb-option>
          </mb-buttons>
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
          <mb-buttons
            id="btn"
            type="code"
            label="Gender"
            path="gender"
          >
            <mb-option value="male" label="Male"></mb-option>
            <mb-option value="female" label="Female"></mb-option>
            <mb-option value="other" label="Other"></mb-option>
          </mb-buttons>
        </mb-form>
      `
    );
    const button = querySelectorDeep('mb-buttons') as any;
    button.data = {code: 'male', value: 'Male', terminology: 'local'};
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
  it('required but empty', async () => {
    const form = await fixture<MbForm>(
      html`
        <mb-form>
          <mb-buttons
            required
            id="btn"
            type="code"
            label="Gender"
            path="gender"
          >
            <mb-option value="male" label="Male"></mb-option>
            <mb-option value="female" label="Female"></mb-option>
            <mb-option value="other" label="Other"></mb-option>
          </mb-buttons>
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
          <mb-buttons
            required
            id="btn"
            type="code"
            label="Gender"
            path="gender"
          >
            <mb-option value="male" label="Male"></mb-option>
            <mb-option value="female" label="Female"></mb-option>
            <mb-option value="other" label="Other"></mb-option>
          </mb-buttons>
        </mb-form>
      `
    );
    const button = querySelectorDeep('mb-buttons') as any;
    button.data = {code: 'male', value: 'Male', terminology: 'local'};
    await elementUpdated(form);
    expect(form.validate()).to.be.true;
  });
});
