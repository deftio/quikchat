/**
 * Reports raw, minified, and gzipped sizes for all dist output files.
 * Groups: quikchat (base) and quikchat-md (with markdown support).
 * Files that don't exist yet are silently skipped.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const distDir = path.join(__dirname, '..', 'dist');

const groups = [
  {
    name: 'quikchat (base)',
    files: [
      { label: 'UMD', raw: 'quikchat.umd.js', min: 'quikchat.umd.min.js' },
      { label: 'CJS', raw: 'quikchat.cjs.js', min: 'quikchat.cjs.min.js' },
      { label: 'ESM', raw: 'quikchat.esm.js', min: 'quikchat.esm.min.js' },
      { label: 'CSS', raw: 'quikchat.css',     min: 'quikchat.min.css' },
    ],
  },
  {
    name: 'quikchat-md (with quikdown)',
    files: [
      { label: 'UMD', raw: 'quikchat-md.umd.js', min: 'quikchat-md.umd.min.js' },
      { label: 'CJS', raw: 'quikchat-md.cjs.js', min: 'quikchat-md.cjs.min.js' },
      { label: 'ESM', raw: 'quikchat-md.esm.js', min: 'quikchat-md.esm.min.js' },
      { label: 'CSS', raw: 'quikchat-md.css',     min: 'quikchat-md.min.css' },
    ],
  },
  {
    name: 'quikchat-md-full (with quikdown edit — dynamic loading)',
    files: [
      { label: 'UMD', raw: 'quikchat-md-full.umd.js', min: 'quikchat-md-full.umd.min.js' },
      { label: 'CJS', raw: 'quikchat-md-full.cjs.js', min: 'quikchat-md-full.cjs.min.js' },
      { label: 'ESM', raw: 'quikchat-md-full.esm.js', min: 'quikchat-md-full.esm.min.js' },
    ],
  },
];

function formatBytes(bytes) {
  if (bytes < 1024) {
    return bytes + ' B';
  }
  return (bytes / 1024).toFixed(2) + ' KB';
}

function getGzipSize(filePath) {
  const content = fs.readFileSync(filePath);
  return zlib.gzipSync(content, { level: 9 }).length;
}

const colW = { label: 18, raw: 12, min: 12, gz: 12 };
const totalW = colW.label + colW.raw + colW.min + colW.gz;

console.log('\n=== quikchat build sizes ===\n');

for (const group of groups) {
  // Check if any files in this group exist
  const hasFiles = group.files.some(f =>
    fs.existsSync(path.join(distDir, f.raw)) || fs.existsSync(path.join(distDir, f.min))
  );
  if (!hasFiles) {
    continue; // skip groups with no built files (e.g. -md not yet built)
  }

  console.log(group.name);
  console.log(
    'Format'.padEnd(colW.label),
    'Raw'.padStart(colW.raw),
    'Minified'.padStart(colW.min),
    'Gzipped'.padStart(colW.gz)
  );
  console.log('-'.repeat(totalW));

  for (const file of group.files) {
    const rawPath = path.join(distDir, file.raw);
    const minPath = path.join(distDir, file.min);

    if (!fs.existsSync(rawPath) || !fs.existsSync(minPath)) {
      continue; // skip files that don't exist
    }

    const rawSize = fs.statSync(rawPath).size;
    const minSize = fs.statSync(minPath).size;
    const gzSize = getGzipSize(minPath);

    console.log(
      ('  ' + file.label).padEnd(colW.label),
      formatBytes(rawSize).padStart(colW.raw),
      formatBytes(minSize).padStart(colW.min),
      formatBytes(gzSize).padStart(colW.gz)
    );
  }
  console.log('');
}
