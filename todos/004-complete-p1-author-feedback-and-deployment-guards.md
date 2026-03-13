---
status: complete
priority: p1
issue_id: "004"
tags: [code-review, ci-cd, content-pipeline, ux]
dependencies: []
---

# Add Content Author Feedback and Zero-Article Deployment Guard

## Problem Statement

Two critical operational gaps exist:

1. **No author feedback:** When a build skips an article (missing Slug, duplicate slug, missing Category), the warning only appears in GitHub Actions build logs. Content authors don't have access to or monitor these logs. An author who sets Status to Published and waits 15 minutes will see nothing happen, with no explanation.

2. **No zero-article guard:** If all articles are accidentally set to Draft in Notion, the next scheduled rebuild deploys a completely empty support site (just header, footer, empty category grid). There is no minimum article count check.

## Findings

- Spec Flow Analyzer: "Authors publish articles that silently never appear on the site with no feedback mechanism to tell them why."
- Spec Flow Analyzer: "An accidental bulk status change could deploy an empty support site to production."

## Proposed Solutions

### Option 1: Slack Build Summary + Deploy Guard (Recommended)

**Approach:** Add to Phase 6 CI/CD:
1. Post a build summary to a Slack channel after each rebuild: articles published count, articles skipped (with reasons), link to live site.
2. Add a deployment guard: if published article count drops below a configurable minimum (e.g., 5) AND this represents a decrease from the previous deploy, skip the deploy and send a Slack alert.

**Pros:** Simple, uses existing Slack webhook, catches both problems
**Cons:** Requires a Slack channel for build notifications
**Effort:** Small (plan update) + Medium (implementation — ~2 hours)
**Risk:** Low

### Option 2: Notion Status Update (More Complex)

**Approach:** After build, use Notion API (write access) to update a "Build Status" property on each article page: "Live", "Skipped: missing slug", etc.

**Pros:** Feedback directly in Notion where authors work
**Cons:** Requires Notion write access, more complex pipeline, rate limit considerations
**Effort:** Large
**Risk:** Medium

## Acceptance Criteria

- [ ] Build summary notification mechanism specified in plan
- [ ] Minimum article count guard specified with configurable threshold
- [ ] Guard behavior documented (skip deploy + alert, not fail build)

## Work Log

### 2026-03-12 - Code Review Discovery

**By:** Spec Flow Analyzer
**Actions:** Identified missing feedback loop for content authors and missing deployment safety net
