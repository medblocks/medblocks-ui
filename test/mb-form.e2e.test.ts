import { expect } from '@open-wc/testing'
import { elementUpdated, fixture, oneEvent } from '@open-wc/testing-helpers'
import { html } from 'lit-html'
import { querySelectorDeep } from 'query-selector-shadow-dom'
import MbForm from '../src/medblocks/form/form'
import '../medblocks'

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
        form.data = resource
        const parsed = form.parse(resource)
        form.data = parsed
        await elementUpdated(form)
        expect(form.data).to.eql(parsed)
    })
    it('should serialize to FHIR resource', ()=>{
        
    })

    it('should serialize from FHIR resource', ()=>{

    })
})