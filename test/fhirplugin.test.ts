import { expect, oneEvent, fixture, html } from '@open-wc/testing';
import type MbForm from '../src/medblocks/form/fhirForm';
import '../medblocks';

describe('FHIR Plugin', () => {
  it('deserialized properly', async () => {
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
          <mb-buttons datatype="code" label="Gender" path="gender">
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
              datatype="CodableConcept"
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
    const data = {
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
    const parsed = form.parse(data);
    expect(parsed).to.eql({
      'contact[0].relationship[0]': {
        code: 'mother',
        value: 'Mother',
        terminology: 'local',
      },
      resourceType: 'Patient',
      'name[0].given[0]': 'Sidharth R',
      'telecom[0].value': '9585841964',
      'identifier[0].value': '123445',
      'identifier[0].system': 'aadhar',
      'address[0].text': 'Manipal',
      'contact[0].name.given[0]': 'Uma Maheswari',
      'contact[0].telecom[0].value': '9944941964',
      gender: {
        terminology: 'local',
        code: 'male',
      },
      birthDate: '1997-09-08',
    });
  });
  it('checking bind in context', async () => {
    const form = await fixture<MbForm>(html`
      <mb-fhir-form
        .ctx=${{ resourceType: 'Patient', 'identifier[0].system': 'aadhar' }}
      >
        <mb-context path="resourceType"></mb-context>
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
          <mb-input
            label="Phone number"
            path="telecom[0].value"
            data="1234567890"
          ></mb-input>
          <mb-context path="telecom[0].system" .bind=${'phone'}></mb-context>
          <mb-input
            label="Email"
            path="telecom[1].value"
            data="1234567890"
          ></mb-input>
          <mb-context path="telecom[1].system" .bind=${'email'}></mb-context>
        </div>
        <div class="field">
          <mb-input
            path="identifier[0].value"
            label="Aadhar card number"
            data="12345"
          ></mb-input>
          <mb-context path="identifier[0].system"></mb-context>
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

    setTimeout(() => form.handleSubmit());
    const data = await oneEvent(form, 'mb-submit', true);
    expect(data.detail).to.eql({
      resourceType: 'Patient',
      identifier: [
        {
          system: 'aadhar',
          value: '12345',
        },
      ],
      telecom: [
        {
          system: 'phone',
          value: '1234567890',
        },
        {
          system: 'email',
          value: '1234567890',
        },
      ],
    });
  });
  it('checking bind in context2', async () => {
    const form = await fixture<MbForm>(html`
      <mb-fhir-form
        .ctx=${{ resourceType: 'Patient', 'identifier[0].system': 'aadhar' }}
      >
        <mb-context path="resourceType"></mb-context>
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
          <mb-context path="telecom[0].system" .bind=${'phone'}></mb-context>
          <mb-input
            label="Email"
            path="telecom[1].value"
            data="1234567890"
          ></mb-input>
          <mb-context path="telecom[1].system" .bind=${'email'}></mb-context>
        </div>
        <div class="field">
          <mb-input
            path="identifier[0].value"
            label="Aadhar card number"
            data="12345"
          ></mb-input>
          <mb-context path="identifier[0].system"></mb-context>
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

    setTimeout(() => form.handleSubmit());
    const data = await oneEvent(form, 'mb-submit', true);
    console.log(data.detail);
    expect(data.detail).to.eql({
      resourceType: 'Patient',
      identifier: [
        {
          system: 'aadhar',
          value: '12345',
        },
      ],
      telecom: [
        undefined,
        {
          system: 'email',
          value: '1234567890',
        },
      ],
    });
  });
});
