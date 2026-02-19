export function createJiraIssueMock(scored, projectKey = 'KRS') {
  return {
    project: projectKey,
    summary: `[${scored.decision}] ${scored.finding.cve} on ${scored.finding.asset}`,
    description: `Score: ${scored.score}\nRationale: ${scored.rationale}`,
    labels: ['krs', 'security', scored.decision.toLowerCase()]
  };
}

export async function sendSlackDigest(webhookUrl, top) {
  const lines = ['*KRS Daily Digest — Top Findings*'];
  for (const s of top) lines.push(`• \`${s.decision}\` ${s.finding.cve} on *${s.finding.asset}* (score=${s.score})`);
  const resp = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: lines.join('\n') })
  });
  return resp.status;
}
