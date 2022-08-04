import { expect } from '@open-wc/testing';
import { elementUpdated, fixture, oneEvent } from '@open-wc/testing-helpers';
import { html } from 'lit-html';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import MbForm from '../src/medblocks/form/form';
import '../src/medblocks/form/form';
import '../src/medblocks/text/input';
import MbRepeatable from '../src/medblocks/repeat/repeatableHeadless';
import '../src/medblocks/repeat/repeatableHeadless'

describe('mb-repeatale-headless', () => {
  it('getting the count of repeatable path', async () => {
    const form = await fixture<MbForm>(
      html`
        <mb-form>
          <mb-input
            path="chief_complaints:0"
            label="Chief complaints"
          ></mb-input>
          <mb-repeatable-headless
            count="0"
            path="chief_complaints"
          ></mb-repeatable-headless>
          <mb-submit id="submit">
            <sl-button>Submit</sl-button>
          </mb-submit>
        </mb-form>
      `
    );

    await elementUpdated(form);
    const repeatable = querySelectorDeep(
      'mb-repeatable-headless'
    ) as MbRepeatable;
    expect(repeatable.count).to.equal(0);

    setTimeout(() => form.import({
        "chief_complaints:0":"Body ache",
        "chief_complaints:1":"Cold",
        "chief_complaints:2":"Fever"
    }));
    const event: any = await oneEvent(repeatable, 'mb-count');
    expect(event.target.count).to.equal(3);
    expect(form.data).to.eql({'chief_complaints:0': 'Body ache'})
  });
});
