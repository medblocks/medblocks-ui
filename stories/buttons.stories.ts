import { html } from 'lit-html';

export default {
  title: 'Components/Buttons/mb-button',
  component: 'mb-buttons',
};

const snippet = (fn: any, html: string) => {
  fn.parameters = { docs: { source: { code: html } } };
};

const Template = ({ label = '', data = '', display = '' }) => html`
  <mb-buttons
    @mb-buttons=${(e: any) => (data = e.target.data)}
    .data=${data}
    .label=${label}
  >
    <mb-option .display=${display}></mb-option>
  </mb-buttons>
`;

export const Base = Template.bind({});

Base.args = {
  label: '',
  display: 'button',
};

snippet(Base, `<mb-buttons></mb-buttons>`);
