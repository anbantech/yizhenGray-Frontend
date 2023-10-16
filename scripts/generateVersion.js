const fs = require('fs-extra');
const packageJson = require('../package.json');

const version = packageJson.version;

const versionJson = {
  version: version
};

fs.outputJsonSync('public/version.json', versionJson);