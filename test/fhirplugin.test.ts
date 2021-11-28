import { expect } from '@open-wc/testing';
import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit-html';
import MbForm from '../src/medblocks/form/fhirForm';
import '../medblocks';

describe('FHIR Plugin', () => {
  it('deserialized properly', async () => {
    const form = await fixture<MbForm>(
      html`
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
      `
    );
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
  // it('checking bind in context', async () => {
  //   const form = await fixture<MbForm>(
  //     html`
  //       <mb-fhir-form >
  //         <mb-context path="resourceType" data="Patient" />
  //         <div class="sm:grid sm:grid-flow-col sm:gap-4">
  //           <mb-input required label="First Name" path="name[0].given[0]" />
  //           <mb-input label="Last Name" path="name[0].family" />
  //         </div>
  //         <mb-date required label="Date of birth" path="birthDate" />
  //         <mb-buttons required datatype="code" label="Gender" path="gender">
  //           <mb-option value="male" label="Male" />
  //           <mb-option value="female" label="Female" />
  //           <mb-option value="other" label="Other" />
  //         </mb-buttons>
  //         <mb-context path="telecom[0].system" .bind=${"phone"} ></mb-context>
  //         <mb-input
  //           type="number"
  //           min="1000000000"
  //           max="9999999999"
  //           label="Phone number"
  //           path="telecom[0].value"
  //         />
  //         <mb-context path="telecom[1].system" .bind=${"email"} ></mb-context>

  //         <mb-input type="email" label="Email" path="telecom[1].value" />
  //         <mb-buttons
  //           datatype="CodableConcept"
  //           label="Marital Status"
  //           path="maritalStatus"
  //           terminology="http://terminology.hl7.org/CodeSystem/v3-MaritalStatus"
  //         >
  //           <mb-option value="M" label="Married" />
  //           <mb-option value="U" label="Unmarried" />
  //         </mb-buttons>
  //         <mb-input
  //           path="identifier[0].value"
  //           type="number"
  //           min="100000000000"
  //           max="999999999999"
  //           label="Aadhar number"
  //         />
  //         <mb-context
  //           path="identifier[0].system"
  //           .bind=${"https://myaadhaar.uidai.gov.in/"}
  //         ></mb-context>
  //         <mb-input label="Address" textarea path="address[0].text" />
  //         <mb-input label="Attendant name" path="contact[0].name.given[0]" />
  //         <mb-select
  //           label="Attendant relationship"
  //           path="contact[0].relationship[0]"
  //           datatype="CodableConcept"
  //           terminology="http://hl7.org/fhir/ValueSet/patient-contactrelationship"
  //         >
  //           <mb-option value="mother" label="Mother" />
  //           <mb-option value="father" label="Father" />
  //           <mb-option value="brother" label="Brother" />
  //           <mb-option value="sister" label="Sister" />
  //           <mb-option value="husband" label="Husband" />
  //           <mb-option value="wife" label="Wife" />
  //           <mb-option value="daughter" label="Daughter" />
  //           <mb-option value="son" label="Son" />
  //           <mb-option value="neighbor" label="Neighbor" />
  //           <mb-option value="other" label="Other" />
  //         </mb-select>
  //         <mb-input
  //           type="number"
  //           min="1000000000"
  //           max="9999999999"
  //           label="Attendant contact number"
  //           path="contact[0].telecom[0].value"
  //         />
  //       </mb-fhir-form>
  //     `
  //   );
  //   const data = {
  //     "resourceType": "Patient",
  //     "name": [
  //         {
  //             "given": [
  //                 "Athul"
  //             ],
  //             "family": "K Nair"
  //         }
  //     ],
  //     "birthDate": "1998-09-24",
  //     "gender": "male",
  //     "telecom": [
  //         {
  //             "system": "phone",
  //             "value": "8921053118"
  //         },
  //         {
  //             "system": "email",
  //             "value": "athul2639@gmai.com"
  //         }
  //     ],
  //     "maritalStatus": {
  //         "text": "Unmarried",
  //         "coding": [
  //             {
  //                 "system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  //                 "code": "U",
  //                 "display": "Unmarried"
  //             }
  //         ]
  //     },
  //     "identifier": [
  //         {
  //             "value": "392108084204",
  //             "system":"https://myaadhaar.uidai.gov.in/"
  //         }
  //     ],
  //     "address": [
  //         {
  //             "text": "Kizhakkeparambil (H)\nKuppayakode (PO)\nKozhikode"
  //         }
  //     ],
  //     "contact": [
  //         {
  //             "name": {
  //                 "given": [
  //                     "Muralidharan"
  //                 ]
  //             },
  //             "relationship": [
  //                 {
  //                     "text": "Father",
  //                     "coding": [
  //                         {
  //                             "system": "http://hl7.org/fhir/ValueSet/patient-contactrelationship",
  //                             "code": "father",
  //                             "display": "Father"
  //                         }
  //                     ]
  //                 }
  //             ],
  //             "telecom": [
  //                 {
  //                     "value": "9496058861"
  //                 }
  //             ]
  //         }
  //     ]
  // };
  // const parsed = form.parse(data);
  //   expect(parsed).to.eq({
  //     "resourceType": "Patient",
  //     "name[0].given[0]": "Athul",
  //     "name[0].family": "K Nair",
  //     "birthDate": "1998-09-24",
  //     "gender": {
  //         "terminology": "local",
  //         "code": "male"
  //     },
  //     "telecom[0].system": "phone",
  //     "telecom[0].value": "8921053118",
  //     "telecom[1].system": "email",
  //     "telecom[1].value": "athul2639@gmai.com",
  //     "maritalStatus": {
  //         "terminology": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  //         "code": "U",
  //         "value": "Unmarried"
  //     },
  //     "identifier[0].value": "392108084204",
  //     "identifier[0].system": "https://myaadhaar.uidai.gov.in/",
  //     "address[0].text": "Kizhakkeparambil (H)\nKuppayakode (PO)\nKozhikode",
  //     "contact[0].name.given[0]": "Muralidharan",
  //     "contact[0].relationship[0]": {
  //         "terminology": "http://hl7.org/fhir/ValueSet/patient-contactrelationship",
  //         "code": "father",
  //         "value": "Father"
  //     },
  //     "contact[0].telecom[0].value": "9496058861"
  // });
  // });
});
