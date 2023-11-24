import { html } from 'lit-html';
import { snippet } from './utils';

export default {
  title: 'Utility/mb-context',
  component: 'mb-context',
};

const Template = ({ label = '', data = '', autoContext = false }) => html`
  <p>Context elements don't have any output.</p>
  <mb-context
    @mb-input=${(e: any) => {
      data = e.target.data;
      return undefined;
    }}
    .data=${data}
    .label=${label}
    ?autoContext=${autoContext}
  >
  </mb-context>
`;

export const Base = Template.bind({});

Base.args = {
  label: '',
  autocontext: true,
};

snippet(Base, `<mb-context></mb-context>`);
