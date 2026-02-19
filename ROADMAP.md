# KRS — 10-Round Upgrade Roadmap

## Round 1: Foundation (Week 1-2) — MVP
**Goal:** Prove the core value proposition works

- [ ] CSV/JSON scanner export ingestion
- [ ] KEV + EPSS + CVSS fusion scoring
- [ ] Basic prioritization algorithm
- [ ] CLI output: ranked findings with rationale
- [ ] Jira ticket creation (single project)
- [ ] Slack webhook digest
- [ ] README + quickstart docs

**Success:** User uploads scanner export → gets ranked list → tickets created

---

## Round 2: Multi-Source (Week 3-4)
**Goal:** Handle real-world scanner diversity

- [ ] Nessus .nessus XML parser
- [ ] Qualys CSV parser
- [ ] Tenable.io API connector
- [ ] Cross-source deduplication
- [ ] Source health monitoring

**Success:** Works with 3+ scanner formats

---

## Round 3: Asset Context (Week 5-6)
**Goal:** Make prioritization environment-aware

- [ ] Asset inventory import (CSV/CMDB API)
- [ ] Business criticality scoring
- [ ] Internet exposure flag
- [ ] Owner/team mapping
- [ ] Criticality-weighted risk formula

**Success:** "This CVE on your payment server" vs "This CVE on dev laptop"

---

## Round 4: Workflow Automation (Week 7-8)
**Goal:** Full ticketing lifecycle

- [ ] ServiceNow integration
- [ ] Bi-directional ticket sync (status updates)
- [ ] SLA timers and escalation rules
- [ ] Overdue alerts
- [ ] Bulk ticket operations

**Success:** Zero manual ticket creation for standard findings

---

## Round 5: Policy Engine (Week 9-10)
**Goal:** Configurable decision logic

- [ ] Policy DSL for risk thresholds
- [ ] Auto-accept rules (e.g., "dev env, no fix available")
- [ ] Exception workflow with approval
- [ ] Policy versioning and audit trail

**Success:** Different policies for prod vs staging vs dev

---

## Round 6: Intelligence Enrichment (Week 11-12)
**Goal:** Go beyond CVSS/KEV

- [ ] Exploit-DB/PoC availability check
- [ ] Threat intel feed integration (MISP, OTX)
- [ ] Ransomware association tagging
- [ ] "Actively exploited in wild" confidence scoring

**Success:** Prioritize CVEs with public exploits higher

---

## Round 7: Reporting & Metrics (Week 13-14)
**Goal:** Prove ROI to management

- [ ] Dashboard: backlog burn-down, MTTR, overdue count
- [ ] Weekly executive summary (auto-generated)
- [ ] Trend analysis (are we getting better?)
- [ ] Compliance mapping (PCI, SOC2, etc.)
- [ ] Export to PDF/slides

**Success:** CTO can see risk posture in 30 seconds

---

## Round 8: Remediation Guidance (Week 15-16)
**Goal:** Tell them HOW to fix, not just WHAT

- [ ] Patch availability check
- [ ] Workaround/mitigation suggestions
- [ ] Rollback risk assessment
- [ ] Change window recommendations
- [ ] Pre-built firewall/WAF rules for common CVEs

**Success:** Ticket includes actionable fix steps

---

## Round 9: Closed-Loop Verification (Week 17-18)
**Goal:** Prove the fix worked

- [ ] Re-scan trigger after remediation
- [ ] Delta comparison (before/after)
- [ ] Auto-close verified tickets
- [ ] Regression detection
- [ ] Remediation effectiveness score

**Success:** "This CVE is now confirmed fixed" with evidence

---

## Round 10: Scale & Polish (Week 19-20)
**Goal:** Production-ready for teams

- [ ] Multi-tenant support
- [ ] RBAC and SSO
- [ ] API rate limiting and quotas
- [ ] Performance optimization (10k+ findings/day)
- [ ] Deployment guides (Docker, K8s, cloud)
- [ ] Community contribution guidelines

**Success:** Ready for public launch and external contributors

---

## Stretch Goals (Post-v1)

- [ ] Auto-remediation playbooks (with approval gates)
- [ ] Runtime exploitability analysis (RASP integration)
- [ ] Attack path visualization
- [ ] AI-generated remediation PRs
- [ ] MSP multi-client dashboard

---

## Dependencies

| Round | Depends On | External Requirement |
|-------|------------|---------------------|
| 1 | — | Jira API token, Slack webhook |
| 2 | 1 | Scanner export samples |
| 3 | 2 | Asset inventory access |
| 4 | 1 | ServiceNow API access |
| 5 | 4 | Policy requirements from users |
| 6 | 3 | Threat intel API keys |
| 7 | 5 | Metrics requirements |
| 8 | 3 | Vendor advisory access |
| 9 | 8 | Re-scan capability |
| 10 | 9 | Beta user feedback |
