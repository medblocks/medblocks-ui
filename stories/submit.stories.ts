import { html } from 'lit-html';

export default {
  title: 'Components/Buttons/mb-submit',
  component: 'mb-submit',
};

const snippet = (fn: any, html: string) => {
  fn.parameters = { docs: { source: { code: html } } };
};

const Template = ({ loading = false, data = '', type = 'default' }) => html`
  <mb-submit
    @mb-submit=${(e: any) => (data = e.target.data)}
    .data=${data}
    .type=${type}
    .loading=${loading}
    >Submit
  </mb-submit>
`;

export const Base = Template.bind({});

Base.args = {
  type: '',
};

snippet(Base, `<mb-submit></mb-submit>`);
export const Loading = Template.bind({});
Loading.args = {
  loading: true,
};
snippet(Loading, `<mb-submit loading></mb-submit>`);
export const Variant = Template.bind({});
Variant.args = {
  type: 'danger',
};
snippet(Variant, `<mb-submit type='danger'></mb-submit>`);
