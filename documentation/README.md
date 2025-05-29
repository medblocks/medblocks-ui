# Medblocks UI Documentation

Welcome to the Medblocks UI documentation!

Medblocks UI is a collection of Web Components designed for rapid development of user interfaces for openEHR and FHIR systems. These components help healthcare professionals by providing intuitive and efficient ways to interact with medical data.

## Getting Started

To use Medblocks UI components in your project, you can install the package via npm:

```bash
npm install medblocks-ui
```

Then, you can import the components you need and use them in your HTML or templates.

**Example:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Medblocks UI Example</title>
  <script type="module" src="node_modules/medblocks-ui/dist/medblocks.js"></script>
</head>
<body>
  <mb-form>
    <mb-input path="patient_name" label="Patient Name"></mb-input>
    <mb-date path="date_of_birth" label="Date of Birth"></mb-date>
    <mb-submit label="Save"></mb-submit>
  </mb-form>

  <script>
    const form = document.querySelector('mb-form');
    form.addEventListener('mb-submit', (event) => {
      console.log('Form submitted:', event.detail);
    });
  </script>
</body>
</html>
```

This example shows a simple form with a text input for the patient's name, a date input for the date of birth, and a submit button. When the form is submitted, the `mb-submit` event is fired, and the form data can be accessed from `event.detail`.

For more information on how to use specific components, please refer to their individual documentation pages.

## Components

Medblocks UI provides a wide range of components for various data types and functionalities. The detailed documentation for each component is auto-generated from the source code and can be found in this directory.

Here's a list of the available components:

- [mb-auto-form](./mb-auto-form.md)
- [mb-buttons](./mb-buttons.md)
- [mb-checkbox-any](./mb-checkbox-any.md)
- [mb-checkbox](./mb-checkbox.md)
- [mb-context](./mb-context.md)
- [mb-date](./mb-date.md)
- [mb-dropdown](./mb-dropdown.md)
- [mb-duration](./mb-duration.md)
- [mb-fhir-form](./mb-fhir-form.md)
- [mb-filter](./mb-filter.md)
- [mb-form](./mb-form.md)
- [mb-input-multiple](./mb-input-multiple.md)
- [mb-input](./mb-input.md)
- [mb-option](./mb-option.md)
- [mb-percent](./mb-percent.md)
- [mb-proportion](./mb-proportion.md)
- [mb-quantity](./mb-quantity.md)
- [mb-search](./mb-search.md)
- [mb-select](./mb-select.md)
- [mb-submit](./mb-submit.md)
- [mb-text-select](./mb-text-select.md)
- [mb-unit](./mb-unit.md)

## Architecture Overview

Medblocks UI is built on top of Web Components standards, using LitElement for creating fast and lightweight components. The architecture is designed to be modular and extensible.

**Key Concepts:**

*   **`EhrElement` Base Class:** Most Medblocks UI components extend the `EhrElement` base class (located in `src/medblocks/EhrElement.ts`). This class provides common functionality such as:
    *   Handling the `path` attribute, which is crucial for mapping form data to openEHR or FHIR structures.
    *   Managing the `data` property of the component.
    *   Emitting standard events like `mb-input` when the component's value changes.
    *   Basic label rendering.

*   **Component Interaction:** Components are designed to work together within an `mb-form` or `mb-fhir-form`.
    *   The `mb-form` component acts as a container that collects data from all nested Medblocks UI elements. It handles data serialization, validation, and submission.
    *   Events like `mb-connect` and `mb-disconnect` are used by `mb-form` to keep track of the elements within it.
    *   The `path` attribute on each element allows the form to structure the data correctly.

*   **Data Binding and Events:**
    *   Components manage their own state and data. When a component's value changes (e.g., user input), it typically fires an `mb-input` event.
    *   The `mb-form` listens for these `mb-input` events to update its overall data representation.

*   **Styling and Customization:**
    *   Medblocks UI uses Shoelace components internally for many of its elements, providing a consistent and modern look and feel.
    *   Styling can be customized using CSS custom properties, similar to how Shoelace components are styled.

*   **`mb-form` and Plugins:**
    *   The `mb-form` component (in `src/medblocks/form/form.ts`) is central to data collection and management.
    *   It supports a plugin system to adapt to different backend data formats. Currently, there's a built-in plugin for the openEHR FLAT format (`openEHRFlatPlugin`). This plugin handles:
        *   **Parsing:** Converting data from the backend format (e.g., openEHR FLAT) into a structure that the form components can understand and display.
        *   **Serialization:** Converting the form's internal data representation back into the specified backend format upon submission.
    *   This plugin architecture allows for potential future support for other formats like FHIR resources directly through `mb-form` or specialized form components like `mb-fhir-form`.

*   **`mb-fhir-form`:**
    *   The `mb-fhir-form` component (in `src/medblocks/form/fhirForm.ts`) is a specialized version of `mb-form` tailored for working with FHIR resources. It likely uses a FHIR-specific plugin or has built-in logic to handle FHIR data structures.

This modular design allows developers to pick and choose the components they need and integrate them into their applications for building healthcare interfaces efficiently.

## Contributing

Contributions are welcome! If you'd like to contribute to Medblocks UI, please refer to the main [README.md](../../README.md) for guidelines.
