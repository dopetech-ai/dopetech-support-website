---
status: complete
priority: p1
issue_id: "001"
tags: [code-review, plan, scope]
dependencies: []
---

# Fix Plan Contradictions and Dead Spec

## Problem Statement

The plan contains three internal contradictions where different sections specify conflicting behavior. These create ambiguous implementation targets.

## Findings

- **Acceptance criteria references removed feature:** Line 750 lists "popular article links" as a functional requirement, but Phase 3 line 491 says "Popular article quick links deferred to V2." These contradict each other.
- **`_redirects` SPA fallback conflicts with static generation:** Line 356 creates `/* /index.html 200` for React+Vite, but the plan also prerender all routes to static HTML. The SPA fallback is harmful in a prerendered context — it will serve the React shell for any URL without a prerendered file, preventing proper 404 behavior. The marketing site's `prerender.js` does NOT use an SPA fallback for the same reason.
- **`/search?q=[query]` route is dead weight:** Line 145 lists a search results page, but Phase 4 implements inline dropdown results. The route adds a page template and routing for zero benefit.

## Proposed Solutions

### Option 1: Fix All Three (Recommended)

**Approach:**
1. Remove "popular article links" from acceptance criteria line 750
2. Remove the `_redirects` SPA fallback entirely for React+Vite path. Rely on prerendered files + Cloudflare's automatic `404.html` serving.
3. Remove `/search?q=[query]` from URL structure

**Pros:** Eliminates all contradictions, reduces scope
**Cons:** None
**Effort:** 15 minutes
**Risk:** Low

## Technical Details

**Affected files:**
- `docs/plans/2026-03-12-feat-support-website-v1-plan.md` — Lines 145, 356, 388, 750

## Acceptance Criteria

- [ ] No contradictions between Enhancement Summary, phase tasks, and acceptance criteria
- [ ] `_redirects` SPA fallback removed or replaced with specific redirect rules
- [ ] `/search` route removed from URL structure

## Work Log

### 2026-03-12 - Code Review Discovery

**By:** Architecture Strategist, Code Simplicity Reviewer
**Actions:** Identified 3 contradictions through cross-referencing plan sections
