# mb-buttons

An array of buttons to choose from. Expects nested mb-options to actually render buttons.

## Properties

| Property      | Attribute     | Type                  | Default | Description                                      |
|---------------|---------------|-----------------------|---------|--------------------------------------------------|
| `data`        | `data`        |                       |         | Data of CodedText                                |
| `datatype`    | `datatype`    | `string \| undefined` |         | An internal representation of type to handle serializing |
| `isMbElement` |               | `boolean`             | true    |                                                  |
| `label`       | `label`       | `string \| undefined` |         | Optional label for the element                   |
| `path`        | `path`        | `string`              |         | Path of the data element. Use the VSCode extension to get the appropriate paths |
| `required`    | `required`    | `boolean`             | false   |                                                  |
| `terminology` | `terminology` | `string`              | "local" | Terminology of preference. Eg: SNOMED-CT, LOINC, local (for openEHR) |
| `value`       | `value`       | `string`              | ""      |                                                  |

## Methods

| Method             | Type                                       | Description                                      |
|--------------------|--------------------------------------------|--------------------------------------------------|
| `handlePathChange` | `(oldPath: string, newPath: string): void` |                                                  |
| `reportValidity`   | `(): boolean`                              | Function to validate the element during form submit |

## Events

| Event           | Description                                      |
|-----------------|--------------------------------------------------|
| `mb-connect`    | Dispatched when the component connects           |
| `mb-dependency` | Dispatched if dependencies are needed from an external or parent source |
| `mb-disconnect` | Dispatched when the component disconnects        |
| `mb-input`      | Dispatched when the input changes                |
