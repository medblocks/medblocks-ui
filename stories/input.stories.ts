import { html } from 'lit-html';

export default {
  title: 'Input',
  component: 'mb-input',
  parameters: { actions: { argTypesRegex: '^mb.*' } },
  argTypes: {
    label: { control: 'text' },
    textarea: { control: 'boolean' },
  },
};

const Template = ({ label = '', textarea = false }) => html`
  <mb-input @mb-input=${console.log} .label=${label} ?textarea=${textarea}>
  </mb-input>
`;

export const Normal = Template.bind({});
export const WithLabel = Template.bind({});

WithLabel.args = {
  label: 'Input Label',
};

export const Textarea = Template.bind({});
Textarea.args = {
  label: 'Textarea Label',
  textarea: true,
};
