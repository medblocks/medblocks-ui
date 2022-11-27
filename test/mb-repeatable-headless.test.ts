import { expect } from '@open-wc/testing';
import { elementUpdated, fixture, oneEvent } from '@open-wc/testing-helpers';
import { html } from 'lit-html';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import MbForm from '../src/medblocks/form/form';
import '../src/medblocks/form/form';
import '../src/medblocks/text/input';
import MbRepeatable from '../src/medblocks/repeat/repeatableHeadless';
import '../src/medblocks/repeat/repeatableHeadless';

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

    setTimeout(() =>
      form.import({
        'chief_complaints:0': 'Body ache',
        'chief_complaints:1': 'Cold',
        'chief_complaints:2': 'Fever',
      })
    );
    const event: any = await oneEvent(repeatable, 'mb-count');
    expect(event.target.count).to.equal(3);
    expect(form.data).to.eql({ 'chief_complaints:0': 'Body ache' });
  });

  it.skip('performance tests', async () => {
    const repeatableCount = 50;
    const inputCountPerRepeatable = 3;
    
    
    const repeatExtra = 5;
    const form = await fixture<MbForm>(
      html`
        <mb-form>
          ${[...Array(repeatableCount)].map((_, i) => {
            return [...Array(inputCountPerRepeatable)].map(
              (_, j) => html`
                <mb-input
                  path="long_repeatable/path/inside/composition${i}:${j}"
                ></mb-input>
                <mb-input path="unrelated1/composition/${i}:${j}"></mb-input>
                <mb-input path="unrelated2/composition/${i}:${j}"></mb-input>
                <mb-input path="unrelated3/composition/${i}:${j}"></mb-input>
                <!-- <mb-input path="unrelated4/composition/${i}:${j}"></mb-input>
                <mb-input path="unrelated5/composition/${i}:${j}"></mb-input>
                <mb-input path="unrelated6/composition/${i}:${j}"></mb-input>
                <mb-input path="unrelated7/composition/${i}:${j}"></mb-input> -->

              `
            );
          })}
          ${[...Array(repeatableCount)].map(
            (_, i) => html`<mb-repeatable-headless
              count="0"
              path="long_repeatable/path/inside/composition${i}"
            ></mb-repeatable-headless>`
          )}

          <mb-submit id="submit">
            <sl-button>Submit</sl-button>
          </mb-submit>
        </mb-form>
      `
    );
    await elementUpdated(form);
    console.log({ megaForm: form });
    // const repeatable = querySelectorDeep(
    //   'mb-repeatable-headless'
    // ) as MbRepeatable;
    // const event: any = await oneEvent(repeatable, 'mb-count');
    // expect(event.target.count).to.equal(0);
    const dataToSet: Record<string, string> = {};
    const dataToEqual: Record<string, string> = {};
    [...Array(repeatableCount + repeatExtra)].forEach((_, i) => {
      return [...Array(inputCountPerRepeatable)].forEach((_, j) => {
        const key = `long_repeatable/path/inside/composition${i}:${j}`;
        const value = `Some random data ${i}, ${j}`;
        dataToSet[key] = value;
        if (i <= repeatExtra - 1) {
          dataToEqual[key] = value;
        }
      });
    });
    setTimeout(() => {
      // start timer
      console.log('Starting to set data');
      const start = performance.now();
      form.import(dataToSet);
      const end = performance.now();
      console.log('Time taken for import:', end - start, 'ms');
      // end timer
    });

    expect(form.data).to.eql({ 'chief_complaints:0': 'Body ache' });
  });
});
