import { expect, html, fixture } from '@open-wc/testing';
import { elementUpdated, oneEvent } from '@open-wc/testing-helpers';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import type { SlInput } from '@shoelace-style/shoelace';
import type MbForm from '../src/medblocks/form/form';
import '../medblocks';
import type MbPercent from '../src/medblocks/proportion/percent';
import type MbCount from '../src/medblocks/count/count';
import type MbCheckBox from '../src/medblocks/boolean/checkbox';
import type MbInput from '../src/medblocks/text/input';

describe('Form e2e', () => {
  it('should set the data property properly', async () => {
    const form = await fixture<MbForm>(
      html`
        <mb-form>
          <mb-input path="test/1"></mb-input>
        </mb-form>
      `
    );
    form.data = { 'test/1': 'Hello there' };
    await elementUpdated(form);
    const input = querySelectorDeep('input') as HTMLInputElement;
    expect(input.value).to.eq('Hello there');
  });

  it('should get data property from form', async () => {
    const form = await fixture<MbForm>(
      html`
        <mb-form>
          <mb-input path="test/1" .data=${'Hello test!'}></mb-input>
        </mb-form>
      `
    );
    expect(form.data).to.eql({ 'test/1': 'Hello test!' });
  });

  it('should serialize to openEHR composition', async () => {});

  it('should deserialize from openEHR composition', async () => {});

  it('should bind to the parsed FHIR data', async () => {
    const form = await fixture<MbForm>(html`
      <mb-fhir-form>
        <mb-input
          class="is-hidden"
          path="resourceType"
          data="Patient"
        ></mb-input>
        <div class="field">
          <mb-input label="Name" path="name[0].given[0]"></mb-input>
        </div>
        <div class="field">
          <mb-date label="Date of birth" path="birthDate"></mb-date>
        </div>
        <div class="field">
          <mb-buttons type="code" label="Gender" path="gender">
            <mb-option value="male" label="Male"></mb-option>
            <mb-option value="female" label="Female"></mb-option>
            <mb-option value="other" label="Other"></mb-option>
          </mb-buttons>
        </div>
        <div class="field">
          <mb-input label="Phone number" path="telecom[0].value"></mb-input>
        </div>
        <div class="field">
          <mb-input
            path="identifier[0].value"
            label="Aadhar card number"
          ></mb-input>
          <mb-input
            path="identifier[0].system"
            class="is-hidden"
            data="aadhar"
          ></mb-input>
        </div>
        <div class="field">
          <mb-input label="Address" textarea path="address[0].text"></mb-input>
        </div>
        <label for="" class="label">Attendant information</label>
        <div class="box">
          <div class="field">
            <mb-input label="Name" path="contact[0].name.given[0]"></mb-input>
          </div>
          <div class="field">
            <mb-select
              label="Relationship"
              path="contact[0].relationship[0]"
              type="CodableConcept"
            >
              <mb-option value="mother" label="Mother"></mb-option>
              <mb-option value="father" label="Father"></mb-option>
            </mb-select>
          </div>
          <div class="field">
            <mb-input
              label="Contact number"
              path="contact[0].telecom[0].value"
            ></mb-input>
          </div>
        </div>
        <div class="field">
          <mb-submit type="primary">Save</mb-submit>
        </div>
      </mb-fhir-form>
    `);
    const resource = {
      address: [
        {
          text: 'Manipal',
        },
      ],
      meta: {
        lastUpdated: '2021-05-19T08:35:52.079131Z',
        createdAt: '2021-05-19T08:35:52.079131Z',
        versionId: '19',
      },
      name: [
        {
          given: ['Sidharth R'],
        },
      ],
      birthDate: '1997-09-08',
      resourceType: 'Patient',
      id: 'c8b0f871-98ed-4a5b-a977-cfa5bf0417f7',
      identifier: [
        {
          value: '123445',
          system: 'aadhar',
        },
      ],
      telecom: [
        {
          value: '9585841964',
        },
      ],
      gender: 'male',
      contact: [
        {
          name: {
            given: ['Uma Maheswari'],
          },
          telecom: [
            {
              value: '9944941964',
            },
          ],
          relationship: [
            {
              text: 'Mother',
              coding: [
                {
                  code: 'mother',
                  system: 'local',
                  display: 'Mother',
                },
              ],
            },
          ],
        },
      ],
    };
    // form.data = resource
    const parsed = form.parse(resource);
    form.data = parsed;
    await elementUpdated(form);
    expect(form.data).to.eql(parsed);
  });
  it('should serialize to FHIR resource', () => {});

  it('should serialize from FHIR resource', () => {});
  it('NCD template data loading', async () => {
    const form = await fixture<MbForm>(html`
      <mb-form>
      <mb-context path="ncd/context/start_time"></mb-context>
      <mb-context path="ncd/context/setting"></mb-context>
      <mb-quantity default="Cel" path="ncd/body_temperature/any_event:0/temperature" label="Temperature">
                      <mb-unit unit="Cel" label="Cel"></mb-unit>
                  </mb-quantity>
      <mb-context path="ncd/body_temperature/any_event:0/time"></mb-context>
      <mb-context path="ncd/body_temperature/language"></mb-context>
      <mb-context path="ncd/body_temperature/encoding"></mb-context>
      <mb-context path="ncd/body_temperature/subject"></mb-context>
      <mb-quantity default="mm[Hg]" path="ncd/blood_pressure/any_event:0/systolic" label="Systolic">
                      <mb-unit unit="mm[Hg]" label="mm[Hg]"></mb-unit>
                  </mb-quantity>
      <mb-quantity default="mm[Hg]" path="ncd/blood_pressure/any_event:0/diastolic" label="Diastolic">
                      <mb-unit unit="mm[Hg]" label="mm[Hg]"></mb-unit>
                  </mb-quantity>
      <mb-context path="ncd/blood_pressure/any_event:0/time"></mb-context>
      <mb-context path="ncd/blood_pressure/language"></mb-context>
      <mb-context path="ncd/blood_pressure/encoding"></mb-context>
      <mb-context path="ncd/blood_pressure/subject"></mb-context>
      <mb-quantity default="/min" path="ncd/pulse_heart_beat/any_event:0/rate" label="Rate">
                      <mb-unit unit="/min" label="/min"></mb-unit>
                  </mb-quantity>
      <mb-select path="ncd/pulse_heart_beat/any_event:0/regularity" label="Regularity">
                  <mb-option value="at0006" label="Regular"></mb-option>
      <mb-option value="at1028" label="Irregular"></mb-option>
                </mb-select>
      <mb-context path="ncd/pulse_heart_beat/any_event:0/time"></mb-context>
      <mb-context path="ncd/pulse_heart_beat/language"></mb-context>
      <mb-context path="ncd/pulse_heart_beat/encoding"></mb-context>
      <mb-context path="ncd/pulse_heart_beat/subject"></mb-context>
      <mb-quantity default="cm" path="ncd/height_length/any_event:0/height_length" label="Height/Length">
                      <mb-unit unit="cm" label="cm"></mb-unit>
      <mb-unit unit="[in_i]" label="[in_i]"></mb-unit>
                  </mb-quantity>
      <mb-context path="ncd/height_length/any_event:0/time"></mb-context>
      <mb-context path="ncd/height_length/language"></mb-context>
      <mb-context path="ncd/height_length/encoding"></mb-context>
      <mb-context path="ncd/height_length/subject"></mb-context>
      <mb-quantity default="kg" path="ncd/body_weight/any_event:0/weight" label="Weight">
                      <mb-unit unit="kg" label="kg"></mb-unit>
      <mb-unit unit="[lb_av]" label="[lb_av]"></mb-unit>
      <mb-unit unit="g" label="g"></mb-unit>
                  </mb-quantity>
      <mb-context path="ncd/body_weight/any_event:0/time"></mb-context>
      <mb-context path="ncd/body_weight/language"></mb-context>
      <mb-context path="ncd/body_weight/encoding"></mb-context>
      <mb-context path="ncd/body_weight/subject"></mb-context>
      <mb-quantity default="cm" path="ncd/waist_circumference/any_event:0/waist_circumference" label="Waist circumference">
                      <mb-unit unit="cm" label="cm"></mb-unit>
      <mb-unit unit="[in_i]" label="[in_i]"></mb-unit>
                  </mb-quantity>
      <mb-context path="ncd/waist_circumference/any_event:0/time"></mb-context>
      <mb-context path="ncd/waist_circumference/language"></mb-context>
      <mb-context path="ncd/waist_circumference/encoding"></mb-context>
      <mb-context path="ncd/waist_circumference/subject"></mb-context>
      <mb-quantity default="cm" path="ncd/hip_circumference/hip_circumference" label="Hip circumference">
                      <mb-unit unit="cm" label="cm"></mb-unit>
      <mb-unit unit="[in_i]" label="[in_i]"></mb-unit>
                  </mb-quantity>
      <mb-context path="ncd/hip_circumference/time"></mb-context>
      <mb-context path="ncd/hip_circumference/language"></mb-context>
      <mb-context path="ncd/hip_circumference/encoding"></mb-context>
      <mb-context path="ncd/hip_circumference/subject"></mb-context>
      <mb-percent path="ncd/pulse_oximetry/any_event:0/spo" label="SpO₂" id="percentage"></mb-percent>
      <mb-context path="ncd/pulse_oximetry/any_event:0/time"></mb-context>
      <mb-context path="ncd/pulse_oximetry/language"></mb-context>
      <mb-context path="ncd/pulse_oximetry/encoding"></mb-context>
      <mb-context path="ncd/pulse_oximetry/subject"></mb-context>
      <mb-input path="ncd/laboratory_test_result/any_event:0/test_name" label="Test name"></mb-input>
      <mb-quantity default="mmol/dl" path="ncd/laboratory_test_result/any_event:0/blood_glucose/blood_glucose_level" label="Blood Glucose Level">
                      <mb-unit unit="mmol/dl" label="mmol/dl"></mb-unit>
                  </mb-quantity>
      <mb-quantity default="g/dl" path="ncd/laboratory_test_result/any_event:0/haemoglobin/haemoglobin" label="Haemoglobin">
                      <mb-unit unit="g/dl" label="g/dl"></mb-unit>
                  </mb-quantity>
      <mb-quantity default="mg/dl" path="ncd/laboratory_test_result/any_event:0/cholesterol/cholesterol" label="Cholesterol">
                      <mb-unit unit="mg/dl" label="mg/dl"></mb-unit>
                  </mb-quantity>
      <mb-quantity default="mg/dl" path="ncd/laboratory_test_result/any_event:0/uric_acid/uric_acid" label="Uric Acid">
                      <mb-unit unit="mg/dl" label="mg/dl"></mb-unit>
                  </mb-quantity>
      <mb-select path="ncd/laboratory_test_result/any_event:0/blood_group/analyte_name" label="Analyte name" terminology="LOINC">
                  <mb-option value="882-1" label="ABO and Rh group [Type] in Blood"></mb-option>
                </mb-select>
                <mb-buttons path="ncd/laboratory_test_result/any_event:0/blood_group/blood_group" label="Blood Group" terminology="SNOMED-CT">
                  <mb-option value="278147001" label="O +ve"></mb-option>
            <mb-option value="278148006" label="O -ve"></mb-option>
            <mb-option value="278149003" label="A +ve"></mb-option>
            <mb-option value="278152006" label="A -ve"></mb-option>
            <mb-option value="278150003" label="B +ve"></mb-option>
            <mb-option value="278153001" label="B -ve"></mb-option>
            <mb-option value="278151004" label="AB +ve"></mb-option>
            <mb-option value="278154007" label="AB -ve"></mb-option>
                  </mb-buttons>
      <mb-context path="ncd/laboratory_test_result/any_event:0/time"></mb-context>
      <mb-context path="ncd/laboratory_test_result/language"></mb-context>
      <mb-context path="ncd/laboratory_test_result/encoding"></mb-context>
      <mb-context path="ncd/laboratory_test_result/subject"></mb-context>
      <mb-select path=ncd/urinalysis/point_in_time:0/glucose label="Glucose">
            <mb-option value="at0115" label="Negative" ordinal="1"></mb-option>
      <mb-option value="at0116" label="Trace" ordinal="2"></mb-option>
      <mb-option value="at0117" label="1+" ordinal="3"></mb-option>
      <mb-option value="at0118" label="2+" ordinal="4"></mb-option>
      <mb-option value="at0119" label="3+" ordinal="5"></mb-option>
      <mb-option value="at0120" label="4+" ordinal="6"></mb-option></mb-select>
      <mb-select path=ncd/urinalysis/point_in_time:0/protein label="Protein">
            <mb-option value="at0096" label="Negative" ordinal="1"></mb-option>
      <mb-option value="at0097" label="Trace" ordinal="2"></mb-option>
      <mb-option value="at0098" label="1+" ordinal="3"></mb-option>
      <mb-option value="at0099" label="2+" ordinal="4"></mb-option>
      <mb-option value="at0100" label="3+" ordinal="5"></mb-option>
      <mb-option value="at0101" label="4+" ordinal="6"></mb-option></mb-select>
      <mb-context path="ncd/urinalysis/point_in_time:0/time"></mb-context>
      <mb-context path="ncd/urinalysis/language"></mb-context>
      <mb-context path="ncd/urinalysis/encoding"></mb-context>
      <mb-context path="ncd/urinalysis/subject"></mb-context>
      <mb-count path="ncd/urinalysis/point_in_time:0/tota_score" id="count"></mb-count>
      <mb-context path="ncd/category"></mb-context>
      <mb-context path="ncd/language"></mb-context>
      <mb-context path="ncd/territory"></mb-context>
      <mb-context path="ncd/composer"></mb-context>
      <mb-context path="ncd/context/_health_care_facility"></mb-context>

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
      'ncd/body_temperature/any_event:0/temperature|magnitude': 32.0,
      'ncd/body_temperature/any_event:0/temperature|unit': 'Cel',
      'ncd/body_temperature/any_event:0/time': '2021-11-05T04:54:16.936Z',
      'ncd/body_temperature/language|code': 'en',
      'ncd/body_temperature/language|terminology': 'ISO_639-1',
      'ncd/body_temperature/encoding|code': 'UTF-8',
      'ncd/body_temperature/encoding|terminology': 'IANA_character-sets',
      'ncd/blood_pressure/any_event:0/systolic|magnitude': 120.0,
      'ncd/blood_pressure/any_event:0/systolic|unit': 'mm[Hg]',
      'ncd/blood_pressure/any_event:0/diastolic|magnitude': 80.0,
      'ncd/blood_pressure/any_event:0/diastolic|unit': 'mm[Hg]',
      'ncd/blood_pressure/any_event:0/time': '2021-11-05T04:54:16.936Z',
      'ncd/blood_pressure/language|code': 'en',
      'ncd/blood_pressure/language|terminology': 'ISO_639-1',
      'ncd/blood_pressure/encoding|code': 'UTF-8',
      'ncd/blood_pressure/encoding|terminology': 'IANA_character-sets',
      'ncd/pulse_heart_beat/any_event:0/rate|magnitude': 90.0,
      'ncd/pulse_heart_beat/any_event:0/rate|unit': '/min',
      'ncd/pulse_heart_beat/any_event:0/regularity|code': 'at0006',
      'ncd/pulse_heart_beat/any_event:0/regularity|value': 'Regular',
      'ncd/pulse_heart_beat/any_event:0/regularity|terminology': 'local',
      'ncd/pulse_heart_beat/any_event:0/time': '2021-11-05T05:11:05.497Z',
      'ncd/pulse_heart_beat/language|code': 'en',
      'ncd/pulse_heart_beat/language|terminology': 'ISO_639-1',
      'ncd/pulse_heart_beat/encoding|code': 'UTF-8',
      'ncd/pulse_heart_beat/encoding|terminology': 'IANA_character-sets',
      'ncd/height_length/any_event:0/height_length|magnitude': 177.0,
      'ncd/height_length/any_event:0/height_length|unit': 'cm',
      'ncd/height_length/any_event:0/time': '2021-11-05T05:11:05.498Z',
      'ncd/height_length/language|code': 'en',
      'ncd/height_length/language|terminology': 'ISO_639-1',
      'ncd/height_length/encoding|code': 'UTF-8',
      'ncd/height_length/encoding|terminology': 'IANA_character-sets',
      'ncd/body_weight/any_event:0/weight|magnitude': 77.0,
      'ncd/body_weight/any_event:0/weight|unit': 'kg',
      'ncd/body_weight/any_event:0/time': '2021-11-05T05:11:05.498Z',
      'ncd/body_weight/language|code': 'en',
      'ncd/body_weight/language|terminology': 'ISO_639-1',
      'ncd/body_weight/encoding|code': 'UTF-8',
      'ncd/body_weight/encoding|terminology': 'IANA_character-sets',
      'ncd/waist_circumference/any_event:0/waist_circumference|magnitude': 166.0,
      'ncd/waist_circumference/any_event:0/waist_circumference|unit': 'cm',
      'ncd/waist_circumference/any_event:0/time': '2021-11-05T05:11:05.498Z',
      'ncd/waist_circumference/language|code': 'en',
      'ncd/waist_circumference/language|terminology': 'ISO_639-1',
      'ncd/waist_circumference/encoding|code': 'UTF-8',
      'ncd/waist_circumference/encoding|terminology': 'IANA_character-sets',
      'ncd/hip_circumference/hip_circumference|magnitude': 134.0,
      'ncd/hip_circumference/hip_circumference|unit': 'cm',
      'ncd/hip_circumference/time': '2021-11-05T05:11:05.498Z',
      'ncd/hip_circumference/language|code': 'en',
      'ncd/hip_circumference/language|terminology': 'ISO_639-1',
      'ncd/hip_circumference/encoding|code': 'UTF-8',
      'ncd/hip_circumference/encoding|terminology': 'IANA_character-sets',
      'ncd/pulse_oximetry/any_event:0/spo|numerator': 2.0,
      'ncd/pulse_oximetry/any_event:0/spo|denominator': 100.0,
      'ncd/pulse_oximetry/any_event:0/spo|type': 2,
      'ncd/pulse_oximetry/any_event:0/spo': 0.02,
      'ncd/pulse_oximetry/any_event:0/time': '2021-11-05T05:11:05.498Z',
      'ncd/pulse_oximetry/language|code': 'en',
      'ncd/pulse_oximetry/language|terminology': 'ISO_639-1',
      'ncd/pulse_oximetry/encoding|code': 'UTF-8',
      'ncd/pulse_oximetry/encoding|terminology': 'IANA_character-sets',
      'ncd/laboratory_test_result/any_event:0/test_name': 'Blood Test',
      'ncd/laboratory_test_result/any_event:0/blood_glucose/blood_glucose_level|magnitude': 109.0,
      'ncd/laboratory_test_result/any_event:0/blood_glucose/blood_glucose_level|unit':
        'mmol/dl',
      'ncd/laboratory_test_result/any_event:0/haemoglobin/haemoglobin|magnitude': 11.0,
      'ncd/laboratory_test_result/any_event:0/haemoglobin/haemoglobin|unit':
        'g/dl',
      'ncd/laboratory_test_result/any_event:0/cholesterol/cholesterol|magnitude': 100.0,
      'ncd/laboratory_test_result/any_event:0/cholesterol/cholesterol|unit':
        'mg/dl',
      'ncd/laboratory_test_result/any_event:0/uric_acid/uric_acid|magnitude': 35.0,
      'ncd/laboratory_test_result/any_event:0/uric_acid/uric_acid|unit':
        'mg/dl',
      'ncd/laboratory_test_result/any_event:0/blood_group/analyte_name|code':
        '882-1',
      'ncd/laboratory_test_result/any_event:0/blood_group/analyte_name|value':
        'ABO and Rh group [Type] in Blood',
      'ncd/laboratory_test_result/any_event:0/blood_group/analyte_name|terminology':
        'LOINC',
      'ncd/laboratory_test_result/any_event:0/blood_group/blood_group|code':
        '278147001',
      'ncd/laboratory_test_result/any_event:0/blood_group/blood_group|value':
        'O +ve',
      'ncd/laboratory_test_result/any_event:0/blood_group/blood_group|terminology':
        'SNOMED-CT',
      'ncd/laboratory_test_result/any_event:0/time': '2021-11-05T04:50:52.727Z',
      'ncd/laboratory_test_result/language|code': 'en',
      'ncd/laboratory_test_result/language|terminology': 'ISO_639-1',
      'ncd/laboratory_test_result/encoding|code': 'UTF-8',
      'ncd/laboratory_test_result/encoding|terminology': 'IANA_character-sets',
      'ncd/urinalysis/point_in_time:0/glucose|code': 'at0117',
      'ncd/urinalysis/point_in_time:0/glucose|value': '1+',
      'ncd/urinalysis/point_in_time:0/glucose|ordinal': 3,
      'ncd/urinalysis/point_in_time:0/protein|code': 'at0098',
      'ncd/urinalysis/point_in_time:0/protein|value': '1+',
      'ncd/urinalysis/point_in_time:0/protein|ordinal': 3,
      'ncd/urinalysis/point_in_time:0/time': '2021-11-05T05:11:05.498Z',
      'ncd/urinalysis/point_in_time:0/tota_score': 3,
      'ncd/urinalysis/language|code': 'en',
      'ncd/urinalysis/language|terminology': 'ISO_639-1',
      'ncd/urinalysis/encoding|code': 'UTF-8',
      'ncd/urinalysis/encoding|terminology': 'IANA_character-sets',
      'ncd/category|code': '433',
      'ncd/category|value': 'event',
      'ncd/category|terminology': 'openehr',
      'ncd/composer|name': 'Medblocks UI',
      'ncd/context/_health_care_facility|name': 'Medblocks Hospital',
      'ncd/context/_health_care_facility|id': '12345',
      'ncd/context/_health_care_facility|id_scheme': 'Encounter',
      'ncd/context/_health_care_facility|id_namespace': 'FHIR',
    });
    await elementUpdated(form);
    const mbPercent = document.getElementById('percentage') as MbPercent;
    const mbCount = document.getElementById('count') as MbCount;
    expect(mbCount.data).to.eql(3);
    expect(mbPercent.data).to.eql({
      _root: 0.02,
      numerator: 2,
      denominator: 100,
      type: 2,
    });
  });

  it('DRX template context issue', async () => {
    const form = await fixture<MbForm>(html`
      <mb-form .ctx=${{ _health_care_facility_id: '12345' }}>
        <mb-context path="opdvisit.v0/category"></mb-context>
        <mb-context path="opdvisit.v0/context/start_time"></mb-context>
        <mb-context path="opdvisit.v0/context/setting"></mb-context>
        <p class="font-bold text-lg">Presenting problem</p>
        <mb-search
          path="opdvisit.v0/reason_for_encounter/presenting_problem:0"
          hits="{5}"
          terminology="Snomed CT"
        >
          <mb-filter value="404684003" label="Clinical Findings" />
        </mb-search>
        <mb-context
          path="opdvisit.v0/reason_for_encounter/subject"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/reason_for_encounter/language"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/reason_for_encounter/encoding"
        ></mb-context>
        <mb-input
          path="opdvisit.v0/history/story_history/story:0"
          label="Story"
        ></mb-input>
        <mb-input
          path="opdvisit.v0/history/story_history/symptom_sign:0/symptoms"
          label="Symptoms"
        ></mb-input>
        <mb-checkbox
          path="opdvisit.v0/history/story_history/symptom_sign:0/nil_significant"
          label="Nil significant"
        ></mb-checkbox>
        <mb-input
          path="opdvisit.v0/history/story_history/symptom_sign:0/body_site:0"
          label="Body site"
        ></mb-input>
        <mb-input
          path="opdvisit.v0/history/story_history/symptom_sign:0/description"
          label="Description"
        ></mb-input>
        <mb-date
          time
          path="opdvisit.v0/history/story_history/symptom_sign:0/episode_onset"
          label="Episode onset"
        ></mb-date>
        <mb-duration
          year
          month
          hour
          path="opdvisit.v0/history/story_history/symptom_sign:0/duration"
          label="Duration"
        ></mb-duration>
        <mb-select
          path="opdvisit.v0/history/story_history/symptom_sign:0/progression:0"
          label="Progression"
          terminology="local"
        >
          <mb-option value="at0183" label="Worsening"></mb-option>
          <mb-option value="at0182" label="Unchanged"></mb-option>
          <mb-option value="at0181" label="Improving"></mb-option>
          <mb-option value="at0184" label="Resolved"></mb-option>
        </mb-select>
        <mb-input
          path="opdvisit.v0/history/story_history/symptom_sign:0/modifying_factor:0/factor"
          label="Factor"
        ></mb-input>
        <mb-select
          path="opdvisit.v0/history/story_history/symptom_sign:0/modifying_factor:0/effect"
          label="Effect"
          terminology="local"
        >
          <mb-option value="at0159" label="Relieves"></mb-option>
          <mb-option value="at0156" label="No effect"></mb-option>
          <mb-option value="at0158" label="Worsens"></mb-option>
        </mb-select>
        <mb-input
          path="opdvisit.v0/history/story_history/symptom_sign:0/comment"
          label="Comment"
        ></mb-input>
        <mb-context path="opdvisit.v0/history/story_history/time"></mb-context>
        <mb-context
          path="opdvisit.v0/history/story_history/subject"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/history/story_history/language"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/history/story_history/encoding"
        ></mb-context>

        <mb-input
          path="opdvisit.v0/history/family_history/per_family_member:0/relationship"
          label="Relationship"
        ></mb-input>
        <mb-input
          path="opdvisit.v0/history/family_history/per_family_member:0/clinical_history:0/problem_diagnosis_name"
          label="Problem/diagnosis name"
        ></mb-input>
        <mb-date
          time
          path="opdvisit.v0/history/family_history/last_updated"
          label="Last Updated"
        ></mb-date>
        <mb-context
          path="opdvisit.v0/history/family_history/subject"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/history/family_history/language"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/history/family_history/encoding"
        ></mb-context>

        <mb-quantity
          default="/min"
          path="opdvisit.v0/examination_findings/vital_signs/pulse_heart_beat/rate"
          label="Rate"
        >
          <mb-unit unit="/min" label="/min"></mb-unit>
        </mb-quantity>
        <mb-select
          path="opdvisit.v0/examination_findings/vital_signs/pulse_heart_beat/regularity"
          label="Regularity"
          terminology="local"
        >
          <mb-option value="at0006" label="Regular"></mb-option>
          <mb-option value="at1028" label="Irregular"></mb-option>
        </mb-select>
        <mb-context
          path="opdvisit.v0/examination_findings/vital_signs/pulse_heart_beat/time"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/examination_findings/vital_signs/pulse_heart_beat/subject"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/examination_findings/vital_signs/pulse_heart_beat/language"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/examination_findings/vital_signs/pulse_heart_beat/encoding"
        ></mb-context>

        <mb-quantity
          default="mm[Hg]"
          path="opdvisit.v0/examination_findings/vital_signs/blood_pressure/systolic"
          label="Systolic"
        >
          <mb-unit unit="mm[Hg]" label="mm[Hg]"></mb-unit>
        </mb-quantity>
        <mb-quantity
          default="mm[Hg]"
          path="opdvisit.v0/examination_findings/vital_signs/blood_pressure/diastolic"
          label="Diastolic"
        >
          <mb-unit unit="mm[Hg]" label="mm[Hg]"></mb-unit>
        </mb-quantity>
        <mb-context
          path="opdvisit.v0/examination_findings/vital_signs/blood_pressure/time"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/examination_findings/vital_signs/blood_pressure/subject"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/examination_findings/vital_signs/blood_pressure/language"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/examination_findings/vital_signs/blood_pressure/encoding"
        ></mb-context>

        <mb-quantity
          default="Cel"
          path="opdvisit.v0/examination_findings/vital_signs/body_temperature/temperature"
          label="Temperature"
        >
          <mb-unit unit="Cel" label="Cel"></mb-unit>
          <mb-unit unit="[degF]" label="[degF]"></mb-unit>
        </mb-quantity>
        <mb-context
          path="opdvisit.v0/examination_findings/vital_signs/body_temperature/time"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/examination_findings/vital_signs/body_temperature/subject"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/examination_findings/vital_signs/body_temperature/language"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/examination_findings/vital_signs/body_temperature/encoding"
        ></mb-context>

        <mb-quantity
          default="kg"
          path="opdvisit.v0/examination_findings/vital_signs/body_weight/any_event:0/weight"
          label="Weight"
        >
          <mb-unit unit="kg" label="kg"></mb-unit>
          <mb-unit unit="[lb_av]" label="[lb_av]"></mb-unit>
          <mb-unit unit="g" label="g"></mb-unit>
        </mb-quantity>
        <mb-context
          path="opdvisit.v0/examination_findings/vital_signs/body_weight/any_event:0/time"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/examination_findings/vital_signs/body_weight/subject"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/examination_findings/vital_signs/body_weight/language"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/examination_findings/vital_signs/body_weight/encoding"
        ></mb-context>

        <mb-input
          path="opdvisit.v0/physical_examination_findings/description"
          label="Description"
        ></mb-input>
        <mb-input
          path="opdvisit.v0/physical_examination_findings/examination_findings/system_or_structure_examined"
          label="System or structure examined"
        ></mb-input>
        <mb-input
          path="opdvisit.v0/physical_examination_findings/examination_findings/body_site"
          label="Body site"
        ></mb-input>
        <mb-checkbox
          path="opdvisit.v0/physical_examination_findings/examination_findings/no_abnormality_detected"
          label="No abnormality detected"
        ></mb-checkbox>
        <mb-input
          path="opdvisit.v0/physical_examination_findings/examination_findings/clinical_description"
          label="Clinical description"
        ></mb-input>
        <mb-input
          path="opdvisit.v0/physical_examination_findings/interpretation:0"
          label="Interpretation"
        ></mb-input>
        <mb-input
          path="opdvisit.v0/physical_examination_findings/comment"
          label="Comment"
        ></mb-input>
        <mb-input
          path="opdvisit.v0/physical_examination_findings/confounding_factors:0"
          label="Confounding factors"
        ></mb-input>
        <mb-input
          path="opdvisit.v0/physical_examination_findings/position"
          label="Position"
        ></mb-input>
        <mb-context
          path="opdvisit.v0/physical_examination_findings/time"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/physical_examination_findings/subject"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/physical_examination_findings/language"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/physical_examination_findings/encoding"
        ></mb-context>

        <p class="font-bold text-lg">Problem/Diagnosis name</p>
        <mb-search
          path="opdvisit.v0/problem_diagnosis/problem_diagnosis_name"
          hits="{5}"
          terminology="Snomed CT"
        >
          <mb-filter value="404684003" label="Clinical Findings" />
        </mb-search>
        <mb-input
          path="opdvisit.v0/problem_diagnosis/clinical_description"
          label="Clinical description"
        ></mb-input>
        <mb-input-multiple
          path="opdvisit.v0/problem_diagnosis/body_site"
          label="Body site"
        ></mb-input-multiple>
        <mb-date
          time
          path="opdvisit.v0/problem_diagnosis/date_time_of_onset"
          label="Date/time of onset"
        ></mb-date>
        <mb-select
          path="opdvisit.v0/problem_diagnosis/severity"
          label="Severity"
          terminology="local"
        >
          <mb-option value="at0047" label="Mild"></mb-option>
          <mb-option value="at0048" label="Moderate"></mb-option>
          <mb-option value="at0049" label="Severe"></mb-option>
        </mb-select>
        <mb-input
          path="opdvisit.v0/problem_diagnosis/course_description"
          label="Course description"
        ></mb-input>
        <mb-date
          time
          path="opdvisit.v0/problem_diagnosis/date_time_of_resolution"
          label="Date/time of resolution"
        ></mb-date>
        <mb-select
          path="opdvisit.v0/problem_diagnosis/diagnostic_certainty"
          label="Diagnostic certainty"
          terminology="local"
        >
          <mb-option value="at0074" label="Suspected"></mb-option>
          <mb-option value="at0075" label="Probable"></mb-option>
          <mb-option value="at0076" label="Confirmed"></mb-option>
        </mb-select>
        <mb-input
          path="opdvisit.v0/problem_diagnosis/comment"
          label="Comment"
        ></mb-input>
        <mb-date
          time
          path="opdvisit.v0/problem_diagnosis/last_updated"
          label="Last updated"
        ></mb-date>
        <mb-context path="opdvisit.v0/problem_diagnosis/subject"></mb-context>
        <mb-context path="opdvisit.v0/problem_diagnosis/language"></mb-context>
        <mb-context path="opdvisit.v0/problem_diagnosis/encoding"></mb-context>

        <mb-input
          path="opdvisit.v0/medication_order/order:0/medication_item"
          label="Medication item"
        ></mb-input>
        <mb-input
          path="opdvisit.v0/medication_order/order:0/route:0"
          label="Route"
        ></mb-input>
        <mb-input
          path="opdvisit.v0/medication_order/order:0/additional_instruction:0"
          label="Additional instruction"
        ></mb-input>
        <mb-date
          time
          path="opdvisit.v0/medication_order/order:0/order_details/order_start_date_time"
          label="Order start date/time"
        ></mb-date>
        <mb-date
          time
          path="opdvisit.v0/medication_order/order:0/order_details/order_stop_date_time"
          label="Order stop date/time"
        ></mb-date>
        <mb-context
          path="opdvisit.v0/medication_order/order:0/timing"
        ></mb-context>
        <mb-context
          path="opdvisit.v0/medication_order/order:0/action_archetype_id"
        ></mb-context>
        <mb-context path="opdvisit.v0/medication_order/subject"></mb-context>
        <mb-context path="opdvisit.v0/medication_order/narrative"></mb-context>
        <mb-context path="opdvisit.v0/medication_order/language"></mb-context>
        <mb-context path="opdvisit.v0/medication_order/encoding"></mb-context>
        <mb-date
          time
          path="opdvisit.v0/medication_order/expiry_time"
          label="expiry_time"
        ></mb-date>
        <mb-context path="opdvisit.v0/composer"></mb-context>
        <mb-context path="opdvisit.v0/language"></mb-context>
        <mb-context path="opdvisit.v0/territory"></mb-context>
        <mb-context
          path="opdvisit.v0/context/_health_care_facility"
        ></mb-context>
      </mb-form>
    `);
    setTimeout(() => form.handleSubmit());
    const data = await oneEvent(form, 'mb-submit', false);
    // console.log("opdvisit data",data.detail)
    expect(data.detail).to.eql({
      'opdvisit.v0/context/start_time':
        data.detail['opdvisit.v0/context/start_time'],
      'opdvisit.v0/context/setting|code': '238',
      'opdvisit.v0/context/setting|value': 'other care',
      'opdvisit.v0/context/setting|terminology': 'openehr',
      'opdvisit.v0/category|code': '433',
      'opdvisit.v0/category|value': 'event',
      'opdvisit.v0/category|terminology': 'openehr',
      'opdvisit.v0/language|code': 'en',
      'opdvisit.v0/language|terminology': 'ISO_639-1',
      'opdvisit.v0/territory|code': 'IN',
      'opdvisit.v0/territory|terminology': 'ISO_3166-1',
      'opdvisit.v0/composer|name': 'Medblocks UI',
      'opdvisit.v0/context/_health_care_facility|name': 'Medblocks Hospital',
      'opdvisit.v0/context/_health_care_facility|id': '12345',
      'opdvisit.v0/context/_health_care_facility|id_scheme': 'Encounter',
      'opdvisit.v0/context/_health_care_facility|id_namespace': 'FHIR',
    });
  });
  it('should render contexts properly (aarthy.screening.v0)', async () => {
    const form = await fixture<MbForm>(html` <mb-form
      .ctx=${{
        composer: {
          name: 'Sidharth Ramesh',
        },
        health_care_facility: {
          name: 'Aarthy Eye Hospital',
          id: 'Example Encounter ID',
          id_scheme: 'aarthy',
          id_namespace: 'aarthy',
        },
        test_name: 'Blood Sugar Test',
      }}
      overwritectx
    >
      <div class="flex gap-3 flex-col ">
        <mb-context path="aarthy.screening.v0/category" />
        <mb-context path="aarthy.screening.v0/context/start_time" />
        <mb-context path="aarthy.screening.v0/context/setting" />
        <mb-input
          path="aarthy.screening.v0/complaints/presenting_problem:0"
          label="Complaints"
        />
        <mb-context path="aarthy.screening.v0/complaints/subject" />
        <mb-context path="aarthy.screening.v0/complaints/language" />
        <mb-context path="aarthy.screening.v0/complaints/encoding" />
        <h1 class="border bg-gray-200 p-3 mt-2">Problem Diagnosis</h1>
        <div class="px-1 ">
          <div class="my-1 w-1/2">
            <mb-context
              id="oneeye_ctx"
              path="aarthy.screening.v0/medical_history/any_event:0/one_eyed:0/problem_diagnosis_name"
              label="Problem/diagnosis name"
              .bind=${'One eyed'}
            />
            <mb-checkbox
              id="oneeyecheckbox"
              path="aarthy.screening.v0/medical_history/any_event:0/one_eyed:0/presence"
              label="One Eyed"
            />
            <div class="mt-3">
              <mb-duration
                year
                path="aarthy.screening.v0/medical_history/any_event:0/one_eyed:0/onset:0"
              />
            </div>
            <!-- <mb-input
                              path="aarthy.screening.v0/medical_history/any_event:0/one_eyed:0/comment"
                              label="Comment"
                              /> -->
          </div>
          <div class="my-1 w-1/2">
            <mb-context
              path="aarthy.screening.v0/medical_history/any_event:0/hypertension:0/problem_diagnosis_name"
              label="Problem/diagnosis name"
              .bind="Hypertension"
            />
            <mb-checkbox
              path="aarthy.screening.v0/medical_history/any_event:0/hypertension:0/presence"
              label="Hypertension"
            />
            <div class="mt-3 ">
              <mb-duration
                year
                path="aarthy.screening.v0/medical_history/any_event:0/hypertension:0/onset:0"
              />
            </div>
          </div>
          <div class="my-1 w-1/2">
            <mb-context
              path="aarthy.screening.v0/medical_history/any_event:0/diabetes:0/problem_diagnosis_name"
              label="Problem/diagnosis name"
              .bind="Diabetes"
            />
            <mb-checkbox
              path="aarthy.screening.v0/medical_history/any_event:0/diabetes:0/presence"
              label="Diabetes"
            />
            <div class="mt-3">
              <mb-duration
                year
                path="aarthy.screening.v0/medical_history/any_event:0/diabetes:0/onset:0"
              />
            </div>
          </div>
          <div class="my-1 w-1/2">
            <mb-context
              path="aarthy.screening.v0/medical_history/any_event:0/asthma:0/problem_diagnosis_name"
              label="Problem/diagnosis name"
              .bind="Asthma"
            />
            <mb-checkbox
              path="aarthy.screening.v0/medical_history/any_event:0/asthma:0/presence"
              label="Asthma"
            />
            <div class="mt-3">
              <mb-duration
                year
                path="aarthy.screening.v0/medical_history/any_event:0/asthma:0/onset:0"
              />
            </div>
            <!-- <mb-input
                                  path="aarthy.screening.v0/medical_history/any_event:0/asthma:0/comment"
                                  label="Comment"
                              /> -->
          </div>
          <div class="my-2">
            <mb-context
              path="aarthy.screening.v0/medical_history/any_event:0/cardiac_condition:0/problem_diagnosis_name"
              label="Problem/diagnosis name"
              .bind="Cardiac condition"
            />
            <mb-checkbox
              path="aarthy.screening.v0/medical_history/any_event:0/cardiac_condition:0/presence"
              label="Cardiac condition"
            />
            <div class="mt-3 w-1/2 ">
              <mb-duration
                year
                path="aarthy.screening.v0/medical_history/any_event:0/cardiac_condition:0/onset:0"
              />
            </div>
            <!-- <mb-input
                              path="aarthy.screening.v0/medical_history/any_event:0/cardiac_condition:0/comment"
                              label="Comment"
                          /> -->
          </div>
          <div class="mt-6">
            <mb-input
              path="aarthy.screening.v0/adverse_reaction_risk:0/substance"
              label=" Allergy Substance ( if any )"
            />
          </div>
          <mb-context
            path="aarthy.screening.v0/medical_history/any_event:0/time"
          />
          <mb-context path="aarthy.screening.v0/medical_history/subject" />
          <mb-context path="aarthy.screening.v0/medical_history/language" />
          <mb-context path="aarthy.screening.v0/medical_history/encoding" />
        </div>
        <h1 class="border bg-gray-200 p-3 mt-2">Vitals Screening</h1>
        <div class="flex-col px-1">
          <mb-quantity
            class="my-2"
            default="/min"
            path="aarthy.screening.v0/pulse_heart_beat/any_event:0/rate"
            label="Pulse Rate"
          >
            <mb-unit unit="/min" label="/min" min="" max="1000" />
          </mb-quantity>
          <mb-quantity
            class="my-2"
            default="mm[Hg]"
            path="aarthy.screening.v0/blood_pressure/systolic"
            label="Systolic"
          >
            <mb-unit unit="mm[Hg]" label="mm[Hg]" min="" max="1000" />
          </mb-quantity>
          <mb-quantity
            class="my-2"
            default="mm[Hg]"
            path="aarthy.screening.v0/blood_pressure/diastolic"
            label="Diastolic"
          >
            <mb-unit unit="mm[Hg]" label="mm[Hg]" min="" max="1000" />
          </mb-quantity>
        </div>
        <mb-context
          path="aarthy.screening.v0/pulse_heart_beat/any_event:0/time"
        />
        <mb-context path="aarthy.screening.v0/pulse_heart_beat/subject" />
        <mb-context path="aarthy.screening.v0/pulse_heart_beat/language" />
        <mb-context path="aarthy.screening.v0/pulse_heart_beat/encoding" />
        <mb-context path="aarthy.screening.v0/blood_pressure/time" />
        <mb-context path="aarthy.screening.v0/blood_pressure/subject" />
        <mb-context path="aarthy.screening.v0/blood_pressure/language" />
        <mb-context path="aarthy.screening.v0/blood_pressure/encoding" />
        <mb-context
          path="aarthy.screening.v0/laboratory_test_result/any_event:0/test_name"
          label="Test name"
        />
        <h1 class="border bg-gray-200 p-3">Blood Sugar Test</h1>
        <div class="flex-col px-1">
          <mb-context
            path="aarthy.screening.v0/laboratory_test_result/any_event:0/blood_sugar_random/analyte_name"
            label="Analyte name"
            .bind="Blood Sugar ( Random )"
          />
          <mb-context
            path="aarthy.screening.v0/laboratory_test_result/any_event:0/blood_sugar_post_prandial/analyte_name"
            label="Analyte name"
            .bind="Blood Sugar ( Post Prandial )"
          />
          <mb-context
            path="aarthy.screening.v0/laboratory_test_result/any_event:0/blood_sugar_fasting/analyte_name"
            label="Analyte name"
            .bind="Blood Sugar ( Fasting )"
          />
          <mb-quantity
            class="mb-2"
            default="mg/dL"
            path="aarthy.screening.v0/laboratory_test_result/any_event:0/blood_sugar_random/analyte_result:0"
            label="Random"
          >
            <mb-unit unit="mg/dL" label="mg/dL" min="" max="" />
          </mb-quantity>
          <mb-quantity
            class="my-2"
            default="mg/dL"
            path="aarthy.screening.v0/laboratory_test_result/any_event:0/blood_sugar_post_prandial/analyte_result:0"
            label="Post Prandial"
          >
            <mb-unit unit="mg/dL" label="mg/dL" min="" max="" />
          </mb-quantity>
          <mb-quantity
            class="my-2"
            default="mg/dL"
            path="aarthy.screening.v0/laboratory_test_result/any_event:0/blood_sugar_fasting/analyte_result:0"
            label="Fasting"
          >
            <mb-unit unit="mg/dL" label="mg/dL" min="" max="" />
          </mb-quantity>
        </div>
        <mb-context
          path="aarthy.screening.v0/laboratory_test_result/any_event:0/time"
        />
        <mb-context path="aarthy.screening.v0/laboratory_test_result/subject" />
        <mb-context
          path="aarthy.screening.v0/laboratory_test_result/language"
        />
        <mb-context
          path="aarthy.screening.v0/laboratory_test_result/encoding"
        />
        <mb-context
          path="aarthy.screening.v0/adverse_reaction_risk:0/subject"
        />
        <mb-context
          path="aarthy.screening.v0/adverse_reaction_risk:0/language"
        />
        <mb-context
          path="aarthy.screening.v0/adverse_reaction_risk:0/encoding"
        />
        <mb-context path="aarthy.screening.v0/composer" />
        <mb-context path="aarthy.screening.v0/language" />
        <mb-context path="aarthy.screening.v0/territory" />
        <mb-submit id="submit">
          <sl-button>Submit</sl-button>
        </mb-submit>
      </div>
    </mb-form>`);
    const oneEyed = querySelectorDeep('mb-checkbox', form) as MbCheckBox;
    // const ctx = querySelectorDeep('#oneeye_ctx', form) as MbContext;
    oneEyed.data = false;
    const event = new CustomEvent('mb-input', {
      bubbles: true,
      cancelable: true,
    });
    oneEyed.dispatchEvent(event);
    await oneEvent(form, 'mb-input', true);
    const nonNull = form.nonEmptyPaths();
    expect(nonNull).contain(
      'aarthy.screening.v0/medical_history/any_event:0/one_eyed:0/presence'
    );
    setTimeout(() => form.handleSubmit());
    const data = await oneEvent(form, 'mb-submit', true);
    expect(Object.keys(data.detail)).contain(
      'aarthy.screening.v0/medical_history/any_event:0/one_eyed:0/presence'
    );
    expect(
      data.detail[
        'aarthy.screening.v0/medical_history/any_event:0/one_eyed:0/problem_diagnosis_name'
      ]
    ).to.eql('One eyed');
  });
  it('should not populate context on bind back and edit to null', async () => {
    const form = await fixture<MbForm>(` <mb-form
      .ctx=${{
        composer: {
          name: 'Sidharth Ramesh',
        },
        health_care_facility: {
          name: 'Aarthy Eye Hospital',
          id: 'Example Encounter ID',
          id_scheme: 'aarthy',
          id_namespace: 'aarthy',
        },
        test_name: 'Blood Sugar Test',
      }}
    >
      <div class="flex gap-3 flex-col ">
        <mb-context path="aarthy.screening.v0/category" />
        <mb-context path="aarthy.screening.v0/context/start_time" />
        <mb-context path="aarthy.screening.v0/context/setting" />
        <mb-quantity
            class="my-2"
            default="/min"
            path="aarthy.screening.v0/pulse_heart_beat/any_event:0/rate"
            label="Pulse Rate"
          >
            <mb-unit unit="/min" label="/min" min="" max="1000" />
          </mb-quantity>
          <mb-quantity
            class="my-2"
            default="mm[Hg]"
            path="aarthy.screening.v0/blood_pressure/systolic"
            label="Systolic"
          >
            <mb-unit unit="mm[Hg]" label="mm[Hg]" min="" max="1000" />
          </mb-quantity>
          <mb-quantity
            class="my-2"
            default="mm[Hg]"
            path="aarthy.screening.v0/blood_pressure/diastolic"
            label="Diastolic"
          >
            <mb-unit unit="mm[Hg]" label="mm[Hg]" min="" max="1000" />
          </mb-quantity>
        </div>
        <mb-context
          path="aarthy.screening.v0/pulse_heart_beat/any_event:0/time"
        />
        <mb-context path="aarthy.screening.v0/pulse_heart_beat/subject" />
        <mb-context path="aarthy.screening.v0/pulse_heart_beat/language" />
        <mb-context path="aarthy.screening.v0/pulse_heart_beat/encoding" />
        <mb-context path="aarthy.screening.v0/blood_pressure/time" />
        <mb-context path="aarthy.screening.v0/blood_pressure/subject" />
        <mb-context path="aarthy.screening.v0/blood_pressure/language" />
        <mb-context path="aarthy.screening.v0/blood_pressure/encoding" />
        <mb-context path="aarthy.screening.v0/composer" />
        <mb-context path="aarthy.screening.v0/language" />
        <mb-context path="aarthy.screening.v0/territory" />
        <mb-submit id="submit">
          <sl-button>Submit</sl-button>
        </mb-submit>
      </div>
    </mb-form>`);

    form.import({
      'aarthy.screening.v0/category|code': '433',
      'aarthy.screening.v0/category|value': 'event',
      'aarthy.screening.v0/category|terminology': 'openehr',
      'aarthy.screening.v0/context/start_time': '2022-06-14T06:16:48.223Z',
      'aarthy.screening.v0/context/setting|code': '238',
      'aarthy.screening.v0/context/setting|value': 'other care',
      'aarthy.screening.v0/context/setting|terminology': 'openehr',
      'aarthy.screening.v0/pulse_heart_beat/any_event:0/rate|unit': '/min',
      'aarthy.screening.v0/pulse_heart_beat/any_event:0/rate|magnitude': 67,
      'aarthy.screening.v0/blood_pressure/systolic|unit': 'mm[Hg]',
      'aarthy.screening.v0/blood_pressure/systolic|magnitude': 140,
      'aarthy.screening.v0/blood_pressure/diastolic|unit': 'mm[Hg]',
      'aarthy.screening.v0/blood_pressure/diastolic|magnitude': 99,
      'aarthy.screening.v0/pulse_heart_beat/any_event:0/time':
        '2022-06-14T06:16:48.224Z',
      'aarthy.screening.v0/pulse_heart_beat/language|code': 'en',
      'aarthy.screening.v0/pulse_heart_beat/language|terminology': 'ISO_639-1',
      'aarthy.screening.v0/pulse_heart_beat/encoding|code': 'UTF-8',
      'aarthy.screening.v0/pulse_heart_beat/encoding|terminology':
        'IANA_character-sets',
      'aarthy.screening.v0/blood_pressure/time': '2022-06-14T06:16:48.224Z',
      'aarthy.screening.v0/blood_pressure/language|code': 'en',
      'aarthy.screening.v0/blood_pressure/language|terminology': 'ISO_639-1',
      'aarthy.screening.v0/blood_pressure/encoding|code': 'UTF-8',
      'aarthy.screening.v0/blood_pressure/encoding|terminology':
        'IANA_character-sets',
      'aarthy.screening.v0/composer|name': 'Sidharth',
      'aarthy.screening.v0/language|code': 'en',
      'aarthy.screening.v0/language|terminology': 'ISO_639-1',
      'aarthy.screening.v0/territory|code': 'IN',
      'aarthy.screening.v0/territory|terminology': 'ISO_3166-1',
    });
    const pulse = querySelectorDeep('mb-quantity', form) as MbInput;
    // const ctx = querySelectorDeep('#oneeye_ctx', form) as MbContext;
    const slInput = querySelectorDeep('sl-input', pulse) as SlInput;
    slInput.value = '';
    const event = new CustomEvent('sl-input', {
      bubbles: true,
      cancelable: true,
    });
    slInput.dispatchEvent(event);
    await oneEvent(form, 'mb-input', true);
    setTimeout(() => form.handleSubmit());
    const data = await oneEvent(form, 'mb-submit', true);
    expect(data.detail).to.eql({
      'aarthy.screening.v0/category|code': '433',
      'aarthy.screening.v0/category|value': 'event',
      'aarthy.screening.v0/category|terminology': 'openehr',
      'aarthy.screening.v0/context/start_time':
        data.detail['aarthy.screening.v0/context/start_time'],
      'aarthy.screening.v0/context/setting|code': '238',
      'aarthy.screening.v0/context/setting|value': 'other care',
      'aarthy.screening.v0/context/setting|terminology': 'openehr',
      'aarthy.screening.v0/blood_pressure/systolic|unit': 'mm[Hg]',
      'aarthy.screening.v0/blood_pressure/systolic|magnitude': 140,
      'aarthy.screening.v0/blood_pressure/diastolic|unit': 'mm[Hg]',
      'aarthy.screening.v0/blood_pressure/diastolic|magnitude': 99,
      'aarthy.screening.v0/blood_pressure/time':
        data.detail['aarthy.screening.v0/blood_pressure/time'],
      'aarthy.screening.v0/blood_pressure/language|code': 'en',
      'aarthy.screening.v0/blood_pressure/language|terminology': 'ISO_639-1',
      'aarthy.screening.v0/blood_pressure/encoding|code': 'UTF-8',
      'aarthy.screening.v0/blood_pressure/encoding|terminology':
        'IANA_character-sets',
      'aarthy.screening.v0/composer|name': 'Sidharth',
      'aarthy.screening.v0/language|code': 'en',
      'aarthy.screening.v0/language|terminology': 'ISO_639-1',
      'aarthy.screening.v0/territory|code': 'IN',
      'aarthy.screening.v0/territory|terminology': 'ISO_3166-1',
    });
  });

  it('should not export if data is empty string', async () => {
    const form = await fixture<MbForm>(html`
      <mb-form>
        <mb-input path="input1" data=""></mb-input>
        <mb-input path="input2" data="hello there"></mb-input>
      </mb-form>
    `);

    setTimeout(() => form.handleSubmit());
    const data = await oneEvent(form, 'mb-submit', true);
    expect(data.detail).to.eql({ input2: 'hello there' });
  });

  // if prefix of path starts with same prefix of another path, then data should not be added to both
  it('path starts with similar prefix, should not bind data for other elements', async () => {
    const form = await fixture<MbForm>(html`
      <mb-form>
        <mb-search-multiple path="test/path:0/name" repeatprefix="test/path" repeatsuffix="name" label="Hello there"></base-ehr>
        <mb-search-multiple path="test/path1:0/name" repeatprefix="test/path1" repeatsuffix="name" label="Hello there"></base-ehr>
      </mb-form>
    `);
    form.import({ 'test/path1:0/name': 'test value1' });
    await elementUpdated(form);

    expect(form.data).to.eql({
      'test/path:0/name': [],
      'test/path1:0/name': ['test value1'],
    });
    expect(form.export()).to.eql({ 'test/path1:0/name': 'test value1' });
  });
});
