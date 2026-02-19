#!/usr/bin/env node
import fs from 'node:fs';
import { loadFindings } from './parser.js';
import { rankFindings } from './scoring.js';
import { createJiraIssueMock, sendSlackDigest } from './integrations.js';

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

async function main() {
  try {
    const input = arg('input');
    if (!input) {
      console.error('Usage: krs --input findings.csv [--kev kev.json] [--epss epss.json] [--top 10] [--jira-mock] [--slack-webhook URL]');
      process.exit(1);
    }
    const topN = Number(arg('top', '10'));
    const kevPath = arg('kev');
    const epssPath = arg('epss');
    const findings = loadFindings(input);
    const kevSet = new Set(kevPath ? JSON.parse(fs.readFileSync(kevPath, 'utf8')) : []);
    const epssMap = epssPath ? JSON.parse(fs.readFileSync(epssPath, 'utf8')) : {};

    const ranked = rankFindings(findings, kevSet, epssMap).slice(0, topN);
    console.log('rank\tid\tcve\tasset\tscore\tdecision\trationale');
    ranked.forEach((s, i) => {
      console.log(`${i + 1}\t${s.finding.id}\t${s.finding.cve}\t${s.finding.asset}\t${s.score}\t${s.decision}\t${s.rationale}`);
    });

    if (process.argv.includes('--jira-mock')) {
      console.log('\n# Jira Mock Payloads');
      for (const s of ranked) console.log(JSON.stringify(createJiraIssueMock(s)));
    }

    const webhook = arg('slack-webhook');
    if (webhook) {
      const status = await sendSlackDigest(webhook, ranked);
      console.log(`Slack webhook status: ${status}`);
    }
  } catch (err) {
    console.error(`krs error: ${err.message}`);
    process.exit(1);
  }
}

main();
