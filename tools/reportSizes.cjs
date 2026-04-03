/**
 * Reports raw, minified, and gzipped sizes for dist output files.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const distDir = path.join(__dirname, '..', 'dist');

const files = [
  { label: 'UMD',         raw: 'quikchat.umd.js',     min: 'quikchat.umd.min.js' },
  { label: 'CJS',         raw: 'quikchat.cjs.js',     min: 'quikchat.cjs.min.js' },
  { label: 'ESM',         raw: 'quikchat.esm.js',     min: 'quikchat.esm.min.js' },
  { label: 'CSS',         raw: 'quikchat.css',         min: 'quikchat.min.css' },
];

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  return (bytes / 1024).toFixed(2) + ' KB';
}

function getGzipSize(filePath) {
  const content = fs.readFileSync(filePath);
  return zlib.gzipSync(content, { level: 9 }).length;
}

console.log('\n=== quikchat build sizes ===\n');
console.log(
  'Format'.padEnd(8),
  'Raw'.padStart(12),
  'Minified'.padStart(12),
  'Gzipped'.padStart(12)
);
console.log('-'.repeat(46));

for (const file of files) {
  const rawPath = path.join(distDir, file.raw);
  const minPath = path.join(distDir, file.min);

  if (!fs.existsSync(rawPath) || !fs.existsSync(minPath)) {
    console.log(`${file.label.padEnd(8)}  (files not found)`);
    continue;
  }

  const rawSize = fs.statSync(rawPath).size;
  const minSize = fs.statSync(minPath).size;
  const gzSize = getGzipSize(minPath);

  console.log(
    file.label.padEnd(8),
    formatBytes(rawSize).padStart(12),
    formatBytes(minSize).padStart(12),
    formatBytes(gzSize).padStart(12)
  );
}

console.log('');
