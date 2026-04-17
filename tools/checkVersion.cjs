/**
 * Compares the local package.json version against both:
 *   1. The latest version published on npm
 *   2. Any existing git tag named v<version>
 *
 * Exits with code 1 if the version collides with either — i.e., the version
 * was not bumped since the last release.
 */
const { execSync } = require('child_process');
const pkg = require('../package.json');

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

const local = pkg.version;
const tagName = `v${local}`;
let failed = false;

// --- Check 1: latest published npm version ---
let published;
try {
  published = execSync('npm view quikchat version', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
} catch (_err) {
  published = null;
}

if (published === null) {
  console.log(`${YELLOW}Local version: ${local} (package not yet on npm — OK)${RESET}`);
} else if (local === published) {
  console.error(`${RED}ERROR: Local version ${local} matches the published npm version.${RESET}`);
  console.error('Bump the version before releasing.');
  failed = true;
} else {
  console.log(`${GREEN}npm check:     local ${local} !== published ${published}${RESET}`);
}

// --- Check 2: existing git tag ---
// Prefer remote tags (origin) if available; fall back to local tags.
let tagExistsRemote = false;
let tagExistsLocal = false;
try {
  const remote = execSync(`git ls-remote --tags origin "${tagName}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  tagExistsRemote = remote.length > 0;
} catch (_err) {
  // No remote access — skip remote check
}
try {
  execSync(`git rev-parse --verify "refs/tags/${tagName}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  tagExistsLocal = true;
} catch (_err) {
  // Tag doesn't exist locally — fine
}

if (tagExistsRemote) {
  console.error(`${RED}ERROR: Tag ${tagName} already exists on origin.${RESET}`);
  console.error('Bump the version before releasing.');
  failed = true;
} else if (tagExistsLocal) {
  console.error(`${RED}ERROR: Tag ${tagName} already exists locally (delete with: git tag -d ${tagName}).${RESET}`);
  failed = true;
} else {
  console.log(`${GREEN}tag check:     ${tagName} does not exist${RESET}`);
}

if (failed) process.exit(1);
console.log(`${GREEN}Version check passed.${RESET}`);
