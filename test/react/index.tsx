/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { createRoot } from 'react-dom/client';


export const TestRoot = () => (
  <p>
    Hello World
  </p>
);

const htmlRoot = document.getElementById('root');
const root = createRoot(htmlRoot!);
root.render(<TestRoot />);
