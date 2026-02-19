function decision(score) {
  if (score >= 0.8) return 'FIX_NOW';
  if (score >= 0.6) return 'SCHEDULE';
  if (score >= 0.4) return 'INVESTIGATE';
  return 'ACCEPT';
}

export function fuseScore(finding, kevSet, epssMap) {
  const cvssNorm = Math.max(0, Math.min(1, finding.cvss / 10));
  const kev = kevSet.has(finding.cve) ? 1 : 0;
  const epss = Math.max(0, Math.min(1, Number(epssMap[finding.cve] || 0.05)));
  const crit = Math.max(0, Math.min(1, (Number(finding.criticality || 3) - 1) / 4));
  const exposed = finding.internet_exposed ? 1 : 0;
  const score = 0.30 * cvssNorm + 0.30 * kev + 0.20 * epss + 0.10 * crit + 0.10 * exposed;
  return {
    finding,
    score: Number(score.toFixed(3)),
    decision: decision(score),
    rationale: `cvss=${cvssNorm.toFixed(2)}, kev=${kev}, epss=${epss.toFixed(2)}, criticality=${crit.toFixed(2)}, exposed=${exposed}`
  };
}

export function rankFindings(findings, kevSet = new Set(), epssMap = {}) {
  return findings.map(f => fuseScore(f, kevSet, epssMap)).sort((a, b) => b.score - a.score);
}
