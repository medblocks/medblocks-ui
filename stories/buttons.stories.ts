import { html } from 'lit-html';

export default {
  title: 'Components/Buttons/mb-buttons',
  component: 'mb-buttons',
};

const snippet = (fn: any, html: string) => {
  fn.parameters = { docs: { source: { code: html } } };
};

const Template = ({ label = '', data = '', type = '' }) => html`
  <mb-buttons
    @mb-buttons=${(e: any) => (data = e.target.data)}
    .data=${data}
    .label=${label}
    ><mb-option label="button" type=${type}></mb-option>
  </mb-buttons>
`;

export const Base = Template.bind({});

Base.args = {};

snippet(Base, `<mb-buttons></mb-buttons>`);
