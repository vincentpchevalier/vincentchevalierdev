const fs = require('fs');
const package = require('../package.json');

const version = package.version;

const content = `export const VERSION = '${version}';`;

fs.writeFileSync('./src/js/version.js', content, 'utf-8');

console.log(`👋 Version file generated. Showing version: ${version}`);
