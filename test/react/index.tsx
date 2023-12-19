/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { MbBoolean } from '../../src/react';

export const TestRoot = () => (
  <div>
    <MbBoolean />
  </div>
);

const htmlRoot = document.getElementById('root');
const root = createRoot(htmlRoot!);
root.render(<TestRoot />);
