# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.3.0] - 2025-02-21

### Added

- Installed PostHTML with posthtml-expressions and posthtml-include for HTML template preprocessing.
- Built posthtml.config.json template to streamline build process.
- Created prebuild script to generate .posthtmlrc configuration file based on JSON data and posthtml.config.json.
- Cleaned up prebuild.js for better maintainability.
- HTML templating:
  - Created partials directory for HTML templates.
  - Converted the skill list into a template for easier management.
  - Used template to insert metadata dynamically from data.json into head section on build.
  - Templated version number into footer section.
- Implemented version metadata injection:
  - Created a PostHTML transformation for inserting version numbers.
  - Included metadata object in locals object for consistency.

### Removed

- Deleted function to create a version.js file.
- Deleted DOM manipulation for version injection on initialization.

### Fixed

- Removed an unneeded comment in partials for cleaner code.

## [1.2.0] - 2025-02-21

### Added

- Created netlify.toml with Content-Security-Policy to improve security.
- Added Redis PubSub project link to the list of projects.
- Updated the list of social links to include Medium and Bluesky.
- Implemented a prebuild script to track versioning and build date dynamically.
- Included dynamic versioning in app.js for better version control.
- Added a version.js file that gets generated on build (ignored in .gitignore).
- Implemented a dynamic year in the footer using a current-year class.
- Added meta tags for author, site version, and site build date.
- Ensured meta tags dynamically update on initialization.

### Fixed

- Bug: Resolved Sharp version conflict for Netlify deployment.

## [1.1.0] - 2025-01-30

### Added

- Feature: Update projects section with link to Medium blog.
- Improved: Updated meta description.

### Fixed

- Bug: Added dist/ to .gitignore.
- Bug: Removed yarn.lock from .gitignore.

## [1.0.0] - 2024-08-22

### Added

- Initial release of the website.
- Includes portfolio, about page, and contact form.
