import { expect } from '@open-wc/testing';
import { count } from '../utils';

describe('count', () => {
  it('should give the number of repeatables', () => {
    const num = count({ 'athul:0': 1, 'athul:1': 2 }, 'athul');
    expect(num).to.eq(2);
  });
});
