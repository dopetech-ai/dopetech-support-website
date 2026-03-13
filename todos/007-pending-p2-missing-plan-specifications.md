---
status: pending
priority: p2
issue_id: "007"
tags: [code-review, plan, specifications]
dependencies: []
---

# Add Missing Specifications to Plan

## Problem Statement

Multiple reviewers identified specification gaps — behaviors that are unspecified and will require ad-hoc decisions during implementation. Specifying them now prevents inconsistencies.

## Findings

**Must specify:**

1. **Trailing slash policy** — Inconsistency between `/dopeapps` and `/dopeapps/` causes duplicate content for SEO. Pick one, configure in Cloudflare Pages. (Architecture)

2. **`lang="en"` on HTML element** — WCAG 3.1.1 requirement. Screen readers use this for pronunciation. Add to Layout component in Phase 1. (Spec Flow)

3. **GitHub Actions concurrency groups** — If scheduled rebuild and push-to-main deploy happen simultaneously, two deployments race. Add `concurrency` group with `cancel-in-progress: true`. (Spec Flow)

4. **External link handling** — Links outside `support.dopetech.ai` should get `target="_blank"` and `rel="noopener noreferrer"` during rendering. (Spec Flow)

5. **Search loading state** — What does user see while Pagefind index downloads on first interaction? Specify a loading indicator. (Spec Flow)

6. **Notion internal link warning** — Build should warn when rendered content contains `notion.so` or `notion.site` URLs, helping authors self-correct. (Architecture)

7. **Robots.txt sitemap reference** — Add `Sitemap: https://support.dopetech.ai/sitemap.xml` to robots.txt. (Spec Flow)

8. **Video block handling** — Brainstorm mentions video tutorials as P1 content. Plan's renderer doesn't mention video blocks. Either defer explicitly or add minimal `<video>`/`<iframe>` handler. (Architecture)

9. **Empty article body** — Article with valid metadata but zero content blocks. Should render with a "This article is being written" message or be skipped? (Spec Flow)

## Proposed Solutions

### Option 1: Add All to Plan as One-Liner Specs (Recommended)

**Approach:** Add each as a single task line in the relevant phase. No architectural changes needed.

**Pros:** Closes all gaps, prevents ad-hoc decisions during implementation
**Cons:** Plan grows slightly longer
**Effort:** 30 minutes
**Risk:** Low

## Acceptance Criteria

- [ ] Each item has a one-line specification in the relevant phase
- [ ] No ambiguity about expected behavior for any listed item

## Work Log

### 2026-03-12 - Code Review Discovery

**By:** Architecture Strategist, Spec Flow Analyzer
**Actions:** Cross-referenced plan sections to identify unspecified behaviors
