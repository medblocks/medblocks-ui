import { html } from 'lit-html';
import { snippet } from './utils';

export default {
  title: 'Data Entry/Text/mb-input',
  component: 'mb-input',
};

const Template = ({ label = '', textarea = false, data = '' }) => html`
  <mb-input
    @mb-input=${(e: any) => {
      data = e.target.data;
      return undefined;
    }}
    .data=${data}
    .label=${label}
    ?textarea=${textarea}
  >
  </mb-input>
`;

export const Base = Template.bind({});

Base.args = {
  label: '',
  textarea: false,
};

snippet(Base, `<mb-input></mb-input>`);

export const WithLabel = Template.bind({});

WithLabel.args = {
  label: 'Input Label',
};

snippet(WithLabel, `<mb-input label="Input label"></mb-input>`);

export const Textarea = Template.bind({});
Textarea.args = {
  label: 'Textarea Label',
  textarea: true,
};

snippet(Textarea, `<mb-input label="Textarea Label" textarea></mb-input>`);
