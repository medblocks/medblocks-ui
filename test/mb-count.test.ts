import {
  fixture,
  expect,
  oneEvent,
  elementUpdated,
} from '@open-wc/testing';
import MbCount from '../src/medblocks/count/count';
import '../src/medblocks/count/count';
import { querySelectorDeep } from 'query-selector-shadow-dom';

describe('MbCount', () => {
  let mbcount: MbCount;
  let input: HTMLInputElement;

  beforeEach(async () => {
    mbcount = await fixture<MbCount>(
      `<mb-count label="Hello there"></mb-count>`
    );
    input = querySelectorDeep('input') as HTMLInputElement;
  });
  it('emits data on input', async () => {
    setTimeout(() => {
      input.value = '3';
      input.dispatchEvent(new Event('input'));
    }, 0);
    const event: any = await oneEvent(mbcount, 'mb-input');
    expect(event.target.data).to.eq(3);
  });

  it('changes input on setting data', async () => {
    setTimeout(() => {
      input.dispatchEvent(new Event('input'));
      mbcount.data = 1;
    }, 0);
    await oneEvent(mbcount, 'mb-input');
    await elementUpdated(mbcount);
    expect(input.value).to.eq('1');
  });
  it('emits data on input equals 0', async () => {
    setTimeout(() => {
      input.value = '0';
      input.dispatchEvent(new Event('input'));
    }, 0);
    const event: any = await oneEvent(mbcount, 'mb-input');
    expect(event.target.data).to.eq(0);
  });

  it('changes input on setting data as 0', async () => {
    setTimeout(() => {
      input.dispatchEvent(new Event('input'));
      mbcount.data = 0;
    }, 0);
    await oneEvent(mbcount, 'mb-input');
    await elementUpdated(mbcount);
    expect(input.value).to.eq('0');
  });
});
