const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git']);
const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(full, cb);
    } else if (e.isFile()) {
      cb(full);
    }
  }
}

function shouldProcess(file) {
  return EXTENSIONS.has(path.extname(file).toLowerCase());
}

function processFile(file) {
  if (!shouldProcess(file)) return;
  let src = fs.readFileSync(file, 'utf8');
  const lines = src.split(/\r?\n/);
  let inBlock = false;
  let changed = false;
  const out = [];

  for (let line of lines) {
    if (!inBlock && /\/\*/.test(line)) {
      // entering a block comment (keep as-is)
      inBlock = true;
      out.push(line);
      if (/\*\//.test(line)) inBlock = false;
      continue;
    }
    if (inBlock) {
      out.push(line);
      if (/\*\//.test(line)) inBlock = false;
      continue;
    }

    // Whole-line single-line comment
    if (/^\s*\/\//.test(line)) {
      if (/TODO|IMPORTANT/i.test(line)) {
        out.push(line);
      } else {
        changed = true; // drop this line entirely
      }
      continue;
    }

    // Inline comments: remove portion after // unless it contains TODO or IMPORTANT
    const idx = line.indexOf('//');
    if (idx !== -1) {
      const after = line.slice(idx + 2);
      if (/TODO|IMPORTANT/i.test(after)) {
        out.push(line);
      } else {
        const before = line.slice(0, idx).replace(/\s+$/, '');
        out.push(before);
        if (before !== line) changed = true;
      }
    } else {
      out.push(line);
    }
  }

  const newSrc = out.join('\n');
  if (changed && newSrc !== src) {
    fs.writeFileSync(file, newSrc, 'utf8');
    console.log('Stripped comments:', path.relative(ROOT, file));
  }
}

console.log('Starting comment strip in:', ROOT);
walk(ROOT, (file) => {
  try { processFile(file); } catch (err) { console.error('Error processing', file, err.message); }
});
console.log('Done.');
