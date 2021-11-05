import { expect } from '@open-wc/testing'
import { elementUpdated, fixture, oneEvent } from '@open-wc/testing-helpers'
import { html } from 'lit-html'
import { querySelectorDeep } from 'query-selector-shadow-dom'
import MbForm from '../src/medblocks/form/form'
import '../medblocks'
import MbPercent from '../src/medblocks/proportion/percent'

describe('Form e2e', ()=>{
    it('should set the data property properly', async ()=>{
        const form = await fixture<MbForm>(
            html`
            <mb-form>
                <mb-input path="test/1"></mb-input>
            </mb-form>
            `
        )
        form.data = {'test/1': 'Hello there'}
        const e: any = await oneEvent(form, 'mb-input')
        expect(e.target.data).to.eql({'test/1': 'Hello there'})
        await elementUpdated(form)
        const input = querySelectorDeep('input') as HTMLInputElement;
        expect(input.value).to.eq('Hello there')
    })

    it('should get data property from form', async ()=>{
        const form = await fixture<MbForm>(
            html`
            <mb-form>
                <mb-input path="test/1" .data=${"Hello test!"}></mb-input>
            </mb-form>
            `)
        expect(form.data).to.eql({'test/1': 'Hello test!'})
        
    })

    it('should serialize to openEHR composition', async ()=>{
        
    })

    it('should deserialize from openEHR composition', async ()=>{

    })

    it('should bind to the parsed FHIR data', async ()=>{
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
            <mb-input
              label="Address"
              textarea
              path="address[0].text"
            ></mb-input>
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
        `)
        const resource = {
            "address": [
                {
                    "text": "Manipal"
                }
            ],
            "meta": {
                "lastUpdated": "2021-05-19T08:35:52.079131Z",
                "createdAt": "2021-05-19T08:35:52.079131Z",
                "versionId": "19"
            },
            "name": [
                {
                    "given": [
                        "Sidharth R"
                    ]
                }
            ],
            "birthDate": "1997-09-08",
            "resourceType": "Patient",
            "id": "c8b0f871-98ed-4a5b-a977-cfa5bf0417f7",
            "identifier": [
                {
                    "value": "123445",
                    "system": "aadhar"
                }
            ],
            "telecom": [
                {
                    "value": "9585841964"
                }
            ],
            "gender": "male",
            "contact": [
                {
                    "name": {
                        "given": [
                            "Uma Maheswari"
                        ]
                    },
                    "telecom": [
                        {
                            "value": "9944941964"
                        }
                    ],
                    "relationship": [
                        {
                            "text": "Mother",
                            "coding": [
                                {
                                    "code": "mother",
                                    "system": "local",
                                    "display": "Mother"
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        // form.data = resource
        const parsed = form.parse(resource)
        form.data = parsed
        await elementUpdated(form)
        expect(form.data).to.eql(parsed)
    })
    it('should serialize to FHIR resource', ()=>{
        
    })

    it('should serialize from FHIR resource', ()=>{

    })
    it('NCD template data loading', async ()=>{
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
          "ncd/body_temperature/any_event:0/temperature|magnitude": 32.0,
          "ncd/body_temperature/any_event:0/temperature|unit": "Cel",
          "ncd/body_temperature/any_event:0/time": "2021-11-05T04:54:16.936Z",
          "ncd/body_temperature/language|code": "en",
          "ncd/body_temperature/language|terminology": "ISO_639-1",
          "ncd/body_temperature/encoding|code": "UTF-8",
          "ncd/body_temperature/encoding|terminology": "IANA_character-sets",
          "ncd/blood_pressure/any_event:0/systolic|magnitude": 120.0,
          "ncd/blood_pressure/any_event:0/systolic|unit": "mm[Hg]",
          "ncd/blood_pressure/any_event:0/diastolic|magnitude": 80.0,
          "ncd/blood_pressure/any_event:0/diastolic|unit": "mm[Hg]",
          "ncd/blood_pressure/any_event:0/time": "2021-11-05T04:54:16.936Z",
          "ncd/blood_pressure/language|code": "en",
          "ncd/blood_pressure/language|terminology": "ISO_639-1",
          "ncd/blood_pressure/encoding|code": "UTF-8",
          "ncd/blood_pressure/encoding|terminology": "IANA_character-sets",
          "ncd/pulse_heart_beat/any_event:0/rate|magnitude": 90.0,
          "ncd/pulse_heart_beat/any_event:0/rate|unit": "/min",
          "ncd/pulse_heart_beat/any_event:0/regularity|code": "at0006",
          "ncd/pulse_heart_beat/any_event:0/regularity|value": "Regular",
          "ncd/pulse_heart_beat/any_event:0/regularity|terminology": "local",
          "ncd/pulse_heart_beat/any_event:0/time": "2021-11-05T05:11:05.497Z",
          "ncd/pulse_heart_beat/language|code": "en",
          "ncd/pulse_heart_beat/language|terminology": "ISO_639-1",
          "ncd/pulse_heart_beat/encoding|code": "UTF-8",
          "ncd/pulse_heart_beat/encoding|terminology": "IANA_character-sets",
          "ncd/height_length/any_event:0/height_length|magnitude": 177.0,
          "ncd/height_length/any_event:0/height_length|unit": "cm",
          "ncd/height_length/any_event:0/time": "2021-11-05T05:11:05.498Z",
          "ncd/height_length/language|code": "en",
          "ncd/height_length/language|terminology": "ISO_639-1",
          "ncd/height_length/encoding|code": "UTF-8",
          "ncd/height_length/encoding|terminology": "IANA_character-sets",
          "ncd/body_weight/any_event:0/weight|magnitude": 77.0,
          "ncd/body_weight/any_event:0/weight|unit": "kg",
          "ncd/body_weight/any_event:0/time": "2021-11-05T05:11:05.498Z",
          "ncd/body_weight/language|code": "en",
          "ncd/body_weight/language|terminology": "ISO_639-1",
          "ncd/body_weight/encoding|code": "UTF-8",
          "ncd/body_weight/encoding|terminology": "IANA_character-sets",
          "ncd/waist_circumference/any_event:0/waist_circumference|magnitude": 166.0,
          "ncd/waist_circumference/any_event:0/waist_circumference|unit": "cm",
          "ncd/waist_circumference/any_event:0/time": "2021-11-05T05:11:05.498Z",
          "ncd/waist_circumference/language|code": "en",
          "ncd/waist_circumference/language|terminology": "ISO_639-1",
          "ncd/waist_circumference/encoding|code": "UTF-8",
          "ncd/waist_circumference/encoding|terminology": "IANA_character-sets",
          "ncd/hip_circumference/hip_circumference|magnitude": 134.0,
          "ncd/hip_circumference/hip_circumference|unit": "cm",
          "ncd/hip_circumference/time": "2021-11-05T05:11:05.498Z",
          "ncd/hip_circumference/language|code": "en",
          "ncd/hip_circumference/language|terminology": "ISO_639-1",
          "ncd/hip_circumference/encoding|code": "UTF-8",
          "ncd/hip_circumference/encoding|terminology": "IANA_character-sets",
          "ncd/pulse_oximetry/any_event:0/spo|numerator": 2.0,
          "ncd/pulse_oximetry/any_event:0/spo|denominator": 100.0,
          "ncd/pulse_oximetry/any_event:0/spo|type": 2,
          "ncd/pulse_oximetry/any_event:0/spo": 0.02,
          "ncd/pulse_oximetry/any_event:0/time": "2021-11-05T05:11:05.498Z",
          "ncd/pulse_oximetry/language|code": "en",
          "ncd/pulse_oximetry/language|terminology": "ISO_639-1",
          "ncd/pulse_oximetry/encoding|code": "UTF-8",
          "ncd/pulse_oximetry/encoding|terminology": "IANA_character-sets",
          "ncd/laboratory_test_result/any_event:0/test_name": "Blood Test",
          "ncd/laboratory_test_result/any_event:0/blood_glucose/blood_glucose_level|magnitude": 109.0,
          "ncd/laboratory_test_result/any_event:0/blood_glucose/blood_glucose_level|unit": "mmol/dl",
          "ncd/laboratory_test_result/any_event:0/haemoglobin/haemoglobin|magnitude": 11.0,
          "ncd/laboratory_test_result/any_event:0/haemoglobin/haemoglobin|unit": "g/dl",
          "ncd/laboratory_test_result/any_event:0/cholesterol/cholesterol|magnitude": 100.0,
          "ncd/laboratory_test_result/any_event:0/cholesterol/cholesterol|unit": "mg/dl",
          "ncd/laboratory_test_result/any_event:0/uric_acid/uric_acid|magnitude": 35.0,
          "ncd/laboratory_test_result/any_event:0/uric_acid/uric_acid|unit": "mg/dl",
          "ncd/laboratory_test_result/any_event:0/blood_group/analyte_name|code": "882-1",
          "ncd/laboratory_test_result/any_event:0/blood_group/analyte_name|value": "ABO and Rh group [Type] in Blood",
          "ncd/laboratory_test_result/any_event:0/blood_group/analyte_name|terminology": "LOINC",
          "ncd/laboratory_test_result/any_event:0/blood_group/blood_group|code": "278147001",
          "ncd/laboratory_test_result/any_event:0/blood_group/blood_group|value": "O +ve",
          "ncd/laboratory_test_result/any_event:0/blood_group/blood_group|terminology": "SNOMED-CT",
          "ncd/laboratory_test_result/any_event:0/time": "2021-11-05T04:50:52.727Z",
          "ncd/laboratory_test_result/language|code": "en",
          "ncd/laboratory_test_result/language|terminology": "ISO_639-1",
          "ncd/laboratory_test_result/encoding|code": "UTF-8",
          "ncd/laboratory_test_result/encoding|terminology": "IANA_character-sets",
          "ncd/urinalysis/point_in_time:0/glucose|code": "at0117",
          "ncd/urinalysis/point_in_time:0/glucose|value": "1+",
          "ncd/urinalysis/point_in_time:0/glucose|ordinal": 3,
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
      const mbPercent = document.getElementById('percentage') as MbPercent;
      expect(mbPercent.data).to.eql({ _root: 0.02, numerator: 2, denominator: 100, type: 2 })
    })
})