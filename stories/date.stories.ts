import { html } from 'lit-html';
import { snippet } from './utils';

export default {
  title: 'Data Entry/Date/mb-date',
  component: 'mb-date',
};



const Template = ({ label = '', data = '', time = false }) => html`
  <mb-date
    ?time=${time}
    @mb-date=${(e: any) => (data = e.target.data)}
    .data=${data}
    .label=${label}
  >
  </mb-date>
`;

export const JustDate = Template.bind({});

JustDate.args = {
  label: 'Just date',
};

snippet(JustDate, `<mb-date></mb-date>`);

export const DateTime = Template.bind({});
DateTime.args = {
  label: 'Data and Time',
  time: true,
};

snippet(DateTime, `<mb-date time></mb-date>`);
