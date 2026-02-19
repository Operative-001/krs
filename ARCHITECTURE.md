# KRS Architecture Draft (Post-Research)

_Date: 2026-02-19_

## 0) Product north star

Turn vulnerability operations from "finding overload" into a weekly execution loop:
1) ingest findings,
2) prioritize with context,
3) create/route work,
4) track closure and SLA,
5) explain decisions.

---

## 1) Scope assumptions (derived from research)

- Buyer/user: security lead, sysadmin lead, or VM analyst at understaffed orgs.
- Existing tools stay in place (scanner + ticketing + Slack); KRS is orchestration/decision layer.
- Early success metric: less triage time + faster remediation on exploitable/high-impact items.

---

## 2) System context (text diagram)

```text
[Scanners: Nessus/Qualys/Rapid7/Defender/SCA]
                |
                v
        [Ingestion Connectors] -----> [Normalizer + Deduper]
                                      |
                                      v
                          [Risk Fusion Engine]
               (CVSS + KEV + EPSS + Asset Criticality + Exposure)
                                      |
                                      v
                            [Decision Orchestrator]
                  (Fix now / Schedule / Accept / Investigate)
                     |                |               |
                     v                v               v
               [Ticketing]        [Slack]        [Analyst UI/API]
            (Jira/ServiceNow)   (alerts/digest)  (override/audit)
                     \                |               /
                      \               v              /
                       ---> [Evidence + Audit Store] <---
                                   |
                                   v
                           [Metrics/Reporting]
                    (MTTR, overdue KEV, backlog burn)
```

---

## 3) Core services and responsibilities

1. **Connector Service**
   - Pulls findings/assets from scanner APIs or file uploads.
   - Handles incremental sync and source health.

2. **Normalization Service**
   - Canonical finding model (CVE, asset, package, version, exposure state).
   - Dedupes cross-scanner duplicates.

3. **Risk Fusion Service**
   - Computes `priority_score` and `decision_reason`.
   - Inputs: KEV, EPSS, exploit intel, business criticality, internet exposure, compensating controls.

4. **Agent Orchestrator**
   - Runs triage agents with guardrails.
   - Emits explicit confidence + required follow-up when uncertain.

5. **Workflow Service**
   - Creates/updates Jira/ServiceNow tickets.
   - Manages ownership mapping, SLA timers, escalations.

6. **Comms Service**
   - Slack digest, urgent pings, escalation chains.

7. **Audit & Policy Service**
   - Immutable decision log and policy versioning.
   - Supports compliance and post-incident review.

8. **API/UI Service**
   - Queue view, override workflow, search, and evidence drill-down.

---

## 4) Data model (MVP)

## Primary entities

- `Finding`
  - `finding_id`, `source`, `cve`, `asset_id`, `detected_at`, `status`
- `Asset`
  - `asset_id`, `owner`, `criticality`, `internet_exposed`, `environment`
- `RiskAssessment`
  - `finding_id`, `score`, `decision` (`FIX_NOW|SCHEDULE|ACCEPT|INVESTIGATE`), `confidence`, `reason`
- `WorkItem`
  - `ticket_id`, `system` (`jira|servicenow`), `owner`, `due_date`, `state`
- `Evidence`
  - `finding_id`, `inputs_snapshot`, `policy_version`, `agent_trace_ref`

## Event contracts

- `FindingIngested`
- `RiskRecomputed`
- `DecisionIssued`
- `WorkItemCreated`
- `WorkItemStateChanged`
- `SlaBreached`

---

## 5) Security model + threat checklist

## Controls

- Least-privilege per connector integration token
- Tenant isolation per workspace/org
- Prompt-injection-safe ingestion (treat external text as untrusted)
- Signed policy versions for decision logic
- Full audit trail of automated decisions + human overrides

## Threat checklist

- [ ] Cross-tenant data leakage
- [ ] Ticket spoofing / unauthorized updates
- [ ] Agent prompt injection via scanner metadata
- [ ] Sensitive asset labels exposed in Slack/public channels
- [ ] API key exfiltration from connector workers
- [ ] Unsafe auto-remediation actions (MVP should be recommendation-first)

---

## 6) Reliability + observability requirements

- Connector sync SLO: 99.5% daily completion
- Decision pipeline latency target: <10 min from ingest to decision (MVP)
- Idempotent ticket creation/update
- Dead-letter queues for failed ingestion/dispatch
- Tracing across ingest -> score -> ticket -> notification
- Golden metrics:
  - triage cycle time
  - high-risk overdue count
  - MTTR for KEV-tagged findings
  - false-positive override rate

---

## 7) Phased delivery plan

## Phase 0 (2 weeks) — Validation prototype
- CSV/scanner export ingestion
- KEV+EPSS+criticality ranking
- Manual Slack digest
- Goal: prove ranking usefulness with 3-5 design partners

## Phase 1 (4-6 weeks) — MVP
- One scanner connector + Jira integration + Slack
- Decision queue with evidence
- SLA timer + escalation
- Basic audit log

## Phase 2 (6-8 weeks) — Production v1
- Multi-scanner dedup
- ServiceNow support
- Policy editor + approval workflow
- Reporting dashboard (burn-down, MTTR, risk trend)

## Phase 3 — Expansion
- Reachability/runtime exploitability inputs
- Multi-tenant MSP mode
- Optional safe auto-remediation playbooks

---

## 8) Open questions (must resolve before build hardening)

1. What is the first mandatory scanner integration for design partners?
2. Jira vs ServiceNow first: which gives fastest proof of value?
3. Is asset criticality available via CMDB, or do we bootstrap manually?
4. What confidence threshold allows auto-ticketing without analyst review?
5. What escalation policy is acceptable outside business hours?

## Decision log template

```markdown
## Decision D-00X
- Date:
- Owner:
- Context:
- Options considered:
- Decision:
- Consequences:
- Review date:
```

---

## 9) Immediate next actions

1. Recruit 3 design partners matching primary personas (small security team, high backlog).
2. Finalize canonical finding schema and scoring formula v0.1.
3. Implement ingestion adapter for first scanner source.
4. Implement Jira ticketing + Slack digest loop.
5. Run one-week shadow mode against real backlog; compare KRS ranking vs team baseline.
6. Publish outcome metrics (time saved, missed-high-risk reduction) for go/no-go on v1.
