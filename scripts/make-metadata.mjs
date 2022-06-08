import { execSync } from 'child_process';
import commandLineArgs from 'command-line-args';

const { outdir } = commandLineArgs({ name: 'outdir', type: String });

// Run the analyzer
console.log('Generating component metadata');
execSync(`cem analyze --litelement --outdir "${outdir}"`, { stdio: 'inherit' });
