import {
  html,
  fixture,
  expect,
  oneEvent,
  elementUpdated,
} from '@open-wc/testing';
import { querySelectorAllDeep } from 'query-selector-shadow-dom';
import type { SlInput } from '@shoelace-style/shoelace';
import type MbDuration from '../src/medblocks/duration/duration';
import '../src/medblocks/duration/duration';

describe('MbDuration', () => {
  it('data if not provided', async () => {
    const mbDuration = await fixture<MbDuration>(
      html`<mb-duration year=${true} label="Year"></mb-duration>`
    );
    const year = querySelectorAllDeep('input') as unknown as SlInput[];
    setTimeout(() => {
      // year[0].value = '2';
      year[0].dispatchEvent(new Event('input'));
    }, 0);
    const event: any = await oneEvent(mbDuration, 'mb-input', true);
    expect(event.target.data).to.eq(undefined);
  });

  it('emits data on input', async () => {
    const mbDuration = await fixture<MbDuration>(
      html`<mb-duration year=${true} label="Year"></mb-duration>`
    );
    const year = querySelectorAllDeep('input') as unknown as SlInput[];
    setTimeout(() => {
      year[0].value = '2';
      year[0].dispatchEvent(new Event('input'));
    }, 0);
    const event: any = await oneEvent(mbDuration, 'mb-input', true);
    expect(event.target.data).to.eq('P2Y');
  });

  it('changes input on setting data', async () => {
    const mbDuration = await fixture<MbDuration>(
      html`<mb-duration year label="Year"></mb-duration>`
    );
    const year = querySelectorAllDeep('input') as unknown as SlInput[];
    setTimeout(() => {
      year[0].dispatchEvent(new Event('input'));
      mbDuration.data = 'P3Y4M';
    });
    await oneEvent(mbDuration, 'mb-input', true);
    await elementUpdated(mbDuration);
    expect(year[0].value).to.eq('3');
  });
  it('changes input on setting data for month', async () => {
    const mbDuration = await fixture<MbDuration>(
      html`<mb-duration year month label="Year"></mb-duration>`
    );
    const year = querySelectorAllDeep('input') as unknown as SlInput[];
    setTimeout(() => {
      year[1].dispatchEvent(new Event('input'));
      mbDuration.data = 'P3Y4M';
    });
    await oneEvent(mbDuration, 'mb-input', true);
    await elementUpdated(mbDuration);
    expect(year[1].value).to.eq('4');
  });
});
