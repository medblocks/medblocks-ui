# mb-dropdown

## Properties

| Property            | Type                                             |
|---------------------|--------------------------------------------------|
| `containingElement` | `HTMLElement`                                    |
| `disabled`          | `boolean`                                        |
| `distance`          | `number`                                         |
| `hoist`             | `boolean`                                        |
| `open`              | `boolean`                                        |
| `panel`             | `HTMLElement`                                    |
| `placement`         | `"top" \| "top-start" \| "top-end" \| "bottom" \| "bottom-start" \| "bottom-end" \| "right" \| "right-start" \| "right-end" \| "left" \| "left-start" \| "left-end"` |
| `positioner`        | `HTMLElement`                                    |
| `skidding`          | `number`                                         |
| `stayOpenOnSelect`  | `boolean`                                        |
| `trigger`           | `HTMLElement`                                    |

## Methods

| Method                       | Type                              |
|------------------------------|-----------------------------------|
| `focusOnTrigger`             | `(): void`                        |
| `getMenu`                    | `(): SlMenu`                      |
| `handleDocumentKeyDown`      | `(event: KeyboardEvent): void`    |
| `handleDocumentMouseDown`    | `(event: MouseEvent): void`       |
| `handleMenuItemActivate`     | `(event: CustomEvent<any>): void` |
| `handleOpenChange`           | `(): Promise<void>`               |
| `handlePanelSelect`          | `(event: CustomEvent<any>): void` |
| `handlePopoverOptionsChange` | `(): void`                        |
| `handleTriggerClick`         | `(): void`                        |
| `handleTriggerKeyDown`       | `(event: KeyboardEvent): void`    |
| `handleTriggerKeyUp`         | `(event: KeyboardEvent): void`    |
| `handleTriggerSlotChange`    | `(): void`                        |
| `hide`                       | `(): Promise<void>`               |
| `reposition`                 | `(): void`                        |
| `show`                       | `(): Promise<void>`               |
| `updateAccessibleTrigger`    | `(): void`                        |
