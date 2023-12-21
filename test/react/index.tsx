/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  MbBoolean,
  MbForm,
  MbInput,
  MbDropDown,
  MbOption,
  MbProportion,
  MbSelect,
  MbButtonMultiple,
  MbButton,
  MbFilter,
  MbSearchMultiple,
  MbSearch,
  MbCheckBox,
  MbContext,
  MbCount,
  MbDate,
  MbDuration,
  MbQuantity,
  MbUnit,
  MbMultimedia,
  MbPercent,
  MbRepeatableHeadless,
  MbRepeatableSimple,
  MbInputMultiple,
  MbTextSelect,
} from '../../src/react';
import { MbInputInputEvent } from '../../src/medblocks/text/input';

export const TestRoot = () => {
  const logFieldValue = (e: MbInputInputEvent) => {
    console.log(e.target.data);
    console.log(e.target.path);
  };
  return (
    <MbForm>
      <MbInput
        onMbInput={logFieldValue}
        label="INPUT FIELD"
        data="hello world"
        path="aql_path"
      />
      <MbBoolean label="Boolean" data={true} path="aql_path" />
      <MbSelect label="Select">
        <MbOption label="red" value="red"></MbOption>
        <MbOption label="blue" value="blue"></MbOption>
      </MbSelect>
      <MbButtonMultiple label="Multiple button">
        <MbOption label="red" value="red"></MbOption>
        <MbOption label="blue" value="blue"></MbOption>
      </MbButtonMultiple>
      <MbButton label="Button">
        <MbOption label="red" value="red"></MbOption>
        <MbOption label="blue" value="blue"></MbOption>
      </MbButton>
      <MbDropDown />

      <MbSearchMultiple label="Multiple search" />
      <MbSearch terminology="SNOMED-CT" label="Chief Complaints (mb-search)">
        <MbFilter
          label="Conditions 1"
          value="^181000271107 | (finding) | OR <272379006 | Event (event) |"
        />
      </MbSearch>
      <MbCheckBox label="Checkbox" data={true} />
      <MbContext label="Context" />
      <MbCount path="blood_pressure/any_event:0/systolic" label="Count" />
      <MbDate label="Date" />
      <MbDuration label="Duration" />
      <MbQuantity
        label="Quantity"
        default="mm[Hg]"
        path="blood_pressure/any_event:0/systolic"
      >
        <MbUnit unit="mm[Hg]" label="mm[Hg]" min="" max="1000"></MbUnit>
      </MbQuantity>
      <MbMultimedia label="Multimedia" />
      <MbPercent label="Percent" />
      <MbRepeatableHeadless path="chief_complaints"></MbRepeatableHeadless>
      <MbRepeatableSimple>
        <div>
          <MbInput label="INPUT" data="Hello World" />
          <MbButton label="Button">
            <MbOption label="red" value="red"></MbOption>
            <MbOption label="blue" value="blue"></MbOption>
          </MbButton>
        </div>
      </MbRepeatableSimple>
      <MbInputMultiple label="Input multiple" />
      <MbTextSelect label="Text select">
        <MbOption label="red" value="red"></MbOption>
        <MbOption label="blue" value="blue"></MbOption>
      </MbTextSelect>
      <MbProportion path="proportion"
        label="Waist-Hip Ratio (mb-proportion)" ></MbProportion>
    </MbForm>
  );
};

const htmlRoot = document.getElementById('root');
const root = createRoot(htmlRoot!);
root.render(<TestRoot />);
