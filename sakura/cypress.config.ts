import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    coverage: false,
  },

  retries: {
    runMode: 5,
    openMode: 0,
  },

  video: false,
  viewportHeight: 850,
  viewportWidth: 400,

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "http://localhost:4000",
    excludeSpecPattern: ["**/*.md"],
  },

  component: {
    setupNodeEvents(on, config) {},
    viewportWidth: 800,
    viewportHeight: 800,
    excludeSpecPattern: ["**/*.md"],
    specPattern: "src/**/*.test.{js,ts,jsx,tsx}",
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
