---
status: pending
priority: p3
issue_id: "008"
tags: [code-review, ux, operations]
dependencies: []
---

# UX and Operational Improvements (Nice-to-Have)

## Problem Statement

Several reviewers identified improvements that would enhance the user experience and operational robustness but are not critical for V1 launch. These can be addressed during implementation if time allows.

## Findings

**UX improvements:**
1. **Print stylesheet** — Dispensary staff may print articles for use on the shop floor where internet is unreliable. Add `@media print` that inverts to light theme, hides header/footer/nav. (Spec Flow)
2. **404 page URL parsing** — Pre-fill search input with words extracted from the failed URL path. Helps users recover and reduces 404 bounce rate (target: <30%). (Spec Flow)
3. **Date format and read time** — Specify "Month Day, Year" format for "Last updated". Show estimated read time on article pages for consistency with category listing. (Spec Flow)
4. **`aria-current="page"` on nav links** — Indicate active page/section in header navigation for screen readers. (Spec Flow)
5. **Category with 1 article** — Consider whether a single-article category page adds value or should redirect to the article. (Spec Flow)
6. **Replace `tailwind-merge` with `clsx`** — Not building a component library. `clsx` or template literals suffice. (Simplicity)

**Operational improvements:**
7. **Preview deployments for PRs** — Cloudflare Pages supports branch previews natively. One-line workflow addition. (Architecture)
8. **Local development fixtures** — Snapshot Notion API responses for offline dev. Prevents needing a live API key for every `npm run dev`. (Architecture)
9. **Post-deploy smoke test** — `curl` homepage, verify 200 + expected content. Catches gross failures before they persist. (Architecture)
10. **Build timeout** — Set explicit GitHub Actions timeout (e.g., 10 minutes) to prevent runaway builds from consuming CI budget. (Spec Flow)
11. **Rollback procedure documentation** — Document how to rollback via Cloudflare Pages deployment history. (Architecture)

## Proposed Solutions

### Option 1: Cherry-Pick During Implementation

**Approach:** Keep this list as a reference. Pick up items naturally during implementation when working on related code. Print stylesheet during Phase 3, preview deploys during Phase 4, etc.

**Effort:** Varies (5 min to 1 hour each)
**Risk:** Low

## Acceptance Criteria

- [ ] Decisions made on which items to include in V1
- [ ] Selected items added to relevant phase tasks

## Work Log

### 2026-03-12 - Code Review Discovery

**By:** Architecture Strategist, Code Simplicity Reviewer, Spec Flow Analyzer
**Actions:** Consolidated non-critical improvements from all review agents
