/**
 * Reports raw, minified, and gzipped sizes for all dist output files.
 * Also writes dist/build-manifest.json with sizes, SRI hashes, and metadata.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const distDir = path.join(__dirname, '..', 'dist');
const pkg = require('../package.json');

const groups = [
  {
    id: 'base',
    name: 'quikchat (base)',
    description: 'Chat widget, zero runtime dependencies',
    cdn: false,
    files: [
      { label: 'UMD', raw: 'quikchat.umd.js', min: 'quikchat.umd.min.js' },
      { label: 'CJS', raw: 'quikchat.cjs.js', min: 'quikchat.cjs.min.js' },
      { label: 'ESM', raw: 'quikchat.esm.js', min: 'quikchat.esm.min.js' },
      { label: 'CSS', raw: 'quikchat.css',     min: 'quikchat.min.css' },
    ],
  },
  {
    id: 'md',
    name: 'quikchat-md (with quikdown)',
    description: 'Base + basic markdown (bold, italic, code, tables, lists)',
    cdn: false,
    files: [
      { label: 'UMD', raw: 'quikchat-md.umd.js', min: 'quikchat-md.umd.min.js' },
      { label: 'CJS', raw: 'quikchat-md.cjs.js', min: 'quikchat-md.cjs.min.js' },
      { label: 'ESM', raw: 'quikchat-md.esm.js', min: 'quikchat-md.esm.min.js' },
    ],
  },
  {
    id: 'md-full',
    name: 'quikchat-md-full (with quikdown bd + fence post-processing)',
    description: 'Base + markdown + syntax highlighting, math, diagrams, maps (loaded on demand from CDN)',
    cdn: true,
    files: [
      { label: 'UMD', raw: 'quikchat-md-full.umd.js', min: 'quikchat-md-full.umd.min.js' },
      { label: 'CJS', raw: 'quikchat-md-full.cjs.js', min: 'quikchat-md-full.cjs.min.js' },
      { label: 'ESM', raw: 'quikchat-md-full.esm.js', min: 'quikchat-md-full.esm.min.js' },
    ],
  },
];

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  return (bytes / 1024).toFixed(2) + ' KB';
}

function getGzipSize(filePath) {
  const content = fs.readFileSync(filePath);
  return zlib.gzipSync(content, { level: 9 }).length;
}

function getSRI(filePath) {
  const content = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha384').update(content).digest('base64');
  return 'sha384-' + hash;
}

// --- Build manifest ---
const manifest = {
  version: pkg.version,
  generated: new Date().toISOString(),
  builds: [],
};

// --- Console report + manifest ---
const colW = { label: 18, raw: 12, min: 12, gz: 12 };
const totalW = colW.label + colW.raw + colW.min + colW.gz;

console.log('\n=== quikchat build sizes ===\n');

for (const group of groups) {
  const hasFiles = group.files.some(f =>
    fs.existsSync(path.join(distDir, f.raw)) || fs.existsSync(path.join(distDir, f.min))
  );
  if (!hasFiles) continue;

  const buildEntry = {
    id: group.id,
    name: group.name,
    description: group.description,
    cdnOnDemand: group.cdn,
    files: [],
  };

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

    if (!fs.existsSync(rawPath) || !fs.existsSync(minPath)) continue;

    const rawSize = fs.statSync(rawPath).size;
    const minSize = fs.statSync(minPath).size;
    const gzSize = getGzipSize(minPath);
    const sri = getSRI(minPath);

    buildEntry.files.push({
      format: file.label,
      raw: file.raw,
      min: file.min,
      rawBytes: rawSize,
      minBytes: minSize,
      gzipBytes: gzSize,
      rawSize: formatBytes(rawSize),
      minSize: formatBytes(minSize),
      gzipSize: formatBytes(gzSize),
      sri: sri,
    });

    console.log(
      ('  ' + file.label).padEnd(colW.label),
      formatBytes(rawSize).padStart(colW.raw),
      formatBytes(minSize).padStart(colW.min),
      formatBytes(gzSize).padStart(colW.gz)
    );
  }

  manifest.builds.push(buildEntry);
  console.log('');
}

// --- Write manifest ---
const manifestPath = path.join(distDir, 'build-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('Wrote ' + manifestPath);
