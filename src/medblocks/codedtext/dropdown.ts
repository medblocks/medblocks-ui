import type { SlMenuItem } from '@shoelace-style/shoelace';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown';
import { customElement, property } from 'lit-element';

@customElement('mb-dropdown')
export default class MbDropDown extends SlDropdown {
  // disabling hide since search takes care of displaying the dropdown

  // handleDocumentKeyDown(): void {
  //   return;
  // }

  handleTriggerClick(): void {
    // eslint-disable-next-line no-console
    console.log('trigger click triggered');
    if (this.open) {
      // this.hide();
    } else {
      this.show();
    }
  }

  @property() searchElement: HTMLElement;

  handleTriggerKeyDown(event: KeyboardEvent) {
    const menu = this.getMenu();
    const menuItems = menu
      ? ([...menu.querySelectorAll('sl-menu-item')] as SlMenuItem[])
      : [];
    const firstMenuItem = menuItems[0];
    const lastMenuItem = menuItems[menuItems.length - 1];

    // Close when escape or tab is pressed
    if (event.key === 'Escape') {
      this.focusOnTrigger();
      this.hide();
      return;
    }

    // When spacebar/enter is pressed, show the panel but don't focus on the menu. This let's the user press the same
    // key again to hide the menu in case they don't want to make a selection.
    if (['Enter'].includes(event.key)) {
      event.preventDefault();
      this.handleTriggerClick();
      return;
    }

    // When up/down is pressed, we make the assumption that the user is familiar with the menu and plans to make a
    // selection. Rather than toggle the panel, we focus on the menu (if one exists) and activate the first item for
    // faster navigation.
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();

      // Show the menu if it's not already open
      if (!this.open) {
        this.show();
      }

      // Focus on a menu item
      if (event.key === 'ArrowDown' && firstMenuItem) {
        menu?.setCurrentItem(firstMenuItem);
        firstMenuItem.focus();
        return;
      }

      if (event.key === 'ArrowUp' && lastMenuItem) {
        menu?.setCurrentItem(lastMenuItem);
        lastMenuItem.focus();
      }
    }
    // Other keys bring focus to the menu and initiate type-to-select behavior
  }
}
