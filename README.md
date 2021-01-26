![medblocks ui logo](./public/medblocks-ui-medium.png)

# Medblocks UI
Web Components for rapid development of openEHR systems. Read this [blog post](https://blog.medblocks.org/2021-01-26-introducing-medblocks-ui/) to learn more.

A live version can be found at: https://sidharthramesh.github.io/medblocks-ui/

# Notes for Developers
- This is a [Svelte](https://svelte.dev/) + Typescript project. It's an easy framework to get started with if you know HTML, CSS and Javascript. 
- [Bulma](https://bulma.io/) is being used as the CSS framework. You can customize it at `src/css/main.scss`.
- The `docgen.js` script automatically generates component customization values from JSDocs within `.svelte` files. The output is at `jsdocs.json`. The script is automatically run before `npm run build` and `npm run dev`.

## Install
```
npm install
```
## Start development server
```
npm run dev
```

If you are using another frontend framework like React, Angular, or VueJS in your project, you can still compile these components into web-components. This [tutorial](https://dev.to/silvio/how-to-create-a-web-components-in-svelte-2g4j) provides more information. The compiled components are light-weight and does not include a Svelte specific runtime. As a result, the bundle size is [small](https://pianomanfrazier.com/post/comparing-svelte-stencil/), and the components are performant.

# Contribution
Contributors welcome! User Interface generation is an important problem to solve in the healthcare industry. Too many times, health care professionals face burn out due bad design choices. You can learn more about me [here](https://blog.medblocks.org/aboutme/).

If you find this repository useful, fork it, use it! If you want to contribute, note the following:
- All commits must follow [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0/). The vscode extension has been added to the `.vscode/extensions.json` file. Changelog is generated automatically using [standard-version](https://www.npmjs.com/package/standard-version).
- For new features, tests should be written first. Tests are written using [Testing Library](https://testing-library.com/docs/svelte-testing-library/intro) and [Jest](https://jestjs.io/).
- For bug fixes, create an issue first. Then submit your pull request.