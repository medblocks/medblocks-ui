import { html } from 'lit-html';
export default {
  title: 'Components/Select/mb-select',
  component: 'mb-select',
};
const snippet = (fn: any, html: string) => {
  fn.parameters = { docs: { source: { code: html } } };
};

const Template = ({
  data = '',
  label = '',
  placeholder = '',
  options = [],
}) => html`
  <mb-select
    @mb-select=${(e: any) => (data = e.target.data)}
    .data=${data}
    .label=${label}
    .placeholder=${placeholder}
    ><mb-option .options=${options}></mb-option>
  </mb-select>
`;
export const Base = Template.bind({});
Base.args = {
  placeholder: 'select',
  label: '',
  options: [{ value: 1, label: 'a' }],
};
snippet(Base, `<mb-select></mb-select>`);
