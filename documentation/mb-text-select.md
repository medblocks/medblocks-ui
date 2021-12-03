# mb-text-select

## Properties

| Property      | Attribute     | Type                              | Default | Description                                      |
|---------------|---------------|-----------------------------------|---------|--------------------------------------------------|
| `data`        | `data`        | `string \| string[] \| undefined` |         | Data of the element. Setting this will emit an input event automatically. |
| `datatype`    | `datatype`    | `string \| undefined`             |         | An internal representation of type to handle serializing |
| `isMbElement` |               | `boolean`                         | true    |                                                  |
| `label`       | `label`       | `string \| undefined`             |         | Optional label for the element                   |
| `multiple`    | `multiple`    | `boolean`                         | false   |                                                  |
| `path`        | `path`        | `string`                          |         | Path of the data element. Use the VSCode extension to get the appropriate paths |
| `placeholder` | `placeholder` | `string`                          |         |                                                  |
| `required`    | `required`    | `boolean`                         | false   |                                                  |
| `terminology` | `terminology` | `string`                          |         |                                                  |

## Methods

| Method              | Type                                       | Description                                      |
|---------------------|--------------------------------------------|--------------------------------------------------|
| `handleChildChange` | `(): void`                                 |                                                  |
| `handleInput`       | `(e: CustomEvent<any>): void`              |                                                  |
| `handlePathChange`  | `(oldPath: string, newPath: string): void` |                                                  |
| `reportValidity`    | `(): boolean`                              | Function to validate the element during form submit |

## Events

| Event           | Description                                      |
|-----------------|--------------------------------------------------|
| `mb-connect`    | Dispatched when the component connects           |
| `mb-dependency` | Dispatched if dependencies are needed from an external or parent source |
| `mb-disconnect` | Dispatched when the component disconnects        |
| `mb-input`      | Dispatched when the input changes                |
