import { html } from 'lit-html';

export default {
  title: 'Components/Dropdown/mb-dropdown',
  component: 'mb-dropdown',
};

const snippet = (fn: any, html: string) => {
  fn.parameters = { docs: { source: { code: html } } };
};

const Template = ({ data = '', closeOnSelect = false, open = false }) => html`
    <mb-dropdown
      @mb-dropdown=${(e: any) => (data = e.target.data)}
      .closeOnSelect=${closeOnSelect}
      .data=${data} .open=${open}
      >
      <sl-menu-item>1</sl-menu-item><sl-menu-item>2</sl-menu-item
      ><sl-menu-item>3</sl-menu-item><sl-menu-item>4</sl-menu-item>
    </mb-dropdown>
  </mb-input>
`;

export const Base = Template.bind({});

Base.args = { closeOnSelect: true, open: true };

snippet(Base, `<mb-dropdown></mb-dropdown>`);
