import { html } from 'lit-html';

export default {
  title: 'Input',
  component: 'mb-input',
  
};

const Template = ({ label='', textarea=false, data=''}) => html`
  <mb-input @mb-input=${(e: any)=>data=e.target.data} .data=${data} .label=${label} ?textarea=${textarea}>
  </mb-input>
`;

export const Base = Template.bind({})

Base.args = {
  label: '',
  textarea: false
};

export const WithLabel = Template.bind({});

WithLabel.args = {
  label: 'Input Label',
};

export const Textarea = Template.bind({});
Textarea.args = {
  label: 'Textarea Label',
  textarea: true,
};
