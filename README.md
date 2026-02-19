# KRS — KEV Rapid Response Swarm

Turn vulnerability scanner noise into prioritized, evidence-backed remediation actions.

## What KRS does

KRS is an execution layer between vulnerability detection and remediation outcomes. It ingests scanner findings, fuses KEV + EPSS + CVSS with asset context, and outputs a ranked action queue with clear rationale.

## Round 1 MVP scope

- CSV/JSON scanner export ingestion
- KEV + EPSS + CVSS fusion scoring
- Ranked CLI output with rationale
- Basic Jira ticket integration (mock mode supported)
- Slack webhook digest

## Why this exists

Security teams are overloaded by high-volume findings, conflicting tool signals, and manual triage. KRS reduces triage time by converting noisy findings into defensible, owner-ready actions.

## Quickstart

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .[dev]

krs rank --input examples/findings.csv --top 10
```

## Output decisions

- `FIX_NOW`
- `SCHEDULE`
- `ACCEPT`
- `INVESTIGATE`

## Safety

MVP is recommendation-first: no autonomous production changes.
