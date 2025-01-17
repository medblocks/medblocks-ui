import { expect } from '@open-wc/testing';
import { elementUpdated, fixture, oneEvent } from '@open-wc/testing-helpers';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import type MbForm from '../src/medblocks/form/form';
import '../src/medblocks/form/form';
import '../src/medblocks/text/input';
import type MbRepeatable from '../src/medblocks/repeat/repeatableHeadless';
import '../src/medblocks/repeat/repeatableHeadless';

describe('mb-repeatale-headless', () => {
  it('getting the count of repeatable path', async () => {
    const form = await fixture<MbForm>(
      `
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
    const event: any = await oneEvent(repeatable, 'mb-count', true);
    expect(event.target.count).to.equal(3);
    expect(form.data).to.eql({ 'chief_complaints:0': 'Body ache' });
  });

  it('should get correct count', async () => {
    const form = await fixture<MbForm>(
      `
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
    const data = {
      'clinikk.prescription_pad.v2/medication_order/order:0/medication_item': {
        value: 'Paracetamol 500mg tablet',
        code: '322236009',
        terminology: 'Snomed CT',
      },
      'clinikk.prescription_pad.v2/medication_order/order:1/medication_item': {
        value: 'Paracetamol 2 500mg tablet',
        code: '322236009',
        terminology: 'Snomed CT',
      },
    };
    const count = form.getCount(
      'clinikk.prescription_pad.v2/medication_order/order',
      data
    );
    expect(count).to.eql(2);

    const data2 = {};
    const count2 = form.getCount(
      'clinikk.prescription_pad.v2/medication_order/order',
      data2
    );
    expect(count2).to.eql(0);

    const data3 = {
      'clinikk.prescription_pad.v2/medication_order/order:1/medication_item': {
        value: 'Paracetamol 500mg tablet',
        code: '322236009',
        terminology: 'Snomed CT',
      },
      'clinikk.prescription_pad.v2/medication_order/order:54/medication_item': {
        value: 'Paracetamol 2 500mg tablet',
        code: '322236009',
        terminology: 'Snomed CT',
      },
    };
    const count3 = form.getCount(
      'clinikk.prescription_pad.v2/medication_order/order',
      data3
    );
    expect(count3).to.eql(55);
  });

  it.skip('performance tests', async () => {
    const repeatableCount = 500;
    const inputCountPerRepeatable = 10;
    const repeatExtra = 10;
    console.log({ repeatableCount, inputCountPerRepeatable, repeatExtra });
    console.log('starting testing');
    const start = performance.now();
    const form = await fixture<MbForm>(
      `
        <mb-form>
          ${[...Array(repeatableCount)].map((_, i) =>
            [...Array(inputCountPerRepeatable)].map(
              (__, j) => `
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
            )
          )}
          ${[...Array(repeatableCount)].map(
            (_, i) => `<mb-repeatable-headless
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
    const end = performance.now();
    console.log('Time taken for render:', end - start, 'ms');
    // await elementUpdated(form);
    // const repeatable = querySelectorDeep(
    //   'mb-repeatable-headless'
    // ) as MbRepeatable;
    // const event: any = await oneEvent(repeatable, 'mb-count');
    // expect(event.target.count).to.equal(0);
    const dataToSet: Record<string, string> = {};
    const dataToEqual: Record<string, string> = {};
    [...Array(repeatableCount + repeatExtra)].forEach((_, i) =>
      [...Array(inputCountPerRepeatable)].forEach((__, j) => {
        const key = `long_repeatable/path/inside/composition${i}:${j}`;
        const value = `Some random data ${i}, ${j}`;
        dataToSet[key] = value;
        if (i <= repeatExtra - 1) {
          dataToEqual[key] = value;
        }
      })
    );
    console.log('starting set timeout');
    setTimeout(() => {
      // start timer
      console.log('Starting to set data');
      const startTime = performance.now();
      form.import(dataToSet);
      const endTime = performance.now();
      console.log('Time taken for import:', endTime - startTime, 'ms');
      // end timer
    });

    // expect(form.data).to.eql({ 'chief_complaints:0': 'Body ache' });
  });
});
