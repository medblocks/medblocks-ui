import { html } from 'lit-html';
import { snippet } from './utils';

export default {
  title: 'Data Entry/Coded Text/mb-buttons',
  component: 'mb-buttons',
  parameters: {
    layout: 'centered',
  },
};

const Template = ({ label = '', data = undefined }) => html`
  <mb-buttons
    @mb-buttons=${(e: any) => (data = e.target.data)}
    .data=${data}
    .label=${label}
  >
    <mb-option value="option1" label="Option 1"></mb-option>
    <mb-option value="option2" label="Option 2"></mb-option>
    <mb-option value="option3" label="Option 3"></mb-option>
  </mb-buttons>
`;

export const Base = Template.bind({});

Base.args = {
  label: 'Select a button',
};

snippet(
  Base,
  `<mb-buttons label="Select a button">
  <mb-option value="option1" label="Option 1"></mb-option>
  <mb-option value="option2" label="Option 2"></mb-option>
  <mb-option value="option2" label="Option 3"></mb-option>
</mb-buttons>`
);

export const DataBinding = Template.bind({});

DataBinding.args = {
  label: 'Preselected a value',
  data: {
    code: 'option1',
    value: 'Option 1',
    terminology: 'local',
  },
};

snippet(
  DataBinding,
  `<mb-buttons label="Preselected a value" data={{
  code: 'option1',
  value: 'Option 1',
  terminology: 'local',
}}>
<mb-option value="option1" label="Option 1"></mb-option>
<mb-option value="option2" label="Option 2"></mb-option>
<mb-option value="option2" label="Option 3"></mb-option>
</mb-buttons>`
);
