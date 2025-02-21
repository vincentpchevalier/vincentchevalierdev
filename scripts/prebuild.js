const fs = require('fs');
const path = require('path');
const package = require('../package.json');

try {
	// Generate info file for build
	const version = package.version;

	const buildDate = new Date().toLocaleDateString('en-CA', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'America/Toronto',
	});

	const content = `export const VERSION = '${version}';\nexport const LAST_UPDATED = '${buildDate}';`;

	const filePath = path.join(__dirname, '../src/js/version.js');

	fs.writeFileSync(filePath, content, 'utf-8');

	console.log(
		`👋 Version file generated: VERSION=${version}, LAST_UPDATED=${buildDate} 👋`
	);
} catch (error) {
	console.error(`⛔️ Error generating version file: ${error.message}`);
}
