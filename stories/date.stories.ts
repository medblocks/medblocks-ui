import { html } from 'lit-html';

export default {
  title: 'Components/Date/mb-date',
  component: 'mb-date',
};

const snippet = (fn: any, html: string) => {
  fn.parameters = { docs: { source: { code: html } } };
};

const Template = ({ label = '', data = '' }) => html`
  <mb-date
    @mb-date=${(e: any) => (data = e.target.data)}
    .data=${data}
    .label=${label}
  >
  </mb-date>
`;

export const Base = Template.bind({});

Base.args = {
  label: '',
};

snippet(Base, `<mb-date></mb-date>`);
