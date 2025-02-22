const { readFileSync, writeFileSync } = require('fs');
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

	writeFileSync(filePath, content, 'utf-8');

	console.log(
		`👋 Version file generated: VERSION=${version}, LAST_UPDATED=${buildDate} 👋`
	);

	// take data and prepare it for the posthtml build config file
	const dataFilePath = path.join(__dirname, '../data/data.json');
	const configFilePath = path.join(__dirname, '../data/posthtml.config.json');
	const outputPath = path.join(__dirname, '../.posthtmlrc');

	const data = JSON.parse(readFileSync(dataFilePath, 'utf-8'));
	const config = JSON.parse(readFileSync(configFilePath, 'utf-8'));

	const projects = data.projects;
	const metadata = data.metadata;

	metadata.version = version;
	metadata.buildDate = buildDate;

	const skills = Array.from(
		new Set(
			projects.reduce((acc, project) => acc.concat(project.skills), data.skills)
		)
	);

	const locals = { skills, projects, metadata };

	config.plugins['posthtml-expressions'].locals = locals;

	writeFileSync(outputPath, JSON.stringify(config, null, 2));

	console.log(`👋 PostHTML config file created. Saved to: ${outputPath} 👋`);
} catch (error) {
	console.error(`⛔️ Error generating version file: ${error.message}`);
}
