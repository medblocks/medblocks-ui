import { chromeLauncher } from '@web/test-runner';

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  files: 'dist/test/**/*.test.js',
  nodeResolve: true,

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto',

  /** Confgure bare import resolve plugin */
  // nodeResolve: {
  //   exportConditions: ['browser', 'development']
  // },

  /** Amount of browsers to run concurrently */
  // concurrentBrowsers: 2,

  /** Amount of test files per browser to test concurrently */
  // concurrency: 1,

  /** Browsers to run tests on */
  browsers:
    [chromeLauncher({
       launchOptions: {
        args: ['--no-sandbox'],
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
      }
    })],

  // See documentation for all available options
});
