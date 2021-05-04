Web Component Analyzer analyzing 22 files...
# mb-buttons

An array of buttons to choose from

## Properties

| Property         | Attribute     | Modifiers | Type                                         | Default | Description                                      |
|------------------|---------------|-----------|----------------------------------------------|---------|--------------------------------------------------|
| `data`           | `data`        |           | `CodedText \| undefined`                     |         | Data of CodedText                                |
| `input`          |               |           | `EventEmitter<CodedText>`                    |         |                                                  |
| `label`          | `label`       |           | `string`                                     |         |                                                  |
| `mbConnect`      |               |           | `EventEmitter<{ path: string; }>`            |         |                                                  |
| `mbDependency`   |               |           | `EventEmitter<{ key: string; value: any; }>` |         |                                                  |
| `mbDisconnect`   |               |           | `EventEmitter<{ path: string; }>`            |         |                                                  |
| `optionElements` |               | readonly  | `NodeListOf<MbOption>`                       |         |                                                  |
| `options`        |               |           | `MbOption[]`                                 | []      |                                                  |
| `path`           | `path`        |           | `string`                                     |         |                                                  |
| `terminology`    | `terminology` |           | `string`                                     | "local" | Terminology of preference. Eg: SNOMED-CT, LOINC, local (for openEHR) |

## Methods

| Method              | Type                       |
|---------------------|----------------------------|
| `checkValidation`   | `(): boolean`              |
| `handleChildChange` | `(): void`                 |
| `handleDataChange`  | `(): void`                 |
| `handleInput`       | `(option: MbOption): void` |

## Events

| Event      | Description                       |
|------------|-----------------------------------|
| `mb-input` | Dispatched when the input changes |

# mb-dropdown

## Properties

| Property            | Type                                             |
|---------------------|--------------------------------------------------|
| `closeOnSelect`     | `boolean`                                        |
| `containingElement` | `HTMLElement`                                    |
| `distance`          | `number`                                         |
| `hoist`             | `boolean`                                        |
| `open`              | `boolean`                                        |
| `panel`             | `HTMLElement`                                    |
| `placement`         | `"top" \| "top-start" \| "top-end" \| "bottom" \| "bottom-start" \| "bottom-end" \| "right" \| "right-start" \| "right-end" \| "left" \| "left-start" \| "left-end"` |
| `positioner`        | `HTMLElement`                                    |
| `skidding`          | `number`                                         |
| `slAfterHide`       | `EventEmitter<void>`                             |
| `slAfterShow`       | `EventEmitter<void>`                             |
| `slHide`            | `EventEmitter<void>`                             |
| `slShow`            | `EventEmitter<void>`                             |
| `trigger`           | `HTMLElement`                                    |

## Methods

| Method                       | Type                              |
|------------------------------|-----------------------------------|
| `focusOnTrigger`             | `(): void`                        |
| `getMenu`                    | `(): SlMenu`                      |
| `handleDocumentKeyDown`      | `(event: KeyboardEvent): void`    |
| `handleDocumentMouseDown`    | `(event: MouseEvent): void`       |
| `handleMenuItemActivate`     | `(event: CustomEvent<any>): void` |
| `handleOpenChange`           | `(): void`                        |
| `handlePanelSelect`          | `(event: CustomEvent<any>): void` |
| `handlePopoverOptionsChange` | `(): void`                        |
| `handleTriggerClick`         | `(): void`                        |
| `handleTriggerKeyDown`       | `(event: KeyboardEvent): void`    |
| `handleTriggerKeyUp`         | `(event: KeyboardEvent): void`    |
| `handleTriggerSlotChange`    | `(): void`                        |
| `hide`                       | `(): void`                        |
| `reposition`                 | `(): void`                        |
| `show`                       | `(): void`                        |
| `updateAccessibleTrigger`    | `(): void`                        |

# mb-filter

## Properties

| Property   | Attribute  | Type      | Default |
|------------|------------|-----------|---------|
| `disabled` | `disabled` | `boolean` | false   |
| `filter`   | `filter`   | `string`  |         |
| `label`    | `label`    | `string`  |         |

# mb-option

## Properties

| Property  | Attribute | Type     |
|-----------|-----------|----------|
| `code`    | `code`    | `string` |
| `display` | `display` | `string` |

# mb-search

## Properties

| Property           | Attribute          | Modifiers | Type                                         | Default | Description                                      |
|--------------------|--------------------|-----------|----------------------------------------------|---------|--------------------------------------------------|
| `axios`            | `axios`            |           | `AxiosInstance`                              |         |                                                  |
| `cancelledFilters` | `cancelledFilters` |           | `string[]`                                   | []      |                                                  |
| `code`             |                    | readonly  | `string \| undefined`                        |         |                                                  |
| `contraints`       |                    | readonly  | `string \| null`                             |         |                                                  |
| `data`             | `data`             |           | `CodedText \| undefined`                     |         | Data of CodedText                                |
| `debounceInterval` | `debounceInterval` |           | `number`                                     | 150     |                                                  |
| `debounceTimeout`  |                    |           | `number`                                     |         |                                                  |
| `debouncing`       |                    |           | `boolean`                                    | false   |                                                  |
| `display`          |                    | readonly  | `string \| undefined`                        |         |                                                  |
| `filters`          | `filters`          |           | `MbFilter[]`                                 |         |                                                  |
| `hasValue`         |                    | readonly  | `boolean`                                    |         |                                                  |
| `hits`             | `hits`             |           | `number`                                     | 10      |                                                  |
| `input`            |                    |           | `EventEmitter<CodedText>`                    |         |                                                  |
| `label`            | `label`            |           | `string`                                     |         |                                                  |
| `loadingResults`   |                    | readonly  | `TemplateResult`                             |         |                                                  |
| `maxHits`          |                    | readonly  | `number`                                     |         |                                                  |
| `mbConnect`        |                    |           | `EventEmitter<{ path: string; }>`            |         |                                                  |
| `mbDependency`     |                    |           | `EventEmitter<{ key: string; value: any; }>` |         |                                                  |
| `mbDisconnect`     |                    |           | `EventEmitter<{ path: string; }>`            |         |                                                  |
| `mock`             | `mock`             |           | `string[]`                                   | []      |                                                  |
| `moreHits`         |                    |           | `number`                                     | 0       |                                                  |
| `parentAxios`      |                    | readonly  | `AxiosInstance`                              |         |                                                  |
| `path`             | `path`             |           | `string`                                     |         |                                                  |
| `searchTerm`       | `searchTerm`       |           | `string`                                     |         |                                                  |
| `terminology`      | `terminology`      |           | `string`                                     | "local" | Terminology of preference. Eg: SNOMED-CT, LOINC, local (for openEHR) |
| `viewMore`         |                    | readonly  | `TemplateResult`                             |         |                                                  |

## Methods

| Method              | Type                          |
|---------------------|-------------------------------|
| `checkValidation`   | `(): boolean`                 |
| `getResults`        | `(): Promise<any>`            |
| `handleChildChange` | `(): void`                    |
| `handleClear`       | `(): void`                    |
| `handleDataChange`  | `(): void`                    |
| `handleInput`       | `(e: CustomEvent<any>): void` |
| `handleSelect`      | `(e: CustomEvent<any>): void` |
| `searchTermChange`  | `(): void`                    |

## Events

| Event      | Description                       |
|------------|-----------------------------------|
| `mb-input` | Dispatched when the input changes |

# mb-select

## Properties

| Property         | Attribute     | Modifiers | Type                                         | Default | Description                                      |
|------------------|---------------|-----------|----------------------------------------------|---------|--------------------------------------------------|
| `data`           | `data`        |           | `CodedText \| undefined`                     |         | Data of CodedText                                |
| `input`          |               |           | `EventEmitter<CodedText>`                    |         |                                                  |
| `label`          | `label`       |           | `string`                                     |         |                                                  |
| `mbConnect`      |               |           | `EventEmitter<{ path: string; }>`            |         |                                                  |
| `mbDependency`   |               |           | `EventEmitter<{ key: string; value: any; }>` |         |                                                  |
| `mbDisconnect`   |               |           | `EventEmitter<{ path: string; }>`            |         |                                                  |
| `optionElements` |               | readonly  | `NodeListOf<MbOption>`                       |         |                                                  |
| `options`        |               |           | `MbOption[]`                                 | []      |                                                  |
| `path`           | `path`        |           | `string`                                     |         |                                                  |
| `placeholder`    | `placeholder` |           | `string`                                     |         |                                                  |
| `terminology`    | `terminology` |           | `string`                                     | "local" | Terminology of preference. Eg: SNOMED-CT, LOINC, local (for openEHR) |

## Methods

| Method              | Type                          |
|---------------------|-------------------------------|
| `checkValidation`   | `(): boolean`                 |
| `getLabel`          | `(code: string): string`      |
| `handleChildChange` | `(): void`                    |
| `handleDataChange`  | `(): void`                    |
| `handleInput`       | `(e: CustomEvent<any>): void` |

## Events

| Event      | Description                       |
|------------|-----------------------------------|
| `mb-input` | Dispatched when the input changes |

# mb-context

## Properties

| Property       | Attribute     | Type                                         | Default |
|----------------|---------------|----------------------------------------------|---------|
| `autocontext`  | `autocontext` | `boolean`                                    | true    |
| `data`         | `data`        |                                              |         |
| `input`        |               | `EventEmitter<any>`                          |         |
| `label`        | `label`       | `string`                                     |         |
| `mbConnect`    |               | `EventEmitter<{ path: string; }>`            |         |
| `mbDependency` |               | `EventEmitter<{ key: string; value: any; }>` |         |
| `mbDisconnect` |               | `EventEmitter<{ path: string; }>`            |         |
| `path`         | `path`        | `string`                                     |         |

## Methods

| Method             | Type          |
|--------------------|---------------|
| `checkValidation`  | `(): boolean` |
| `handleDataChange` | `(): void`    |

# mb-date

## Properties

| Property       | Attribute | Type                                         | Default |
|----------------|-----------|----------------------------------------------|---------|
| `data`         | `data`    | `string`                                     |         |
| `input`        |           | `EventEmitter<any>`                          |         |
| `label`        | `label`   | `string`                                     | ""      |
| `mbConnect`    |           | `EventEmitter<{ path: string; }>`            |         |
| `mbDependency` |           | `EventEmitter<{ key: string; value: any; }>` |         |
| `mbDisconnect` |           | `EventEmitter<{ path: string; }>`            |         |
| `path`         | `path`    | `string`                                     |         |
| `time`         | `time`    | `boolean`                                    | false   |

## Methods

| Method             | Type                          |
|--------------------|-------------------------------|
| `checkValidation`  | `(): boolean`                 |
| `handleDataChange` | `(): void`                    |
| `handleInput`      | `(e: CustomEvent<any>): void` |

# mb-form

## Properties

| Property            | Attribute           | Modifiers | Type                               | Default                             |
|---------------------|---------------------|-----------|------------------------------------|-------------------------------------|
| `cdr`               | `cdr`               |           | `AxiosInstance`                    |                                     |
| `ctx`               | `ctx`               |           |                                    |                                     |
| `data`              | `data`              |           | `Data`                             |                                     |
| `ehr`               | `ehr`               |           | `string`                           |                                     |
| `hermes`            | `hermes`            |           | `AxiosInstance`                    |                                     |
| `input`             |                     |           | `EventEmitter<any>`                |                                     |
| `load`              |                     |           | `EventEmitter<any>`                |                                     |
| `loadDebounceMs`    |                     |           | `number`                           | 80                                  |
| `loadTimeout`       |                     |           | `number`                           |                                     |
| `loaded`            |                     |           | `boolean`                          | false                               |
| `observer`          |                     |           | `MutationObserver`                 |                                     |
| `overwritectx`      | `overwritectx`      |           | `boolean`                          | false                               |
| `pathElementMap`    |                     |           | `{ [path: string]: HTMLElement; }` | {}                                  |
| `plugin`            | `plugin`            |           | `MbPlugin`                         | {"getContext":"defaultContextData"} |
| `selector`          |                     | readonly  | `string`                           |                                     |
| `selectorAttribute` | `selectorAttribute` |           | `string`                           | "path"                              |
| `submit`            |                     |           | `EventEmitter<any>`                |                                     |
| `submitButton`      |                     | readonly  | `MbSubmit \| null`                 |                                     |
| `template`          | `template`          |           | `string`                           |                                     |
| `uid`               | `uid`               |           | `string`                           |                                     |

## Methods

| Method                  | Type                                             |
|-------------------------|--------------------------------------------------|
| `currentData`           | `(): { [path: string]: any; }`                   |
| `currentPathElementMap` | `(el: HTMLElement): { [path: string]: HTMLElement; }` |
| `export`                | `(data?: Data): any`                             |
| `get`                   | `(uid?: string): Promise<void>`                  |
| `getStructured`         | `(flat: Data, path?: string \| undefined): any`  |
| `handleDataChange`      | `(_: any, newValue: any): void`                  |
| `handleDependency`      | `(e: CustomEvent<{ key: string; value: any; }>): void` |
| `handleElementsChange`  | `(): void`                                       |
| `handleInput`           | `(e: CustomEvent<any>): void`                    |
| `handleSlotChange`      | `(): void`                                       |
| `handleSubmit`          | `(): Promise<void>`                              |
| `insertContext`         | `(): void`                                       |
| `post`                  | `(data: Data): Promise<void>`                    |
| `put`                   | `(uid: string, data: Data): Promise<AxiosResponse<any> \| undefined>` |

# mb-quantity

## Properties

| Property       | Attribute  | Type                                         | Default |
|----------------|------------|----------------------------------------------|---------|
| `data`         | `data`     | `Quantity \| undefined`                      |         |
| `default`      | `default`  | `string`                                     |         |
| `hideunit`     | `hideunit` | `boolean`                                    | false   |
| `input`        |            | `EventEmitter<Quantity>`                     |         |
| `label`        | `label`    | `string`                                     |         |
| `mbConnect`    |            | `EventEmitter<{ path: string; }>`            |         |
| `mbDependency` |            | `EventEmitter<{ key: string; value: any; }>` |         |
| `mbDisconnect` |            | `EventEmitter<{ path: string; }>`            |         |
| `path`         | `path`     | `string`                                     |         |
| `units`        | `units`    | `MbUnit[]`                                   | []      |

## Methods

| Method              | Type                          |
|---------------------|-------------------------------|
| `checkValidation`   | `(): boolean`                 |
| `handleChildChange` | `(): void`                    |
| `handleDataChange`  | `(): void`                    |
| `handleInput`       | `(e: CustomEvent<any>): void` |
| `handleSelect`      | `(e: CustomEvent<any>): void` |

# mb-unit

## Properties

| Property | Attribute | Type     |
|----------|-----------|----------|
| `label`  | `label`   | `string` |
| `unit`   | `unit`    | `string` |

# mb-submit

## Properties

| Property  | Attribute | Type                                             | Default   |
|-----------|-----------|--------------------------------------------------|-----------|
| `loading` | `loading` | `boolean`                                        | false     |
| `submit`  |           | `EventEmitter<any>`                              |           |
| `type`    | `type`    | `"primary" \| "success" \| "info" \| "warning" \| "danger" \| "text" \| "default"` | "default" |

# mb-input

## Properties

| Property       | Attribute  | Type                                         | Default |
|----------------|------------|----------------------------------------------|---------|
| `data`         | `data`     | `string`                                     |         |
| `input`        |            | `EventEmitter<string>`                       |         |
| `label`        | `label`    | `string`                                     | ""      |
| `mbConnect`    |            | `EventEmitter<{ path: string; }>`            |         |
| `mbDependency` |            | `EventEmitter<{ key: string; value: any; }>` |         |
| `mbDisconnect` |            | `EventEmitter<{ path: string; }>`            |         |
| `path`         | `path`     | `string`                                     |         |
| `textarea`     | `textarea` | `boolean`                                    | false   |

## Methods

| Method             | Type                          |
|--------------------|-------------------------------|
| `checkValidation`  | `(): boolean`                 |
| `handleDataChange` | `(): void`                    |
| `handleInput`      | `(e: CustomEvent<any>): void` |

