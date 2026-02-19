import fs from 'node:fs';

export function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map((line, idx) => {
    const cols = line.split(',');
    const row = Object.fromEntries(headers.map((h, i) => [h, (cols[i] || '').trim()]));
    for (const req of ['id', 'asset', 'cve', 'cvss']) {
      if (!(req in row)) throw new Error(`Row ${idx + 1} missing ${req}`);
    }
    return {
      id: String(row.id),
      asset: String(row.asset),
      cve: String(row.cve),
      cvss: Number(row.cvss),
      criticality: Number(row.criticality || 3),
      internet_exposed: ['1', 'true', 'yes'].includes(String(row.internet_exposed || 'false').toLowerCase())
    };
  });
}

export function loadFindings(path) {
  const raw = fs.readFileSync(path, 'utf8');
  if (path.endsWith('.csv')) return parseCsv(raw);
  if (path.endsWith('.json')) {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error('JSON input must be an array');
    return data;
  }
  throw new Error('Unsupported input format');
}
