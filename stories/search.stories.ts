import { html } from 'lit-html';
import { snippet } from './utils';

export default {
  title: 'Data Entry/Coded Text/mb-search',
  component: 'mb-search',
};


const Template = ({ label = '', data = undefined }) => html`
  <mb-search
    @mb-search=${(e: any) => (data = e.target.data)}
    .data=${data}
    .label=${label}
  >
  </mb-search>
`;

export const Base = Template.bind({});

Base.args = {
  label: 'Search for a disease',
};

snippet(Base, `<mb-search></mb-search>`);
