---
status: pending
priority: p2
issue_id: "006"
tags: [code-review, plan, structure]
dependencies: []
---

# Consolidate 7 Phases to 5

## Problem Statement

Phases 5, 6, and 7 are checklists of polish, deployment, and content tasks rather than distinct development phases. More importantly, Phase 5 ("SEO, Accessibility & Polish") being separate from Phase 3 ("Page Templates") implies a waterfall sequence where SEO and accessibility are retrofitted after templates are built. In reality, semantic HTML, meta tags, and ARIA attributes should be baked into templates from the start.

## Findings

- Simplicity Reviewer: "Having SEO/accessibility as a separate phase creates a risk of building inaccessible templates and retrofitting."
- Loading skeleton shimmer (Phase 5) is irrelevant for a static site — static HTML shows content immediately.

## Proposed Solutions

### Option 1: Merge to 5 Phases (Recommended)

**Approach:**
1. **Phase 1: Project Scaffolding & Design System** (unchanged)
2. **Phase 2: Notion Content Pipeline** (unchanged)
3. **Phase 3: Page Templates, Search & SEO** (merge current Phases 3 + 4 + 5 — build accessible, SEO-ready templates from the start, wire Pagefind as part of template work)
4. **Phase 4: CI/CD & Deployment** (current Phase 6, renumbered)
5. **Phase 5: Content & Launch** (current Phase 7, renumbered)

**Pros:** SEO/a11y baked in from the start, fewer phases to track, removes loading skeleton
**Cons:** Phase 3 becomes larger
**Effort:** 30 minutes (plan restructure)
**Risk:** Low

## Acceptance Criteria

- [ ] Phases reduced to 5
- [ ] SEO meta tags, semantic HTML, and a11y built into page templates (Phase 3)
- [ ] Loading skeleton shimmer removed
- [ ] Phase numbering and day estimates updated

## Work Log

### 2026-03-12 - Code Review Discovery

**By:** Code Simplicity Reviewer
**Actions:** Identified phase structure encourages waterfall approach to accessibility
