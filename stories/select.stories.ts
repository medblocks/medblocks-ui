import { html } from 'lit-html';
import { snippet } from './utils';
export default {
  title: 'Data Entry/Coded Text/mb-select',
  component: 'mb-select',
};

const Template = ({ data = undefined, label = '', placeholder = '' }) => html`
  <mb-select
    @mb-select=${(e: any) => (data = e.target.data)}
    .data=${data}
    .label=${label}
    .placeholder=${placeholder}
  >
    <mb-option value="option0" label="Option 0"></mb-option>
    <mb-option value="option1" label="Option 1"></mb-option>
    <mb-option value="option2" label="Option 2"></mb-option>
    <mb-option value="option3" label="Option 3"></mb-option>
  </mb-select>
`;
export const Base = Template.bind({});
Base.args = {
  placeholder: 'Select something',
  label: 'Options to choose from',
};
snippet(
  Base,
  `<mb-select placeholder="Select something" label="Options to choose from">
  <mb-option value="option0" label="Option 0"></mb-option>
  <mb-option value="option1" label="Option 1"></mb-option>
  <mb-option value="option2" label="Option 2"></mb-option>
  <mb-option value="option3" label="Option 3"></mb-option>
</mb-select>`
);

export const PreSelected = Template.bind({});
PreSelected.args = {
  placeholder: 'Please select something',
  label: 'Preselected dropdown',
  data: { code: 'option2', value: 'Option 2', terminology: 'local' },
};

snippet(
  PreSelected,
  `<mb-select 
  placeholder="Please select something" 
  label="Preselected dropdown" 
  data={{ code: 'option2', value: 'Option 2', terminology: 'local' }}>
<mb-option value="option0" label="Option 0"></mb-option>
<mb-option value="option1" label="Option 1"></mb-option>
<mb-option value="option2" label="Option 2"></mb-option>
<mb-option value="option3" label="Option 3"></mb-option>
</mb-select>`
);

// Default data already selected example
