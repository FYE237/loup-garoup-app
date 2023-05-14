// cypress/index.js

const cypress = require('cypress');
const cypressReactUnitTests = require('cypress-react-unit-test');

cypressReactUnitTests.install(cypress);

module.exports = (on, config) => {
  on('file:preprocessor', cypressReactUnitTests.babel());
  return Object.assign({}, config, {
    fixturesFolder: '__tests__/',
    integrationFolder: '__tests__/',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
  });
};

