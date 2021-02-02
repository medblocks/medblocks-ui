import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import copy from "rollup-plugin-copy";
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss'
import postcss from 'postcss'
import purgecss from '@fullhuman/postcss-purgecss'
import fs from "fs";
import posthtml from "posthtml";
import { hash } from "posthtml-hash";
import htmlnano from "htmlnano";
import rimraf from "rimraf";
import { liveServer } from 'rollup-plugin-live-server'
import json from "@rollup/plugin-json"

const production = !process.env.ROLLUP_WATCH;
const OUT_DIR = "build";
function hashStatic() {
	return {
		name: "hash-static",
		buildStart() {
			rimraf.sync(OUT_DIR);
		},
		writeBundle() {
			posthtml([
				// hashes `bundle.[hash].css` and `bundle.[hash].js`
				hash({ path: OUT_DIR }),

				// minifies `build/index.html`
				// https://github.com/posthtml/htmlnano
				htmlnano(),
			])
				.process(fs.readFileSync(`${OUT_DIR}/index.html`))
				.then((result) =>
					fs.writeFileSync(`${OUT_DIR}/index.html`, result.html)
				);
		},
	};
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'app',
		file: `${OUT_DIR}/bundle.[hash].js`
	},
	plugins: [
		copy({ targets: [{ src: "public/*", dest: OUT_DIR }] }),
		svelte({
			customElement: true,
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			// css: true,
			preprocess: sveltePreprocess(),
			include: /\.wc\.svelte$/

		}),
		svelte({
			customElement: false,
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			// css: true,
			preprocess: sveltePreprocess(),
			exclude: /\.wc\.svelte$/

		}),
		json(),
		scss({
			processor: css => postcss(
				[purgecss({
					content: [
						"src/**/*.svelte",
						"public/index.html",
					],
				})]
			)
				.process(css)
				.then(result => result.css),
			output: 'build/bulma.css'
		}),
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),
		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && liveServer({
			port: 5000,
			host: "0.0.0.0",
			root: "build",
			file: "index.html",
			open: false,
			wait: 2000
		}),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload(OUT_DIR),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
		production && hashStatic()
	],
	// watch: {
	// 	clearScreen: false,
	// 	chokidar: false
	// }
};
