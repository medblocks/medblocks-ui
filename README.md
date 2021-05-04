![medblocks ui logo](./demo/medblocks-ui.png)

# Medblocks UI

Web Components for rapid development of openEHR systems. The [automatic form generator](https://sidharthramesh.github.io/medblocks-ui/) is depreciated. The current recommended workflow is to build custom UIs based on the need using web components.

[![Medblocks UI Web components demo](https://img.youtube.com/vi/ng9lkQKa2KE/0.jpg)](https://www.youtube.com/watch?v=ng9lkQKa2KE)

## Installation

```bash
npm i medblocks-ui
```

## Usage

```html
<script type="module">
  import '@shoelace-style/shoelace/dist/themes/base.css'; //Customize this to change the theme
  import 'medblocks-ui/medblocks.js';
</script>

<mb-form></mb-form>
```

## Testing with Web Test Runner

To run the suite of Web Test Runner tests, run

```bash
npm run test
```

To run the tests in watch mode (for &lt;abbr title=&#34;test driven development&#34;&gt;TDD&lt;/abbr&gt;, for example), run

```bash
npm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`

# Contribution

Contributors welcome! User Interface generation is an important problem to solve in the healthcare industry. Too many times, health care professionals face burn out due bad design choices. I believe that this needs to change. I've written more about this in my blog [here](https://blog.medblocks.org/aboutme/).

If you find this repository useful, fork it, use it! If you want to contribute, note the following:

- This is a [Lit-Element](https://lit-element.polymer-project.org/guide) project written in typescript.
- Most of the default components use [Shoelace](https://shoelace.style/) webcomponents. You can customize all the components the same way you [customize shoelace](https://shoelace.style/getting-started/customizing) `src/css/main.scss`.
- For bug, or new feature requests, create an issue.
