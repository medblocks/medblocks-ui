![medblocks ui logo](https://i.imgur.com/pQ8MrTJ.png)

# Medblocks UI

> [![Medblocks UI Web components demo](https://i.ytimg.com/vi/GRBIUEA_fc8/maxresdefault.jpg)](https://www.youtube.com/watch?v=GRBIUEA_fc8)
Click the image to watch the video

## Getting Started

Medblocks UI is a web component library for building openEHR and FHIR UIs. It extends an array of web components that is compatible with all frameworks. You can use the Medblocks UI VSCode Extension to create the UI elements for you [here.](https://medblocks.com/docs/medblocks-ui/VSCode%20Extension)

## Quick Start

### Import the JS to your HTML file

```html title="index.html"
<head>
  ...
  <!-- Styles -->
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.9.0/cdn/themes/light.css"
  />
</head>
<body>
  ...
  <!-- Main Package -->
  <script src="https://unpkg.com/medblocks-ui@0.0.180/dist/bundle.js"></script>
</body>
```

If you want to use it with other frameworks like React, Vue, Angular, Svelte, etc. You can check out the installation page.

### Create a form based on a template

The template used in the example is [blood_pressure](https://medblocks.com/docs/blood_pressure.json). It captures two simple fields - Systolic, Diastolic blood pressure and Date Time at which it was captured.
Medblocks UI supports the FlatPath format of openEHR compositions.

First lets add the necessary contexts to the form such as language, category and territory. We will use the `mb-context` with the path attribute to add the contexts.

```html
<mb-form>
  <mb-context path="blood_pressure/language" />
  <mb-context path="blood_pressure/encoding" />
  <mb-context path="blood_pressure/subject" />
</mb-form>
```

Then we add the necessary fields to capture the data.

```html title="index.html"
<mb-form>
  <mb-context path="blood_pressure/language" />
  <mb-context path="blood_pressure/encoding" />
  <mb-context path="blood_pressure/subject" />
  <mb-quantity
    default="mm[Hg]"
    path="blood_pressure/any_event:0/systolic"
    label="Systolic"
  >
    <mb-unit unit="mm[Hg]" label="mm[Hg]" min="" max="1000"></mb-unit>
  </mb-quantity>
  <mb-quantity
    default="mm[Hg]"
    path="blood_pressure/any_event:0/diastolic"
    label="Diastolic"
  >
    <mb-unit unit="mm[Hg]" label="mm[Hg]" min="" max="1000"></mb-unit>
  </mb-quantity>
  <mb-context path="blood_pressure/any_event:0/time"></mb-context>
</mb-form>
```

The same is rendered as:
![Blood Pressure form in Medblocks UI](https://medblocks.com/docs/img/bp_html.png)

Now add a submit button so that we can submit the composition.

```html
...
<body>
  <mb-form>
    ...
    <mb-submit> Submit </mb-submit>
  </mb-form>
</body>
```

Now listen to the submit event and submit the composition.

```html
...
<body>
  <mb-form id="form"> ... </mb-form>
  <script>
    // Listen to the submit event
    document
      .getElementbyId('form')
      .addEventListener('mb-submit', async function (e) {
        await fetch('<server-url>', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(e.target.data),
        });
      });
  </script>
</body>
```

To understand more about the different components and their usage, check out the [components](https://medblocks.com/docs/medblocks-ui/usage) page.

For advanced or framework specific usage you can take a look at our [docs](https://medblocks.com/docs/medblocks-ui/)

## Contributing

Contributors welcome! User Interface generation is an important problem to solve in the healthcare industry. Too many times, health care professionals face burn out due bad design choices.

If you find this repository useful, fork it, use it! If you want to contribute, note the following:

- This is a [Lit-Element](https://lit-element.polymer-project.org/guide) project written in typescript.
- Most of the default components use [Shoelace](https://shoelace.style/) webcomponents. You can customize all the components the same way you [customize shoelace](https://shoelace.style/getting-started/customizing) `src/css/main.scss`.
- For bug, or new feature requests, create an issue.
