# mb-date

## Properties

| Property      | Attribute  | Type                  | Default | Description                                      |
|---------------|------------|-----------------------|---------|--------------------------------------------------|
| `data`        | `data`     | `string`              |         | Data of the element. Setting this will emit an input event automatically. |
| `datatype`    | `datatype` | `string \| undefined` |         | An internal representation of type to handle serializing |
| `disabled`    | `disabled` | `boolean`             |         |                                                  |
| `isMbElement` |            | `boolean`             | true    |                                                  |
| `label`       | `label`    | `string`              | ""      | Optional label for the element                   |
| `path`        | `path`     | `string`              |         | Path of the data element. Use the VSCode extension to get the appropriate paths |
| `required`    | `required` | `boolean`             | false   |                                                  |
| `time`        | `time`     | `boolean`             | false   |                                                  |

## Methods

| Method             | Type                                       | Description                                      |
|--------------------|--------------------------------------------|--------------------------------------------------|
| `handleInput`      | `(e: CustomEvent<any>): void`              |                                                  |
| `handlePathChange` | `(oldPath: string, newPath: string): void` |                                                  |
| `reportValidity`   | `(): boolean`                              | Function to validate the element during form submit |

## Events

| Event           | Description                                      |
|-----------------|--------------------------------------------------|
| `mb-connect`    | Dispatched when the component connects           |
| `mb-dependency` | Dispatched if dependencies are needed from an external or parent source |
| `mb-disconnect` | Dispatched when the component disconnects        |
| `mb-input`      | Dispatched when the input changes                |
