import { html } from 'lit-html';

export default {
  title: 'Components/Context/mb-context',
  component: 'mb-context',
};

const snippet = (fn: any, html: string) => {
  fn.parameters = { docs: { source: { code: html } } };
};

const Template = ({ label = '', data = '', autoContext = false }) => html`
  <mb-context
    @mb-input=${(e: any) => (data = e.target.data)}
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
