import { html } from 'lit-html';

export default {
  title: 'Components/Search/mb-search',
  component: 'mb-search',
};

const snippet = (fn: any, html: string) => {
  fn.parameters = { docs: { source: { code: html } } };
};

const Template = ({ label = '', data = '' }) => html`
  <mb-search
    @mb-search=${(e: any) => (data = e.target.data)}
    .data=${data}
    .label=${label}
  >
  </mb-search>
`;

export const Base = Template.bind({});

Base.args = {
  label: '',
};

snippet(Base, `<mb-search></mb-search>`);
