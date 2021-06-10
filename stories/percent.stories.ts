import { html } from 'lit-html';
import { snippet } from './utils';

export default {
  title: 'Data Entry/Proportion/mb-percent',
  component: 'mb-percent',
};

const Template = ({ label = '', data = '', min = '', max = '' }) => html`
  <mb-percent
    @mb-percent=${(e: any) => (data = e.target.data)}
    .data=${data}
    .label=${label}
    .min=${min}
    .max=${max}
  >
  </mb-percent>
`;

export const Base = Template.bind({});

Base.args = {
  label: '',
};

snippet(Base, `<mb-percent></mb-percent>`);

export const WithLabel = Template.bind({});

WithLabel.args = {
  label: 'Percent Label',
};

snippet(WithLabel, `<mb-percent label="Percent label"></mb-percent>`);

export const MinMaxValue = Template.bind({});
MinMaxValue.args = {
  textarea: true,
  min: '10',
  max: '80',
};

snippet(MinMaxValue, `<mb-percent min='10' max='80'></mb-percent>`);
