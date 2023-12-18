import React from 'react';
import { createComponent } from '@lit/react';

import MbBooleanTag from '../medblocks/boolean/checkbox';
import MbSelectTag from '../medblocks/codedtext/select';
import MbSearchTag from '../medblocks/codedtext/search';
import MbDropDownTag from '../medblocks/codedtext/dropdown';
import MbOptionTag from '../medblocks/codedtext/option';
import MbFilterTag from '../medblocks/codedtext/filter';
import MbCheckBoxTag from '../medblocks/context/checkboxAny';
import MbContextTag from '../medblocks/context/context';
import MbDateTimeTag from '../medblocks/datetime/date';
import MbDurationTag from '../medblocks/duration/duration';
import MedblockFormTag from '../medblocks/form/form';
import MbQuantityTag from '../medblocks/quantity/quantity';
import MbUnitTag from '../medblocks/quantity/unit';
import MbPercentTag from '../medblocks/proportion/percent';
import MbSubmitTag from '../medblocks/submit/submit';
import MbInputTag from '../medblocks/text/input';
import MbButtonMultipleTag from '../medblocks/codedtext/buttons-multiple';
import MbButtonTag from '../medblocks/codedtext/buttons';
import MbSearchMultipleTag from '../medblocks/codedtext/search-multiple';
import MbCountTag from '../medblocks/count/count';
import MbRepeatableSimpleTag from '../medblocks/repeat/repeatableSimple';
import MbMultimediaTag from '../medblocks/multimedia/multimedia';
import MbProportionTag from '../medblocks/proportion/proportion';
import MbRepeatableHeadlessTag from '../medblocks/repeat/repeatableHeadless';
import MbInputMultipleTag from '../medblocks/text/input-multiple';
import MbTextSelectTag from '../medblocks/text/text-select';

export const MbBoolean = createComponent({
  tagName: 'mb-boolean',
  elementClass: MbBooleanTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbDisconnect: 'mb-disconnect',
    onMbConnect: 'mb-connect',
  },
});
export const MbSelect = createComponent({
  tagName: 'mb-select',
  elementClass: MbSelectTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbDisconnect: 'mb-disconnect',
    onMbConnect: 'mb-connect',
  },
});
// documentation not present
export const MbButtonMultiple = createComponent({
  tagName: 'mb-buttons-multiple',
  elementClass: MbButtonMultipleTag,
  react: React,
  events: {},
});
export const MbButton = createComponent({
  tagName: 'mb-buttons',
  elementClass: MbButtonTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbDisconnect: 'mb-disconnect',
    onMbConnect: 'mb-connect',
  },
});
export const MbDropDown = createComponent({
  tagName: 'mb-dropdown',
  elementClass: MbDropDownTag,
  react: React,
  events: {},
});
export const MbOption = createComponent({
  tagName: 'mb-option',
  elementClass: MbOptionTag,
  react: React,
  events: {},
});
export const MbFilter = createComponent({
  tagName: 'mb-filter',
  elementClass: MbFilterTag,
  react: React,
  events: {},
});
// documentation not present
export const MbSearchMultiple = createComponent({
  tagName: 'mb-search-multiple',
  elementClass: MbSearchMultipleTag,
  react: React,
  events: {},
});
export const MbSearch = createComponent({
  tagName: 'mb-search',
  elementClass: MbSearchTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbDisconnect: 'mb-disconnect',
    onMbConnect: 'mb-connect',
  },
});
export const MbCheckBox = createComponent({
  tagName: 'mb-checkbox-any',
  elementClass: MbCheckBoxTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbDisconnect: 'mb-disconnect',
    onMbConnect: 'mb-connect',
  },
});
export const MbContext = createComponent({
  tagName: 'mb-context',
  elementClass: MbContextTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbDisconnect: 'mb-disconnect',
    onMbConnect: 'mb-connect',
  },
});
// documentation not present
export const MbCount = createComponent({
  tagName: 'mb-count',
  elementClass: MbCountTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbDisconnect: 'mb-disconnect',
    onMbConnect: 'mb-connect',
  },
});
export const MbDate = createComponent({
  tagName: 'mb-date',
  elementClass: MbDateTimeTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbDisconnect: 'mb-disconnect',
    onMbConnect: 'mb-connect',
  },
});
export const MbDuration = createComponent({
  tagName: 'mb-duration',
  elementClass: MbDurationTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbDisconnect: 'mb-disconnect',
    onMbConnect: 'mb-connect',
  },
});
export const MbForm = createComponent({
  tagName: 'mb-form',
  elementClass: MedblockFormTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbLoad: 'mb-load',
    onMbSubmit: 'mb-submit',
  },
});
export const MbQuantity = createComponent({
  tagName: 'mb-quantity',
  elementClass: MbQuantityTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbDisconnect: 'mb-disconnect',
    onMbConnect: 'mb-connect',
  },
});
export const MbUnit = createComponent({
  tagName: 'mb-unit',
  elementClass: MbUnitTag,
  react: React,
  events: {},
});
// documentation not present
export const MbMultimedia = createComponent({
  tagName: 'mb-multimedia',
  elementClass: MbMultimediaTag,
  react: React,
  events: {},
});
export const MbProportion = createComponent({
  tagName: 'mb-propotion',
  elementClass: MbProportionTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbDisconnect: 'mb-disconnect',
    onMbConnect: 'mb-connect',
  },
});
export const MbPercent = createComponent({
  tagName: 'mb-percent',
  elementClass: MbPercentTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbDisconnect: 'mb-disconnect',
    onMbConnect: 'mb-connect',
  },
});
// documentation not present
export const MbRepeatableHeadless = createComponent({
  tagName: 'mb-repeatable-headless',
  elementClass: MbRepeatableHeadlessTag,
  react: React,
  events: {},
});
export const MbRepeatableSimple = createComponent({
  tagName: 'mb-repeatable-simple',
  elementClass: MbRepeatableSimpleTag,
  react: React,
  events: {},
});
export const MbSubmit = createComponent({
  tagName: 'mb-submit',
  elementClass: MbSubmitTag,
  react: React,
  events: {},
});
export const MbInput = createComponent({
  tagName: 'mb-input',
  elementClass: MbInputTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbDisconnect: 'mb-disconnect',
    onMbConnect: 'mb-connect',
  },
});
export const MbInputMultiple = createComponent({
  tagName: 'mb-input-multiple',
  elementClass: MbInputMultipleTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbDisconnect: 'mb-disconnect',
    onMbConnect: 'mb-connect',
  },
});
export const MbTextSelect = createComponent({
  tagName: 'mb-text-select',
  elementClass: MbTextSelectTag,
  react: React,
  events: {
    onMbInput: 'mb-input',
    onMbDisconnect: 'mb-disconnect',
    onMbConnect: 'mb-connect',
  },
});
