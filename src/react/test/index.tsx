// eslint-disable-next-line no-use-before-define
import React from "react";

import {
  MbBoolean
} from "../index";

const newComp = () => (
  <MbBoolean onMbInput={e => {
    console.log(e);
  }} >
  </MbBoolean>
);
