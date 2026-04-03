/**
 * Compares local package.json version against the latest published npm version.
 * Exits with code 1 if they match (i.e., version was not bumped).
 */
const { execSync } = require('child_process');
const pkg = require('../package.json');

const local = pkg.version;
let published;

try {
  published = execSync('npm view quikchat version', { encoding: 'utf8' }).trim();
} catch (_err) {
  // Package not yet published — that's fine
  console.log(`Local version: ${local} (package not yet on npm — OK)`);
  process.exit(0);
}

if (local === published) {
  console.error(`\x1b[31mERROR: Local version ${local} matches the published npm version.\x1b[0m`);
  console.error('Bump the version in src/quikchat.js before releasing.');
  process.exit(1);
}

console.log(`Version check passed: local ${local} !== published ${published}`);
