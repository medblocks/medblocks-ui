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
  >
    <mb-options .options=${options}>${options}</mb-options>
  </mb-select>
`;
export const Base = Template.bind({});
Base.args = { placeholder: 'select', options: [1, 2, 3], label: '' };
snippet(Base, `<mb-select></mb-select>`);
