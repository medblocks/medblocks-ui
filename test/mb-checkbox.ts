

import {
    html,
    fixture,
    expect,
    oneEvent,
    elementUpdated,
  } from '@open-wc/testing';

  import '../src/medblocks/proportion/percent';
  import { querySelectorDeep } from 'query-selector-shadow-dom';
import MbForm from '../src/medblocks/form/form'
import '../medblocks'
import MbSelect from '../src/medblocks/codedtext/select';




  describe('MbSelect', () => {

    // it('data if not provided', async () => {
    //   const mbPercent = await fixture<MbSelect>(
    //     html`<mb-percent label="Test 1"></mb-percent>`
    //   );
    //   const input = querySelectorDeep('input') as HTMLInputElement
    //   setTimeout(() => {
    //     input.dispatchEvent(new Event('input'));
    //   });
    //   const event: any = await oneEvent(mbPercent, 'mb-input');
    //   expect(event.target.data).to.eq(undefined);
    // });


    it('emits data on input', async () => {
      const mbselect = await fixture<MbSelect>(
        html`
        <mb-checkbox path="opdvisit.v0/history/story_history/symptom_sign:0/nil_significant" label="Nil significant"></mb-checkbox>`
      );
      const select = querySelectorDeep('sl-select') as unknown as HTMLSelectElement
      select.value = 'at0096';
      select.dispatchEvent(new CustomEvent('sl-change'));
      const event: any = await oneEvent(mbselect, 'mb-input');
      // console.log(event.target.data)
      expect(event.target.data).to.eql({code: 'at0096', value: 'Negative', terminology: 'local',ordinal: 1});
    });


    it('changes input on setting data', async () => {
      const mbOrdinal = await fixture<MbSelect>(
        html`<mb-checkbox path="opdvisit.v0/history/story_history/symptom_sign:0/nil_significant" label="Nil significant"></mb-checkbox>`
      );
      const select = querySelectorDeep('sl-select') as unknown  as HTMLSelectElement
      setTimeout(()=>{
        mbOrdinal.data = {code: 'at0096', value: 'Negative', terminology: 'SOME-TERMINOLOGY',ordinal:1}
      },0)
      await oneEvent(mbOrdinal, 'mb-input');
      await elementUpdated(mbOrdinal);
      expect(select.value).to.eq('at0096');
    });


    it('SpO2 template data loading', async ()=>{
      const form = await fixture<MbForm>(html`
      <mb-form>
      <mb-context path="opdvisit.v0/category"></mb-context>
        <mb-context path="opdvisit.v0/context/start_time"></mb-context>
        <mb-context path="opdvisit.v0/context/setting"></mb-context>

      <mb-checkbox path="opdvisit.v0/history/story_history/symptom_sign:0/nil_significant" label="Nil significant"></mb-checkbox>
      <mb-context path="opdvisit.v0/history/story_history/time"></mb-context>
        <mb-context path="opdvisit.v0/history/story_history/subject"></mb-context>
        <mb-context path="opdvisit.v0/history/story_history/language"></mb-context>
        <mb-context path="opdvisit.v0/history/story_history/encoding"></mb-context>

      <mb-context path="ncd/category"></mb-context>
      <mb-context path="opdvisit.v0/composer"></mb-context>
        <mb-context path="opdvisit.v0/language"></mb-context>
        <mb-context path="opdvisit.v0/territory"></mb-context>
      </mb-form>
      `)
      form.import(
        {
          "ncd/language|code": "en",
          "ncd/language|terminology": "ISO_639-1",
          "ncd/territory|code": "IN",
          "ncd/territory|terminology": "ISO_3166-1",
          "ncd/context/start_time": "2021-11-05T04:50:52.727Z",
          "ncd/context/setting|code": "238",
          "ncd/context/setting|value": "other care",
          "ncd/context/setting|terminology": "openehr",
          "ncd/urinalysis/point_in_time:0/protein|code": "at0098",
          "ncd/urinalysis/point_in_time:0/protein|value": "1+",
          "ncd/urinalysis/point_in_time:0/protein|ordinal": 3,
          "ncd/urinalysis/point_in_time:0/time": "2021-11-05T05:11:05.498Z",
          "ncd/urinalysis/language|code": "en",
          "ncd/urinalysis/language|terminology": "ISO_639-1",
          "ncd/urinalysis/encoding|code": "UTF-8",
          "ncd/urinalysis/encoding|terminology": "IANA_character-sets",
          "ncd/category|code": "433",
          "ncd/category|value": "event",
          "ncd/category|terminology": "openehr",
          "ncd/composer|name": "Medblocks UI"
        }
      )
      // console.log(form.data)
      const mbOrdinal = document.getElementById('ordinal') as MbSelect;
      expect(mbOrdinal.data).to.eql({ code: 'at0098', value: '1+', ordinal: 3 })
    })
  });
