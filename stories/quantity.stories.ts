import { html } from 'lit-html';
import { snippet } from './utils';
export default {
  title: 'Data Entry/Quantity/mb-quantity',
  component: 'mb-quantity',
};

const Template = ({ data = undefined, hideunit = false, label = '' }) => html`
  <mb-quantity
    @mb-quantity=${(e: any) => (data = e.target.data)}
    .data=${data}
    .label=${label}
    ?hideunit=${hideunit}
  >
    <mb-unit unit="mm[Hg]" label="mm[Hg]"></mb-unit>
  </mb-quantity>
`;
export const Base = Template.bind({});
Base.args = {
  hideunit: false,
  label: 'Quantity Base',
};
snippet(Base, `<mb-quantity></mb-quantity>`);
export const hideUnit = Template.bind({});
hideUnit.args = {
  label: 'Quantity without unit',
  hideunit: true,
};
snippet(hideUnit, `<mb-quantity hideunit=true></mb-quantity>`);
