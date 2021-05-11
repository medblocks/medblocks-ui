import { html } from 'lit-html';
export default {
  title: 'Components/Select/mb-select',
  component: 'mb-select',
};
const snippet = (fn: any, html: string) => {
  fn.parameters = { docs: { source: { code: html } } };
};

const Template = ({ data = '', label = '', placeholder = '' }) => html`
  <mb-select
    @mb-select=${(e: any) => (data = e.target.data)}
    .data=${data}
    .label=${label}
    .placeholder=${placeholder}
    ><mb-option value="0" label="apple"></mb-option>
    <mb-option value="1" label="banana"></mb-option>
    <mb-option value="2" label="carrot"></mb-option>
  </mb-select>
`;
export const Base = Template.bind({});
Base.args = {};
snippet(Base, `<mb-select></mb-select>`);
export const withPlaceholder = Template.bind({});
withPlaceholder.args = {
  placeholder: 'select here',
  label: 'Placeholder',
};
snippet(
  withPlaceholder,
  `<mb-select label='Placeholder' placeholder='select here'></mb-select>`
);
