# mb-search

## Properties

| Property           | Attribute          | Type                                             | Default                                          | Description                                      |
|--------------------|--------------------|--------------------------------------------------|--------------------------------------------------|--------------------------------------------------|
| `axios`            | `axios`            | `AxiosInstance`                                  |                                                  |                                                  |
| `data`             | `data`             |                                                  |                                                  | Data of CodedText                                |
| `datatype`         | `datatype`         | `string \| undefined`                            |                                                  | An internal representation of type to handle serializing |
| `debounceInterval` | `debounceInterval` | `number`                                         | 150                                              |                                                  |
| `hits`             | `hits`             | `number`                                         | 10                                               |                                                  |
| `isMbElement`      |                    | `boolean`                                        | true                                             |                                                  |
| `label`            | `label`            | `string \| undefined`                            |                                                  | Optional label for the element                   |
| `mock`             | `mock`             | `string[]`                                       | []                                               |                                                  |
| `parentAxiosKey`   | `parentAxiosKey`   | `string`                                         | "hermes"                                         |                                                  |
| `path`             | `path`             | `string`                                         |                                                  | Path of the data element. Use the VSCode extension to get the appropriate paths |
| `plugin`           | `plugin`           | `{ search: SearchFunction; getConstraints: (filters: string[]) => string \| undefined; }` | {"search":"hermesPlugin","getConstraints":"joinSnomedConstraints"} |                                                  |
| `searchTerm`       | `searchTerm`       | `string`                                         |                                                  |                                                  |
| `terminology`      | `terminology`      | `string`                                         | "local"                                          | Terminology of preference. Eg: SNOMED-CT, LOINC, local (for openEHR) |
| `value`            | `value`            | `string`                                         | ""                                               |                                                  |

## Methods

| Method             | Type                                             | Description                                      |
|--------------------|--------------------------------------------------|--------------------------------------------------|
| `getResults`       | `(): Promise<TemplateResult \| TemplateResult[]>` | Function to get results from an external source  |
| `handlePathChange` | `(oldPath: string, newPath: string): void`       |                                                  |
| `reportValidity`   | `(): boolean`                                    | Function to validate the element during form submit |

## Events

| Event           | Description                                      |
|-----------------|--------------------------------------------------|
| `mb-connect`    | Dispatched when the component connects           |
| `mb-dependency` | Dispatched if dependencies are needed from an external or parent source |
| `mb-disconnect` | Dispatched when the component disconnects        |
| `mb-input`      | Dispatched when the input changes                |
