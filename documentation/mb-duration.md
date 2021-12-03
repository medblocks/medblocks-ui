# mb-duration

## Properties

| Property      | Attribute  | Type                  | Default | Description                                      |
|---------------|------------|-----------------------|---------|--------------------------------------------------|
| `data`        |            | `string \| undefined` |         | Data of the element. Setting this will emit an input event automatically. |
| `datatype`    | `datatype` | `string \| undefined` |         | An internal representation of type to handle serializing |
| `day`         | `day`      | `boolean`             | false   |                                                  |
| `disabled`    | `disabled` | `boolean`             |         |                                                  |
| `hour`        | `hour`     | `boolean`             | false   |                                                  |
| `isMbElement` |            | `boolean`             | true    |                                                  |
| `label`       | `label`    | `string \| undefined` |         | Optional label for the element                   |
| `minute`      | `minute`   | `boolean`             | false   |                                                  |
| `month`       | `month`    | `boolean`             | false   |                                                  |
| `path`        | `path`     | `string`              |         | Path of the data element. Use the VSCode extension to get the appropriate paths |
| `required`    | `required` | `boolean`             | false   |                                                  |
| `second`      | `second`   | `boolean`             | false   |                                                  |
| `week`        | `week`     | `boolean`             | false   |                                                  |
| `year`        | `year`     | `boolean`             | false   |                                                  |

## Methods

| Method             | Type                                             | Description                                      |
|--------------------|--------------------------------------------------|--------------------------------------------------|
| `formatDuration`   | `(value: string): string`                        |                                                  |
| `getInputs`        | `(): TemplateResult[]`                           |                                                  |
| `getPart`          | `(periodPart: string, part: string): string \| undefined` |                                                  |
| `handleInput`      | `(value: string, e: CustomEvent<any>): void`     |                                                  |
| `handlePathChange` | `(oldPath: string, newPath: string): void`       |                                                  |
| `parsePeriod`      | `(period: string \| undefined): void`            |                                                  |
| `reportValidity`   | `(): boolean`                                    | Function to validate the element during form submit |
| `serializePeriod`  | `(): string \| undefined`                        |                                                  |

## Events

| Event           | Description                                      |
|-----------------|--------------------------------------------------|
| `mb-connect`    | Dispatched when the component connects           |
| `mb-dependency` | Dispatched if dependencies are needed from an external or parent source |
| `mb-disconnect` | Dispatched when the component disconnects        |
| `mb-input`      | Dispatched when the input changes                |
