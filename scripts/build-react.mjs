import { execSync } from 'child_process';
import commandLineArgs from 'command-line-args';
import esbuild from "esbuild";
import del from "del";
import fs from "fs";
import chalk from "chalk";
import {globby} from "globby";


const { bundle, copydir, dir, serve, types } = commandLineArgs([
  { name: 'dir', type: String, defaultValue: 'dist' },
]);
const outdir = dir;

del.sync(outdir);
fs.mkdirSync(outdir, { recursive: true });

(async () => {
    console.log("Loaded Async code block");
    try{
      execSync(`cem analyze --packagejson --litelement --outdir "${outdir}"`, {stdio: "inherit"});
      execSync(`node scripts/make-react.mjs --outdir "${outdir}"`, { stdio: "inherit" });
      execSync(`tsc --project ./tsconfig.json --outdir "${outdir}"`, { stdio: 'inherit' });

      const buildResult = await esbuild.build({
        format: "esm",
        target: "es2017",
        entryPoints: [
          "./medblocks.ts",
          ...(await globby('./src/medblocks/**/!(*.).ts')),
          ...(await globby('./src/internal/**/*.ts'))
        ],
        outdir,
        chunkNames: 'chunks/[name].[hash]',
        incremental: true,
        bundle: true,
        define: {
          'process.env.NODE_ENV': '"production"'
        },
        external: ["lit", "react", "@lit-labs/react"],
        splitting: true,
        plugins: []
      });
      console.log(buildResult);
      console.log(chalk.green(`The build has been generated at ${outdir} 📦\n`));
      process.exit(0);
    }catch(e){
      console.log(chalk.red(e));
      process.exit(1);
    };


    process.on('SIGTERM', ()=>buildResult.rebuild.dispose());
})();
