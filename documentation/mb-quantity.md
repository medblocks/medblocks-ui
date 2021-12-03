# mb-quantity

## Properties

| Property      | Attribute  | Type                    | Default | Description                                      |
|---------------|------------|-------------------------|---------|--------------------------------------------------|
| `data`        | `data`     | `Quantity \| undefined` |         | Data of the element. Setting this will emit an input event automatically. |
| `datatype`    | `datatype` | `string \| undefined`   |         | An internal representation of type to handle serializing |
| `default`     | `default`  | `string`                |         | The default unit to choose. Must be the `value` of a child mb-option element |
| `disabled`    | `disabled` | `boolean`               |         |                                                  |
| `hideunit`    | `hideunit` | `boolean`               | false   | Hides the units. Make sure to set a default unit, or set it programatically. |
| `isMbElement` |            | `boolean`               | true    |                                                  |
| `label`       | `label`    | `string \| undefined`   |         | Optional label for the element                   |
| `max`         | `max`      | `string \| number`      |         |                                                  |
| `min`         | `min`      | `string \| number`      |         |                                                  |
| `path`        | `path`     | `string`                |         | Path of the data element. Use the VSCode extension to get the appropriate paths |
| `required`    | `required` | `boolean`               | false   | Required form validation                         |
| `step`        | `step`     | `number`                |         |                                                  |
| `units`       |            | `MbUnit[]`              | []      |                                                  |

## Methods

| Method              | Type                                       | Description                                      |
|---------------------|--------------------------------------------|--------------------------------------------------|
| `handleChildChange` | `(): void`                                 |                                                  |
| `handleInput`       | `(e: CustomEvent<any>): void`              |                                                  |
| `handlePathChange`  | `(oldPath: string, newPath: string): void` |                                                  |
| `handleSelect`      | `(e: CustomEvent<any>): void`              |                                                  |
| `reportValidity`    | `(): boolean`                              | Function to validate the element during form submit |

## Events

| Event           | Description                                      |
|-----------------|--------------------------------------------------|
| `mb-connect`    | Dispatched when the component connects           |
| `mb-dependency` | Dispatched if dependencies are needed from an external or parent source |
| `mb-disconnect` | Dispatched when the component disconnects        |
| `mb-input`      | Dispatched when the input changes                |
