const { defineConfig } = require("cypress");

module.exports = defineConfig({
  pluginFile: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
