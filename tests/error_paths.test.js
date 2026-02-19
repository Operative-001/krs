import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';

import { loadFindings } from '../src/parser.js';

test('loadFindings throws on unsupported extension', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'krs-'));
  const p = path.join(dir, 'findings.txt');
  fs.writeFileSync(p, 'hello');
  assert.throws(() => loadFindings(p), /Unsupported input format/);
});

test('cli exits with usage error when --input missing', () => {
  let failed = false;
  try {
    execSync('node src/cli.js', { cwd: '/home/reverser/.openclaw/workspace-swarm/projects/krs', stdio: 'pipe' });
  } catch (e) {
    failed = true;
    const stderr = String(e.stderr || '');
    assert.match(stderr, /Usage: krs/);
  }
  assert.equal(failed, true);
});
