const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    baseUrl: "https://front.serverest.dev/",
    env: {
      apiBaseUrl: "https://serverest.dev/"
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      if (config.env.TEST_TYPE === "api") {
        config.baseUrl = config.env.apiBaseUrl;
      }
      return config;
    },
    specPattern: [
      "cypress/tests/e2e/**/*.cy.{js,jsx,ts,tsx}",
      "cypress/tests/api/**/*.cy.{js,jsx,ts,tsx}"
    ]
  }
});
