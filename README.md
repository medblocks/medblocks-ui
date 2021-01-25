![medblocks ui logo](./public/medblocks-ui-medium.png)

# Medblocks UI
Web Components for rapid development of openEHR systems. Read this blog post and watch this video to know more.

# Development
- This is a Svelte + Typescript project. It's a very easy framework to get started with if you know HTML, CSS and Javascript. 
- Bulma is being used as the CSS framework. You can customize it at `src/css/main.scss`.
- The `docgen.js` script automatically generate component customization values from JSDocs within `.svelte` files. The output is at `jsdocs.json`. The script is automatically run before `npm run build` and `npm run dev`.

## Install
```
npm install
```
## Start development server
```
npm run dev
```
