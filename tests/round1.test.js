import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { loadFindings } from '../src/parser.js';
import { rankFindings } from '../src/scoring.js';

test('csv load and ranking prioritizes KEV+high risk finding', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'krs-'));
  const p = path.join(dir, 'findings.csv');
  fs.writeFileSync(
    p,
    [
      'id,asset,cve,cvss,criticality,internet_exposed',
      '1,payments-prod,CVE-2026-2441,9.8,5,true',
      '2,dev-laptop,CVE-2021-0001,5.3,1,false'
    ].join('\n')
  );

  const findings = loadFindings(p);
  const ranked = rankFindings(findings, new Set(['CVE-2026-2441']), {
    'CVE-2026-2441': 0.91,
    'CVE-2021-0001': 0.02
  });

  assert.equal(ranked[0].finding.id, '1');
  assert.equal(ranked.at(-1).finding.id, '2');
  assert.ok(['FIX_NOW', 'SCHEDULE'].includes(ranked[0].decision));
});
