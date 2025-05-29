# `mb-auto-form`

The `<mb-auto-form>` component is a powerful tool within Medblocks UI that dynamically generates an entire form structure based on a provided **webTemplate** (typically an openEHR operational template). This allows for rapid development of data entry interfaces directly from the data definitions.

It wraps an internal `<mb-form>` component and populates it with appropriate Medblocks UI elements (`<mb-input>`, `<mb-select>`, `<mb-date>`, etc.) according to the structure and types defined in the webTemplate.

## Basic Usage

To use `<mb-auto-form>`, you primarily need to provide it with a `webTemplate` object.

```html
<mb-auto-form id="myForm"></mb-auto-form>

<script>
  const myFormElement = document.getElementById('myForm');

  // Assuming 'myOpenEHRTemplate' is a JavaScript object representing your webTemplate
  myFormElement.webTemplate = myOpenEHRTemplate;

  // You might also provide context data
  myFormElement.ctx = {
    language: 'en',
    territory: 'US',
    composer_name: 'Dr. John Doe'
    // ... other context properties
  };

  // Listen for the submission of the internally generated mb-form
  myFormElement.addEventListener('mb-input', (event) => {
    // Note: mb-auto-form itself doesn't fire mb-submit directly.
    // You would typically have a submit button that calls myFormElement.export() or myFormElement.submit()
    // and then you handle the data.
    // The mb-input event fires when any internal input changes.
    console.log('Form data changed:', myFormElement.export());
  });

  // To get data out:
  // const formData = myFormElement.export();
  // or
  // const formData = myFormElement.submit(); // This also validates
</script>
```

This example shows the basic setup. The actual form UI will be generated inside `<mb-auto-form>` once the `webTemplate` property is set.

## Properties

The `<mb-auto-form>` component supports several properties to control its behavior and data:

| Property       | Attribute      | Type                | Default     | Description                                                                                                                               |
|----------------|----------------|---------------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `templateId`   | `templateid`   | `string`            | `''`        | An identifier for the template being used. This is often passed to the internal `mb-form`.                                                |
| `webTemplate`  | N/A            | `object`            | `undefined` | **Required**. The JavaScript object representing the openEHR web template (or a similar structure) that defines the form to be generated. Setting this property triggers the form generation. |
| `ctx`          | N/A            | `object`            | `{}`        | Context object, similar to the `ctx` property in `mb-form`. This can be used to provide context information like language, territory, composer details, etc., which might be used by some auto-generated context elements or during submission. |
| `config`       | N/A            | `object`            | `{}`        | A configuration object that can be used to customize the generation of specific elements. See "Configuration Object" section for details. |
| `variant`      | `variant`      | `string`            | `'small'`   | The display variant for the generated components (e.g., 'small', 'normal', 'text'). This is passed down to the internal `mb-form` and its elements. |
| `addContext`   | `addcontext`   | `boolean`           | `false`     | If set to `true`, predefined context nodes (`_health_care_facility` and `_participation`) will be added to the template's context section during form generation. |
| `handleSearch` | N/A            | `SearchFunction`    | `undefined` | A function to handle search operations for components like `mb-search` that might be generated within the form. This is passed down to the internal `mb-form`. |

## Methods

`<mb-auto-form>` provides methods to interact with the generated form:

| Method   | Parameters                               | Returns         | Description                                                                                                                                                   |
|----------|------------------------------------------|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `import` | `composition: MBComposition`             | `void`          | Binds the provided `composition` data to the dynamically generated form elements. `MBComposition` is an object where keys are paths and values are the data for those paths. This method handles setting values for regular inputs as well as managing repeatable sections. |
| `export` |                                          | `MBComposition` | Serializes and returns the current data from the generated form. This is equivalent to calling `serialize()` on the internal `mb-form`.                         |
| `submit` |                                          | `MBComposition` | Validates the form, inserts context data (if applicable), and then serializes and returns the form data. This is equivalent to calling `submit()` on the internal `mb-form`. If validation fails, it may return `undefined` or throw an error, depending on the internal `mb-form` behavior. |
| `clear`  |                                          | `void`          | Clears all data from the generated form by binding an empty object (`{}`) to it.                                                                                |

**Note on Events:**

While `<mb-auto-form>` itself doesn't emit many custom events, it does propagate the `mb-input` event from its internal `<mb-form>`. This event fires whenever any data within the generated form changes.

To handle form submission, you would typically:
1. Have an external submit button.
2. On button click, call the `submit()` or `export()` method on your `<mb-auto-form>` instance.
3. Process the returned data.

```javascript
const autoForm = document.querySelector('mb-auto-form');
const submitButton = document.getElementById('mySubmitButton');

submitButton.addEventListener('click', async () => {
  const formData = await autoForm.submit(); // or autoForm.export();
  if (formData) {
    // Send formData to server or process it
    console.log('Form submitted successfully:', formData);
  } else {
    console.log('Form validation failed or no data to submit.');
  }
});
```

## The `webTemplate` Object

The `webTemplate` object is the blueprint for the form generation. It's typically derived from an openEHR operational template and describes the data points, their types, constraints, and hierarchy. `<mb-auto-form>` traverses this structure to create the UI.

Each node in the `webTemplate.tree` (which is the main part `mb-auto-form` processes) generally has the following key properties that influence form generation:

| Property   | Type         | Description                                                                                                                                                              |
|------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`       | `string`     | The ID of the node in the template.                                                                                                                                      |
| `name`     | `string`     | The human-readable name or label for the data point or section. This is often used as the label for generated form elements or as a heading for sections.                 |
| `rmType`   | `string`     | The openEHR Reference Model type (e.g., `DV_TEXT`, `DV_CODED_TEXT`, `DV_QUANTITY`, `DV_DATE_TIME`, `COMPOSITION`, `SECTION`, `CLUSTER`, `ELEMENT`, `EVENT_CONTEXT`). This is a primary factor in determining which Medblocks UI component is rendered. |
| `min`      | `number`     | The minimum occurrence of this node. A `min` of `0` means the field is optional.                                                                                         |
| `max`      | `number`     | The maximum occurrence of this node. A `max` of `-1` or a value greater than `1` typically indicates a repeatable element or section.                                   |
| `aqlPath`  | `string`     | The AQL (Archetype Query Language) path for this node. This is often used internally for path generation.                                                                |
| `path`     | `string`     | (Often added during processing by `autoform-utils`) The full path to the node from the root of the template, used for data binding. Example: `section_a/item_b:0/value`. |
| `children` | `array`      | An array of child nodes. If a node has children, it's typically rendered as a structural element (like a section or cluster) with nested elements.                        |
| `inputs`   | `array`      | For `DV_CODED_TEXT` and some other types, this array describes the possible coded values (options) or specific input fields (like `suffix: 'code'` or `suffix: 'value'`).  |
| `inContext`| `boolean`    | If true, indicates this node is part of the template's context section (e.g., `EVENT_CONTEXT`). These are often handled as `mb-context` elements.                         |

### Mapping `rmType` to Form Elements

While the exact mapping is handled by an internal `transform` function (imported from `src/utils.ts` within the Medblocks UI codebase, but not detailed in `autoform-utils.ts`), here's a general idea of how `rmType` values translate to UI:

*   **`COMPOSITION`, `SECTION`, `CLUSTER`, `EVENT_CONTEXT`:** These are structural elements. They are typically rendered as `div` containers with headings (derived from the node's `name`). The children of these nodes are then rendered within these containers.
*   **`DV_TEXT`:** Usually maps to `<mb-input>`. If the `config` object specifies this path for a `TEXT_AREA`, it will render `<mb-input textarea></mb-input>`.
*   **`DV_CODED_TEXT`:** The mapping is more complex:
    *   If the `inputs` list (value set) is small (e.g., <= 3 options), it might render as `<mb-buttons>` with nested `<mb-option>`.
    *   If the list is larger, it might render as `<mb-select>` with nested `<mb-option>`.
    *   If there's no predefined list or it's configured for external search, it will render as `<mb-search>`.
*   **`DV_BOOLEAN`:** Maps to `<mb-checkbox>`.
*   **`DV_DATE`:** Maps to `<mb-date>`.
*   **`DV_DATE_TIME`:** Also typically maps to `<mb-date>` (which can handle date-time).
*   **`DV_TIME`:** Could map to a specialized time input if available, or `<mb-input type="time">`.
*   **`DV_COUNT`, `DV_ORDINAL`:** Might map to `<mb-input type="number">` or a specialized ordinal component. `DV_ORDINAL` options are often rendered as `<mb-select>` or `<mb-buttons>`.
*   **`DV_QUANTITY`:** Maps to `<mb-quantity>`, which includes a field for the value and a unit selector.
*   **`DV_DURATION`:** Maps to `<mb-duration>`.
*   **`DV_PROPORTION`:** Maps to `<mb-proportion>` or `<mb-percent>`.
*   **`DV_MULTIMEDIA`:** Maps to `<mb-multimedia>`.
*   **`ELEMENT`:** This is a wrapper type in openEHR. The actual UI element depends on the `ELEMENT`'s `rmType` (e.g., an `ELEMENT` with a `DV_TEXT` inside).

### Repeatable Sections (`max = -1`)

If a node in the `webTemplate` has `max: -1` (or `max > 1`) and has `children`, `<mb-auto-form>` generates a repeatable section.
*   An `<mb-repeatable-headless>` component is used internally to manage the state of repetitions.
*   "Add" and "Delete" buttons are dynamically generated to allow users to add new instances of the section or remove existing ones.
*   The `path` for elements within repeatable sections will include an index (e.g., `section_a/item_b:0/value`, `section_a/item_b:1/value`).

The `autoform-utils.ts` file contains the logic for dynamically adding and removing these indexed sections in the DOM when the user clicks these buttons.

## Dynamic Generation Process

The core logic for generating the form resides in `src/medblocks/form/autoform-utils.ts`. Here's a simplified overview of the process:

1.  **Trigger:** When the `webTemplate` property of `<mb-auto-form>` is set, it calls the `generateAutoForm()` method.
2.  **Tree Creation (`createAutoFormTree`):**
    *   This function takes the raw `webTemplate` (specifically `webTemplate.tree`).
    *   If the `addContext` property is true, it injects predefined context nodes (like `_health_care_facility`) into the context part of the template tree.
    *   It then recursively traverses the template tree, assigning a full `path` to each node (e.g., `section_id/item_id:0/value_id`).
    *   Crucially, it calls `addMbElements` to determine the appropriate Medblocks UI component for each node.
3.  **Assigning UI Elements (`addMbElements` and `handleLeafNode`):**
    *   `addMbElements` recursively processes the tree.
    *   For "leaf" nodes (actual data points), `handleLeafNode` decides which component to use. This decision is based on the node's `rmType`, `inputs` (for value sets), and any relevant `config` settings.
    *   The chosen component is not instantiated directly but is represented as an HTML string (e.g., `<mb-input path="..."></mb-input>`) stored in the `mbElement` property of the node. This HTML string is generated by an external `transform` function (from `src/utils.ts`), which is a key part of the component mapping.
    *   For nodes with `children` that are repeatable (`max: -1`), `addMbElements` sets the `mbElement` property to an `<mb-repeatable-headless path="..."></mb-repeatable-headless>` string.
4.  **DOM Construction (`traverse`):**
    *   Once the processed tree (with `mbElement` strings on relevant nodes) is ready, the `traverse` function is called.
    *   This function walks the processed tree and builds the actual DOM inside the `<mb-auto-form>` component's shadow DOM (specifically, within a `div#autoForm` inside the internal `<mb-form>`).
    *   For each node:
        *   If it's a structural node (like a `SECTION` or `CLUSTER`), it creates a `div` with a heading (from `node.name`).
        *   If the node represents a repeatable section of child elements (`max: -1` and has `children`), it sets up the structure for that section, including "Add" and "Delete" buttons. The `innerHTML` for the repeatable item itself is often derived from traversing its children. An `<mb-repeatable-headless>` component is added to the container of these repeatable sections to manage their state.
        *   If it's a leaf node with an `mbElement` string, it sets the `innerHTML` of its corresponding `div` to this HTML string, effectively rendering the Medblocks component.
        *   Special handling for `mb-search` (assigning `handleSearch` function) and `mb-multimedia` (applying plugins) occurs here.
5.  **Repeatable Section UI Logic:**
    *   The `traverse` function also sets up event listeners for the "Add" (`addButtonEventListener` and `runAddEventListener`) and "Delete" (`deleteButtonEventListener`) buttons associated with repeatable sections.
    *   When "Add" is clicked:
        *   It finds a "reference" version of the repeatable item's DOM structure (which was initially created and hidden).
        *   It clones this reference structure.
        *   It updates the `id` and `path` attributes of the cloned elements to have the next appropriate index.
        *   It appends the cloned structure to the form.
    *   When "Delete" is clicked, it removes the corresponding section from the DOM.

The `<mb-auto-form>` essentially orchestrates this process, using utility functions to parse the template, decide on UI components, and then build the DOM tree with those components, including the interactive elements for repeatable sections.

## Configuration Object (`config`)

The `config` property allows for some customization of the auto-generated form elements. It's an object where keys typically correspond to specific features or element paths.

Based on the `autoform-utils.ts` code, here are some known configurations:

*   **`TEXT_AREA`**: `string[]`
    *   An array of full `path` strings. If an `<mb-input>` is generated for a path included in this array, it will have the `textarea` attribute set to `true`, rendering it as a multi-line text area instead of a single-line input.
    *   Example:
        ```javascript
        myFormElement.config = {
          TEXT_AREA: [
            'clinical_summary/symptoms/symptom:0/description',
            'clinical_summary/symptoms/symptom:1/description'
          ]
        };
        ```

*   **`MB_VALUESET`**: `string[]` (This is inferred, but not explicitly used in the provided `autoform-utils.ts` for `mb-auto-form` generation logic directly influencing component choice like `DV_CODED_TEXT`'s options. However, such a pattern is common for overriding or providing value sets.)
    *   While not directly visible in the `autoform-utils.ts` logic for choosing between buttons/select/search for `DV_CODED_TEXT` (that seems to depend on `node.inputs[...].list.length`), a `config` property like this *could* be used by the underlying `transform` function or other parts of Medblocks UI to provide or restrict value sets for certain coded text elements. Further investigation into the `transform` utility would be needed to confirm its specific usage.

**General Pattern for `config`:**

The `config` object is passed down through various stages of form generation. It's likely that the external `transform` function (responsible for converting a template node into an HTML string for a Medblocks component) might also inspect this `config` object for hints on how to render specific elements.

If you need to customize other aspects of component generation, you might need to:
1.  Examine the `transform` function used by Medblocks UI to see what configuration options it supports.
2.  Potentially extend `autoform-utils.ts` or the `transform` function if the desired customization is not available.

The provided code for `autoform-utils.ts` primarily shows the `TEXT_AREA` usage. Other configurations might exist or could be added.
