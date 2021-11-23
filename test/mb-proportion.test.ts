import {
    html,
    fixture,
    expect,
    oneEvent, 
    elementUpdated,
  } from '@open-wc/testing';
  import MbPercent from '../src/medblocks/proportion/proportion';
  import '../src/medblocks/proportion/proportion';
  import { querySelectorDeep } from 'query-selector-shadow-dom';
import MbForm from '../src/medblocks/form/form'
import '../medblocks'



  
  describe('MbProportion', () => {
  
    it('data if not provided', async () => {
      const mbPercent = await fixture<MbPercent>(
        html`<mb-proportion label="Test 1"></mb-proportion>`
      );
      const input = querySelectorDeep('input') as HTMLInputElement
      setTimeout(() => {
        input.dispatchEvent(new Event('input'));
      });
      const event: any = await oneEvent(mbPercent, 'mb-input');
      expect(event.target.data).to.eq(undefined);
    });
  
  
    it('emits data on input', async () => {
      const mbPercent = await fixture<MbPercent>(
        html`<mb-proportion label="Test 2"></mb-proportion>`
      );
      const input = querySelectorDeep('input') as HTMLInputElement
      setTimeout(() => {
        input.value = '0.2';
        input.dispatchEvent(new Event('input')); 
      });
      const event: any = await oneEvent(mbPercent, 'mb-input');
      expect(event.target.data).to.eql({ numerator: 0.2, denominator: 1, type: 1 });
    });
  
    
    it('changes input on setting data', async () => {
      const mbPercent = await fixture<MbPercent>(
        html`<mb-proportion label="Test 3"></mb-proportion>`
      );
      const input = querySelectorDeep('input') as HTMLInputElement
      setTimeout(()=>{
          mbPercent.data = { numerator: 0.3, denominator: 1, type: 1 };
      },0)
      await oneEvent(mbPercent, 'mb-input');
      await elementUpdated(mbPercent);
      expect(input.value).to.eq('0.3');
    });

    it('SpO2 template data loading', async ()=>{
      const form = await fixture<MbForm>(html`
      <mb-form>
      <mb-context path="ncd/context/start_time"></mb-context>
      <mb-context path="ncd/context/setting"></mb-context>
     
      <mb-proportion path="ncd/pulse_oximetry/any_event:0/spo" label="SpO₂" id="percentage"></mb-proportion>
      <mb-context path="ncd/pulse_oximetry/any_event:0/time"></mb-context>
      <mb-context path="ncd/pulse_oximetry/language"></mb-context>
      <mb-context path="ncd/pulse_oximetry/encoding"></mb-context>
      <mb-context path="ncd/pulse_oximetry/subject"></mb-context>
  
      <mb-context path="ncd/category"></mb-context>
      <mb-context path="ncd/language"></mb-context>
      <mb-context path="ncd/territory"></mb-context>
      <mb-context path="ncd/composer"></mb-context>
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
          "ncd/pulse_oximetry/any_event:0/spo|numerator": 0.2,
          "ncd/pulse_oximetry/any_event:0/spo|denominator": 1,
          "ncd/pulse_oximetry/any_event:0/spo|type": 1,
          "ncd/pulse_oximetry/any_event:0/spo": 0.2,
          "ncd/pulse_oximetry/any_event:0/time": "2021-11-05T05:11:05.498Z",
          "ncd/pulse_oximetry/language|code": "en",
          "ncd/pulse_oximetry/language|terminology": "ISO_639-1",
          "ncd/pulse_oximetry/encoding|code": "UTF-8",
          "ncd/pulse_oximetry/encoding|terminology": "IANA_character-sets",
          "ncd/category|code": "433",
          "ncd/category|value": "event",
          "ncd/category|terminology": "openehr",
          "ncd/composer|name": "Medblocks UI"
        }
      )
      const mbPercent = document.getElementById('percentage') as MbPercent;
      expect(mbPercent.data).to.eql({ _root: 0.2, numerator: 0.2, denominator: 1, type: 1 })
    })
  });
  