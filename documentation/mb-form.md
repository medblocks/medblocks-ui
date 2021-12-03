# mb-form

Reactive form that responds to changes in custom elements nested inside.

## Properties

| Property       | Attribute      | Modifiers | Type                              | Default                     | Description                                      |
|----------------|----------------|-----------|-----------------------------------|-----------------------------|--------------------------------------------------|
| `ctx`          | `ctx`          |           |                                   |                             | Context object that is set before submitting form. Automatic inferences are made where possible. |
| `data`         |                |           | `Data`                            |                             |                                                  |
| `export`       |                |           |                                   | "this.serialize.bind(this)" |                                                  |
| `hermes`       | `hermes`       |           | `AxiosInstance`                   |                             | Hermes instance to communicate with for SNOMED CT search elements. |
| `input`        |                |           | `EventEmitter<any>`               |                             |                                                  |
| `load`         |                |           | `EventEmitter<any>`               |                             |                                                  |
| `mbElements`   |                |           | `{ [path: string]: EhrElement; }` | {}                          | The child elements are loaded                    |
| `novalidate`   | `novalidate`   |           | `boolean`                         | false                       | Skip validation of form                          |
| `observer`     |                |           | `MutationObserver`                |                             |                                                  |
| `overwritectx` | `overwritectx` |           | `boolean`                         | false                       | Context will not be automatically inferd. What you pass in will be directly reflected. |
| `plugin`       | `plugin`       |           | `MbPlugin`                        | {}                          | Plugin to handle serialization and parsing of the input. openEHR and FHIR Plugins are built-in. |
| `submit`       |                |           | `EventEmitter<any>`               |                             |                                                  |
| `submitButton` |                | readonly  | `MbSubmit \| null`                |                             |                                                  |

## Methods

| Method                  | Type                                             | Description                                      |
|-------------------------|--------------------------------------------------|--------------------------------------------------|
| `getStructured`         | `(flat: Data, path?: string \| undefined): any`  |                                                  |
| `handleChildConnect`    | `(e: CustomEvent<any>): void`                    |                                                  |
| `handleChildPathChange` | `(e: CustomEvent<{ oldPath: string; newPath: string; }>): void` |                                                  |
| `handleDependency`      | `(e: CustomEvent<{ key: string; value: any; }>): void` |                                                  |
| `handleInput`           | `(e: CustomEvent<any>): void`                    |                                                  |
| `handleSlotChange`      | `(): void`                                       |                                                  |
| `handleSubmit`          | `(): Promise<void>`                              |                                                  |
| `import`                | `(data: any): void`                              | Parses and sets the form data to current data    |
| `insertContext`         | `(): void`                                       |                                                  |
| `parse`                 | `(data: any): any`                               | Parse output format to internal representation.  |
| `removeMbElement`       | `(path: string): void`                           |                                                  |
| `serialize`             | `(mbElements?: { [path: string]: EhrElement; }): any` | Serialize EHRElement to the output format - eg: openEHR FLAT format, FHIR resource. |
| `validate`              | `(): boolean`                                    | Runs validation on all the elements. Returns validation message. |

## Events

| Event       | Description                                      |
|-------------|--------------------------------------------------|
| `mb-input`  | When contents of the form change. The result must be obtained using `e=>e.target.data`. |
| `mb-load`   | Triggered when the form first loads.             |
| `mb-submit` | Triggered with all the serialized data in the detail of the Event. |
