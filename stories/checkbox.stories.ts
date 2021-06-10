import { html } from 'lit-html';
import { snippet } from './utils';

export default {
  title: 'Data Entry/Boolean/mb-checkbox',
  component: 'mb-checkbox',
};

const Template = ({ label = '', data = '', disabled = false }) => html`
  <mb-checkbox
    @mb-checkbox=${(e: any) => (data = e.target.data)}
    .data=${data}
    .label=${label}
    .disabled=${disabled}
  >
  </mb-checkbox>
`;

export const Base = Template.bind({});

Base.args = {
  label: '',
};

snippet(Base, `<mb-checkbox></mb-checkbox>`);

export const WithLabel = Template.bind({});

WithLabel.args = {
  label: 'Checkbox Label',
};

snippet(WithLabel, `<mb-checkbox label="Checkbox label"></mb-checkbox>`);

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Disabled',
  disabled: true,
};

snippet(Disabled, `<mb-checkbox label="Disabled" disabled=true></mb-checkbox>`);
