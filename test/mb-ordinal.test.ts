import {
  html,
  fixture,
  expect,
  oneEvent,
  elementUpdated,
} from '@open-wc/testing';

import '../src/medblocks/proportion/percent';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import type MbForm from '../src/medblocks/form/form';
import '../medblocks';
import type MbSelect from '../src/medblocks/codedtext/select';

describe('MbOrdinal', () => {
  it('emits data on input', async () => {
    const mbselect = await fixture<MbSelect>(
      html`
         <mb-select path=ncd/urinalysis/point_in_time:0/protein label="Protein" >
              <mb-option value="at0096" label="Negative" ordinal="1"></mb-option>
              <mb-option value="at0097" label="Trace" ordinal="2"></mb-option>
              <mb-option value="at0098" label="1+" ordinal="3"></mb-option>
              <mb-option value="at0099" label="2+" ordinal="4"></mb-option>
              <mb-option value="at0100" label="3+" ordinal="5"></mb-option>
              <mb-option value="at0101" label="4+" ordinal="6"></mb-option>
        </mb-select>`
    );
    const select = querySelectorDeep(
      'sl-select'
    ) as unknown as HTMLSelectElement;
    select.value = 'at0096';
    select.dispatchEvent(new CustomEvent('sl-change'));
    const event: any = await oneEvent(mbselect, 'mb-input', true);
    expect(event.target.data).to.eql({
      code: 'at0096',
      value: 'Negative',
      terminology: 'local',
      ordinal: 1,
    });
  });

  it('changes input on setting data', async () => {
    const mbOrdinal = await fixture<MbSelect>(
      html`<mb-select path=ncd/urinalysis/point_in_time:0/protein label="Protein" terminology="SOME-TERMINOLOGY" id="ordinal">
              <mb-option value="at0096" label="Negative" ordinal="1"></mb-option>
              <mb-option value="at0097" label="Trace" ordinal="2"></mb-option>
              <mb-option value="at0098" label="1+" ordinal="3"></mb-option>
              <mb-option value="at0099" label="2+" ordinal="4"></mb-option>
              <mb-option value="at0100" label="3+" ordinal="5"></mb-option>
              <mb-option value="at0101" label="4+" ordinal="6"></mb-option>
        </mb-select>`
    );
    const select = querySelectorDeep(
      'sl-select'
    ) as unknown as HTMLSelectElement;
    setTimeout(() => {
      mbOrdinal.data = {
        code: 'at0096',
        value: 'Negative',
        terminology: 'SOME-TERMINOLOGY',
        ordinal: 1,
      };
    }, 0);
    await oneEvent(mbOrdinal, 'mb-input', true);
    await elementUpdated(mbOrdinal);
    expect(select.value).to.eq('at0096');
  });

  it('SpO2 template data loading', async () => {
    const form = await fixture<MbForm>(html`
      <mb-form>
      <mb-context path="ncd/context/start_time"></mb-context>
      <mb-context path="ncd/context/setting"></mb-context>

      <mb-select path=ncd/urinalysis/point_in_time:0/protein label="Protein" id="ordinal">
            <mb-option value="at0096" label="Negative" ordinal="1"></mb-option>
            <mb-option value="at0097" label="Trace" ordinal="2"></mb-option>
            <mb-option value="at0098" label="1+" ordinal="3"></mb-option>
            <mb-option value="at0099" label="2+" ordinal="4"></mb-option>
            <mb-option value="at0100" label="3+" ordinal="5"></mb-option>
            <mb-option value="at0101" label="4+" ordinal="6"></mb-option>
      </mb-select>
      <mb-context path="ncd/urinalysis/point_in_time:0/time"></mb-context>
      <mb-context path="ncd/urinalysis/language"></mb-context>
      <mb-context path="ncd/urinalysis/encoding"></mb-context>
      <mb-context path="ncd/urinalysis/subject"></mb-context>

      <mb-context path="ncd/category"></mb-context>
      <mb-context path="ncd/language"></mb-context>
      <mb-context path="ncd/territory"></mb-context>
      <mb-context path="ncd/composer"></mb-context>
      </mb-form>
      `);
    form.import({
      'ncd/language|code': 'en',
      'ncd/language|terminology': 'ISO_639-1',
      'ncd/territory|code': 'IN',
      'ncd/territory|terminology': 'ISO_3166-1',
      'ncd/context/start_time': '2021-11-05T04:50:52.727Z',
      'ncd/context/setting|code': '238',
      'ncd/context/setting|value': 'other care',
      'ncd/context/setting|terminology': 'openehr',
      'ncd/urinalysis/point_in_time:0/protein|code': 'at0098',
      'ncd/urinalysis/point_in_time:0/protein|value': '1+',
      'ncd/urinalysis/point_in_time:0/protein|ordinal': 3,
      'ncd/urinalysis/point_in_time:0/time': '2021-11-05T05:11:05.498Z',
      'ncd/urinalysis/language|code': 'en',
      'ncd/urinalysis/language|terminology': 'ISO_639-1',
      'ncd/urinalysis/encoding|code': 'UTF-8',
      'ncd/urinalysis/encoding|terminology': 'IANA_character-sets',
      'ncd/category|code': '433',
      'ncd/category|value': 'event',
      'ncd/category|terminology': 'openehr',
      'ncd/composer|name': 'Medblocks UI',
    });
    const mbOrdinal = document.getElementById('ordinal') as MbSelect;
    expect(mbOrdinal.data).to.eql({ code: 'at0098', value: '1+', ordinal: 3 });
  });
});
