import React from 'react';
import { createComponent } from '@lit/react';

import MbBooleanTag from '../medblocks/boolean/checkbox';

export const MbBoolean = createComponent({
  tagName: 'mb-boolean',
  elementClass: MbBooleanTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbDisconnect: 'mb-disconnect',
    onMbConnect: 'mb-connect',
  }
});
