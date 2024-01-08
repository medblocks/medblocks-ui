// MbDropdown, MbMultimedia are not supported
// eslint-disable-next-line no-use-before-define
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createRoot } from 'react-dom/client';
import {
  MbBoolean,
  MbButton,
  MbButtonMultiple,
  MbCheckBox,
  MbContext,
  MbCount,
  MbDate,
  MbDuration,
  MbFilter,
  MbForm,
  MbInput,
  MbInputMultiple,
  MbOption,
  MbPercent,
  MbProportion,
  MbQuantity,
  MbRepeatableSimple,
  MbSearch,
  MbSearchMultiple,
  MbSelect,
  MbSubmit,
  MbTextSelect,
  MbUnit,
} from '../src/react/index';

export const TestRoot = () => {
  const handleSubmit = e => {
    e.preventDefault();
    const formData = e.detail;
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    };
    fetch(
      'http://localhost:8081/ehrbase/rest/ecis/v1/composition?ehrId=756fdbd5-288a-4f51-88ce-1428300dde40&templateId=doctor_notes_ignite.v0&format=FLAT',
      options
    )
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
  };
  return (
    <MbForm onMbSubmit={handleSubmit}>
      <MbContext path="doctor_notes_ignite.v0/category"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/context/start_time"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/context/setting"></MbContext>
      <MbInput
        path="doctor_notes_ignite.v0/reason_for_encounter/contact_type:0"
        label="Contact type"
      ></MbInput>
      <MbInputMultiple
        path="doctor_notes_ignite.v0/reason_for_encounter/presenting_problem"
        label="Presenting problem"
      ></MbInputMultiple>
      <MbContext path="doctor_notes_ignite.v0/reason_for_encounter/subject"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/reason_for_encounter/language"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/reason_for_encounter/encoding"></MbContext>
      <MbInput
        path="doctor_notes_ignite.v0/story_history/any_event:0/story:0"
        label="Story"
      ></MbInput>
      <MbSearch
        path="doctor_notes_ignite.v0/story_history/any_event:0/symptom_sign/symptom_sign_name"
        label="Symptom/Sign name"
      >
        <MbFilter label="Findings" value="^181000271107 | (finding) |" />
      </MbSearch>
      <MbDate
        time
        path="doctor_notes_ignite.v0/story_history/any_event:0/symptom_sign/episode_onset"
        label="Episode onset"
      ></MbDate>
      <MbDuration
        year
        month
        hour
        path="doctor_notes_ignite.v0/story_history/any_event:0/symptom_sign/episode_duration"
        label="Episode duration"
      ></MbDuration>
      <MbSelect
        path="doctor_notes_ignite.v0/story_history/any_event:0/symptom_sign/severity_category"
        label="Severity category"
        terminology="local"
      >
        <MbOption value="at0023" label="Mild"></MbOption>
        <MbOption value="at0024" label="Moderate"></MbOption>
        <MbOption value="at0025" label="Severe"></MbOption>
      </MbSelect>
      <MbCount
        path="doctor_notes_ignite.v0/story_history/any_event:0/symptom_sign/number_of_previous_episodes"
        label="Number of previous episodes"
      ></MbCount>
      <MbContext path="doctor_notes_ignite.v0/story_history/any_event:0/time"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/story_history/subject"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/story_history/language"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/story_history/encoding"></MbContext>
      <MbInput
        path="doctor_notes_ignite.v0/problem_diagnosis:0/problem_diagnosis_name"
        label="Problem/Diagnosis name"
      ></MbInput>
      <MbButtonMultiple
        path="doctor_notes_ignite.v0/problem_diagnosis:0/diagnostic_certainty"
        label="Diagnostic certainty"
        terminology="local"
      >
        <MbOption value="at0074" label="Suspected"></MbOption>
        <MbOption value="at0076" label="Confirmed"></MbOption>
      </MbButtonMultiple>
      <MbContext path="doctor_notes_ignite.v0/problem_diagnosis:0/subject"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/problem_diagnosis:0/language"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/problem_diagnosis:0/encoding"></MbContext>
      <MbInput
        path="doctor_notes_ignite.v0/physical_examination_findings:0/any_event:0/description"
        label="Description"
      ></MbInput>
      <MbInput
        path="doctor_notes_ignite.v0/physical_examination_findings:0/any_event:0/symptom_sign/symptom_sign_name"
        label="Symptom/Sign name"
      ></MbInput>
      <MbDate
        time
        path="doctor_notes_ignite.v0/physical_examination_findings:0/any_event:0/symptom_sign/episode_onset/date_time_value"
        label="Episode onset"
      ></MbDate>
      <MbDate
        time
        path="doctor_notes_ignite.v0/physical_examination_findings:0/any_event:0/symptom_sign/episode_onset/interval<dv_date_time>_value/lower"
        label="lower"
      ></MbDate>
      <MbDate
        time
        path="doctor_notes_ignite.v0/physical_examination_findings:0/any_event:0/symptom_sign/episode_onset/interval<dv_date_time>_value/upper"
        label="upper"
      ></MbDate>
      <MbButton
        path="doctor_notes_ignite.v0/physical_examination_findings:0/any_event:0/symptom_sign/severity_category"
        label="Severity category"
        terminology="local"
      >
        <MbOption value="at0023" label="Mild"></MbOption>
        <MbOption value="at0024" label="Moderate"></MbOption>
        <MbOption value="at0025" label="Severe"></MbOption>
      </MbButton>
      <MbContext path="doctor_notes_ignite.v0/physical_examination_findings:0/any_event:0/time"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/physical_examination_findings:0/subject"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/physical_examination_findings:0/language"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/physical_examination_findings:0/encoding"></MbContext>
      <MbInput
        path="doctor_notes_ignite.v0/care_plan:0/care_plan_name"
        label="Care Plan Name"
      ></MbInput>
      <MbInput
        path="doctor_notes_ignite.v0/care_plan:0/description"
        label="Description"
      ></MbInput>
      <MbContext path="doctor_notes_ignite.v0/care_plan:0/subject"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/care_plan:0/language"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/care_plan:0/encoding"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/care_plan:0/time"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/care_plan:0/ism_transition/careflow_step"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/care_plan:0/ism_transition/current_state"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/care_plan:0/ism_transition/transition"></MbContext>
      <MbSearchMultiple
        path="doctor_notes_ignite.v0/admission_reason:0/current_activity:0/service_name"
        label="Service name"
      ></MbSearchMultiple>
      <MbInput
        path="doctor_notes_ignite.v0/admission_reason:0/current_activity:0/reason_for_request:0"
        label="Reason for request"
      ></MbInput>
      <MbTextSelect
        path="doctor_notes_ignite.v0/admission_reason:0/current_activity:0/urgency"
        label="Urgency"
        terminology="local"
      >
        <MbOption value="at0136" label="Emergency"></MbOption>
        <MbOption value="at0137" label="Urgent"></MbOption>
        <MbOption value="at0138" label="Routine"></MbOption>
      </MbTextSelect>
      <MbContext path="doctor_notes_ignite.v0/admission_reason:0/current_activity:0/timing"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/admission_reason:0/current_activity:0/action_archetype_id"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/admission_reason:0/subject"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/admission_reason:0/narrative"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/admission_reason:0/language"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/admission_reason:0/encoding"></MbContext>
      <MbDate
        time
        path="doctor_notes_ignite.v0/admission_reason:0/expiry_time"
        label="expiry_time"
      ></MbDate>
      <MbInput
        path="doctor_notes_ignite.v0/service_request/current_activity:0/service_name"
        label="Service name"
      ></MbInput>
      <MbContext path="doctor_notes_ignite.v0/service_request/current_activity:0/timing"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/service_request/current_activity:0/action_archetype_id"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/service_request/subject"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/service_request/narrative"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/service_request/language"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/service_request/encoding"></MbContext>
      <MbDate
        time
        path="doctor_notes_ignite.v0/service_request/expiry_time"
        label="expiry_time"
      ></MbDate>
      <MbInput
        path="doctor_notes_ignite.v0/medication_order/order:0/medication_item"
        label="Medication item"
      ></MbInput>
      <MbInput
        path="doctor_notes_ignite.v0/medication_order/order:0/medication/name"
        label="Medication Name"
      ></MbInput>
      <MbInput
        path="doctor_notes_ignite.v0/medication_order/order:0/medication/form:0"
        label="Form"
      ></MbInput>
      <MbQuantity
        default=""
        path="doctor_notes_ignite.v0/medication_order/order:0/dosage/dose"
        label="Dose"
      ></MbQuantity>
      <MbInput
        path="doctor_notes_ignite.v0/medication_order/order:0/dosage/timing_-_daily/timing_description"
        label="Timing description"
      ></MbInput>
      <MbInput
        path="doctor_notes_ignite.v0/medication_order/order:0/comment"
        label="Comment"
      ></MbInput>
      <MbContext path="doctor_notes_ignite.v0/medication_order/order:0/timing"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/medication_order/order:0/action_archetype_id"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/medication_order/subject"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/medication_order/narrative"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/medication_order/language"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/medication_order/encoding"></MbContext>
      <MbDate
        time
        path="doctor_notes_ignite.v0/medication_order/expiry_time"
        label="expiry_time"
      ></MbDate>
      <MbCheckBox
        path="doctor_notes_ignite.v0/problem_diagnosis_screening_questionnaire/any_event:0/diagnosed_with_covid_19_or_influenza_in_the_past_twelve_months"
        label="Diagnosed with COVID 19 or Influenza in the past twelve months?"
      >
        <MbOption value="1" label="YES"></MbOption>
        <MbOption value="2" label="NO"></MbOption>
        <MbOption value="3" label="UNKNOWN"></MbOption>
      </MbCheckBox>
      <MbBoolean
        path="doctor_notes_ignite.v0/problem_diagnosis_screening_questionnaire/any_event:0/any_problems_or_diagnoses:0"
        label="Any problems or diagnoses?"
      ></MbBoolean>
      <MbInput
        path="doctor_notes_ignite.v0/problem_diagnosis_screening_questionnaire/any_event:0/specific_problem_or_diagnosis:0/problem_diagnosis_name"
        label="Problem/diagnosis name"
      ></MbInput>
      <MbContext path="doctor_notes_ignite.v0/problem_diagnosis_screening_questionnaire/any_event:0/time"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/problem_diagnosis_screening_questionnaire/subject"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/problem_diagnosis_screening_questionnaire/language"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/problem_diagnosis_screening_questionnaire/encoding"></MbContext>
      <MbRepeatableSimple>
        <MbQuantity
          default="mm[Hg]"
          path="doctor_notes_ignite.v0/vital_signs/blood_pressure/any_event:0/systolic"
          label="Systolic"
        >
          <MbUnit unit="mm[Hg]" label="mm[Hg]" min="" max="1000"></MbUnit>
        </MbQuantity>
        <MbContext path="doctor_notes_ignite.v0/vital_signs/blood_pressure/any_event:0/time"></MbContext>
        <MbContext path="doctor_notes_ignite.v0/vital_signs/blood_pressure/a24_hour_average/time"></MbContext>
        <MbContext path="doctor_notes_ignite.v0/vital_signs/blood_pressure/subject"></MbContext>
        <MbContext path="doctor_notes_ignite.v0/vital_signs/blood_pressure/language"></MbContext>
        <MbContext path="doctor_notes_ignite.v0/vital_signs/blood_pressure/encoding"></MbContext>
      </MbRepeatableSimple>
      <MbPercent
        path="doctor_notes_ignite.v0/vital_signs/pulse_oximetry/any_event:0/spo"
        label="SpO₂"
        min="0"
        max="100"
        step="1"
        type="percent"
      ></MbPercent>
      <MbContext path="doctor_notes_ignite.v0/vital_signs/pulse_oximetry/any_event:0/time"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/vital_signs/pulse_oximetry/subject"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/vital_signs/pulse_oximetry/language"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/vital_signs/pulse_oximetry/encoding"></MbContext>
      <MbProportion
        path="doctor_notes_ignite.v0/waist-hip_ratio/any_point_in_time_event:0/waist-hip_ratio"
        label="Waist-hip ratio"
        min="0"
        max="1"
        step="0.01"
      ></MbProportion>
      <MbContext path="doctor_notes_ignite.v0/waist-hip_ratio/any_point_in_time_event:0/time"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/waist-hip_ratio/subject"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/waist-hip_ratio/language"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/waist-hip_ratio/encoding"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/composer"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/language"></MbContext>
      <MbContext path="doctor_notes_ignite.v0/territory"></MbContext>
      <MbSubmit>Submit</MbSubmit>
    </MbForm>
  );
};
const htmlRoot = document.getElementById('root');
const root = createRoot(htmlRoot!);
root.render(<TestRoot />);
