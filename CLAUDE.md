# Claude Configuration for QuikChat

This file configures Claude's behavior and permissions for the QuikChat project.

## IMPORTANT: Testing Policy

**Always run `npm test` after making code changes to catch errors immediately.**

## Development Versioning Guidelines

During development:
- Current development version: **1.1.15-dev1**
- Increment dev suffix for each build: 1.1.15-dev2, 1.1.15-dev3, etc.
- When ready for release: Remove dev suffix → 1.1.15
- Version source of truth: `package.json`

To bump dev version:
1. Edit `package.json` version field
2. Run `npm run updateVersion` to sync
3. Run `npm test` to verify

## Auto-approved Commands

The following commands can be run without requiring user approval:

### Build Commands
- `npm run build` - Run the full build process
- `npm run updateVersion` - Update version from package.json to quikchat_version.js
- `npm run minifyCSS` - Minify CSS files
- `npm run makeIndexHTML` - Generate index.html from README

### Test Commands
- `npm test` - Run the test suite with coverage
- `npm run test` - Alternative test command

### Development Commands
- `npm run dev` - Start development server

## Project Context

QuikChat is a zero-dependency JavaScript chat widget. The version management system works as follows:

1. Version is maintained in `package.json`
2. Running `npm run updateVersion` reads from `package.json` and writes to `src/quikchat_version.js`
3. The main `src/quikchat.js` imports version from `quikchat_version.js`
4. The build process (`npm run build`) automatically runs `updateVersion` first

## Key Files

- `src/quikchat.js` - Main QuikChat class
- `src/quikchat_version.js` - Auto-generated version module (DO NOT EDIT MANUALLY)
- `tools/updateVersion.js` - Script that generates quikchat_version.js from package.json
- `package.json` - Source of truth for version number

## Testing

Run `npm test` to execute the Jest test suite with coverage reporting. All tests should pass before committing changes.

## Building

Run `npm run build` to:
1. Update version file from package.json
2. Generate index.html from README
3. Minify CSS
4. Build all distribution formats (UMD, CJS, ESM)
5. Copy files to example directories