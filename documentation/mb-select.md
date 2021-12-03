# mb-select

## Properties

| Property      | Attribute     | Type                                    | Default | Description                                      |
|---------------|---------------|-----------------------------------------|---------|--------------------------------------------------|
| `data`        | `data`        | `CodedText \| CodedText[] \| undefined` |         | Data of CodedText                                |
| `datatype`    | `datatype`    | `string \| undefined`                   |         | An internal representation of type to handle serializing |
| `isMbElement` |               | `boolean`                               | true    |                                                  |
| `label`       | `label`       | `string \| undefined`                   |         | Optional label for the element                   |
| `multiple`    | `multiple`    | `boolean`                               | false   |                                                  |
| `path`        | `path`        | `string`                                |         | Path of the data element. Use the VSCode extension to get the appropriate paths |
| `placeholder` | `placeholder` | `string`                                |         |                                                  |
| `required`    | `required`    | `boolean`                               | false   |                                                  |
| `terminology` | `terminology` | `string`                                | "local" | Terminology of preference. Eg: SNOMED-CT, LOINC, local (for openEHR) |
| `value`       | `value`       | `string`                                | ""      |                                                  |

## Methods

| Method              | Type                                             | Description                                      |
|---------------------|--------------------------------------------------|--------------------------------------------------|
| `getLabel`          | `(code: string): string`                         |                                                  |
| `getOrdinal`        | `(code: string): number \| undefined`            |                                                  |
| `getValue`          | `(data: CodedText \| CodedText[] \| undefined): string \| string[]` |                                                  |
| `handleChildChange` | `(): void`                                       |                                                  |
| `handleInput`       | `(e: CustomEvent<any>): void`                    |                                                  |
| `handlePathChange`  | `(oldPath: string, newPath: string): void`       |                                                  |
| `reportValidity`    | `(): boolean`                                    | Function to validate the element during form submit |

## Events

| Event           | Description                                      |
|-----------------|--------------------------------------------------|
| `mb-connect`    | Dispatched when the component connects           |
| `mb-dependency` | Dispatched if dependencies are needed from an external or parent source |
| `mb-disconnect` | Dispatched when the component disconnects        |
| `mb-input`      | Dispatched when the input changes                |
