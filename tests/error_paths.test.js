import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path, { dirname, join } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { loadFindings } from '../src/parser.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

test('loadFindings throws on unsupported extension', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'krs-'));
  const p = path.join(dir, 'findings.txt');
  fs.writeFileSync(p, 'hello');
  assert.throws(() => loadFindings(p), /Unsupported input format/);
});

test('cli exits with usage error when --input missing', () => {
  let failed = false;
  try {
    execSync('node src/cli.js', { cwd: projectRoot, stdio: 'pipe' });
  } catch (e) {
    failed = true;
    const stderr = String(e.stderr || e.message || '');
    assert.match(stderr, /Usage: krs|--input|required|missing/i);
  }
  assert.equal(failed, true);
});
