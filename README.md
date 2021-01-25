![medblocks ui logo](./public/medblocks-ui-medium.png)

# Medblocks UI
Web Components for rapid development of openEHR systems. Read this blog post and watch this video to know more.

# Notes for Developers
- This is a [Svelte](https://svelte.dev/) + Typescript project. It's a very easy framework to get started with if you know HTML, CSS and Javascript. 
- [Bulma](https://bulma.io/) is being used as the CSS framework. You can customize it at `src/css/main.scss`.
- The `docgen.js` script automatically generate component customization values from JSDocs within `.svelte` files. The output is at `jsdocs.json`. The script is automatically run before `npm run build` and `npm run dev`.
- All commits must follow the [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0/). The VScode extension has been added to the `.vscode/extensions.json` file.

## Install
```
npm install
```
## Start development server
```
npm run dev
```

Contributors welcome! Not many open-source tools are found for interface generation based on openEHR. If you find this repository useful, fork it, use it! Please also contribute by creating Pull requests and Issues.