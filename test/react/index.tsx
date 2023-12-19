/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { MbBoolean, MbForm, MbInput } from '../../src/react';
import { MbInputInputEvent } from '../../src/medblocks/text/input';


export const TestRoot = () => {
  const logFieldValue = (e: MbInputInputEvent) => {
    console.log(e.target.data);
  };
  return (
    <MbForm>
      <MbBoolean label='FIELD LABEL' data={true} path="aql_path" />
      <MbInput onMbInput={logFieldValue} label='INPUT FIELD' data="hello world" />
    </MbForm>
  );
};

const htmlRoot = document.getElementById('root');
const root = createRoot(htmlRoot!);
root.render(<TestRoot />);
