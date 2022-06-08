import commandLineArgs from "command-line-args";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import del from "del";
import prettier from "prettier";
import {pascalCase} from "pascal-case";

import {getAllComponents} from "./getAllComponents.mjs";

const { outdir } = commandLineArgs({ name: 'outdir', type: String });
const reactDir = path.join(outdir, './src/react');

del.sync(reactDir);
fs.mkdirSync(reactDir, {recursive: true});

const metadata = JSON.parse(fs.readFileSync(path.join(outdir, 'custom-elements.json'), 'utf8'));
const components = getAllComponents(metadata);
const index = [];

components.map(component => {
  try{
    const tagWithoutPrefix = component.tagName.replace(/^mb-/, '');
    const componentDir = path.join(reactDir, tagWithoutPrefix);
    const componentFile = path.join(componentDir, 'index.ts');
    const importPath = component.modulePath.replace(/^src\//, '').replace(/\.ts$/, '');
    const events = (component.events || []).map(event => `${pascalCase(event.name)}: '${event.name}'`).join(',\n');
    fs.mkdirSync(componentDir, { recursive: true });

    const source = prettier.format(
      `
        import * as React from 'react';
        import { createComponent } from '@lit-labs/react';
        import Component from '../../${importPath}';
        export default createComponent(
          React,
          '${component.tagName}',
          Component,
          {
            ${events}
          }
        );
      `,
      Object.assign({
          arrowParens: 'avoid',
          bracketSpacing: true,
          htmlWhitespaceSensitivity: 'css',
          insertPragma: false,
          bracketSameLine: false,
          jsxSingleQuote: false,
          printWidth: 120,
          proseWrap: 'preserve',
          quoteProps: 'as-needed',
          requirePragma: false,
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'none',
          useTabs: false
        }, {
        parser: 'babel-ts'
      })
    );

    index.push(`export { default as ${component.name} } from './${tagWithoutPrefix}';`);
    console.log(chalk.bgGrey(`Exported ${component.name} `));
    fs.writeFileSync(componentFile, source, 'utf8');


  }catch(e){
    console.log(chalk.red(component));
  };
});

fs.writeFileSync(path.join(reactDir, 'index.ts'), index.join('\n'), 'utf8');

console.log(chalk.cyan(`\nComponents have been wrapped for React! 📦\n`));
