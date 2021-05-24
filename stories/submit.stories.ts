import { html } from 'lit-html';
import { snippet } from './utils';

export default {
  title: 'Components/Submit/mb-submit',
  component: 'mb-submit',
  parameters: {
    layout: 'centered',
  },
};

const Template = ({
  label = '',
  data = undefined,
  loading = false,
  type = '',
}) => html`
  <mb-submit
    @mb-submit=${(e: any) => (data = e.target.data)}
    .data=${data}
    .label=${label}
    .loading=${loading}
    .type=${type}
  >
    Submit
  </mb-submit>
`;

export const Base = Template.bind({});

Base.args = {
  label: 'Submit button',
};

snippet(Base, `<mb-submit label="Submit button"></mb-submit>`);

export const Loading = Template.bind({});

Loading.args = {
  label: 'Loading Submit',
  loading: true,
};

snippet(Loading, `<mb-submit label="Loading" loading=true>Submit</mb-submit>`);
export const Variant = Template.bind({});
Variant.args = {
  type: 'danger',
  label: 'Danger Submit Button',
};
snippet(Variant, `<mb-submit type='danger'>Submit</mb-submit>`);
