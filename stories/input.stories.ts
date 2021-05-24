import { html } from 'lit-html';
import { snippet } from './utils';

export default {
  title: 'Data Entry/Text/mb-input',
  component: 'mb-input',
};

const Template = ({ label = '', textarea = false, data = '' }) => html`
  <mb-input
    @mb-input=${(e: any) => (data = e.target.data)}
    .data=${data}
    .label=${label}
    ?textarea=${textarea}
  >
  </mb-input>
`;

export const Base = Template.bind({});

Base.args = {
  textarea: false,
};

snippet(Base, `<mb-input></mb-input>`);

export const WithLabel = Template.bind({});

WithLabel.args = {
  label: 'Input with Label',
};

snippet(WithLabel, `<mb-input label="Input with label"></mb-input>`);

export const Textarea = Template.bind({});
Textarea.args = {
  label: 'Textarea',
  textarea: true,
};

snippet(Textarea, `<mb-input label="Textarea" textarea></mb-input>`);
