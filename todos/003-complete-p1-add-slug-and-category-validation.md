---
status: complete
priority: p1
issue_id: "003"
tags: [code-review, architecture, routing, security]
dependencies: []
---

# Add Slug Sanitization and Category Slug Collision Validation

## Problem Statement

Two related validation gaps could produce broken URLs or routing conflicts:

1. **Category slug collision with reserved paths:** Category pages live at root (`/getting-started`, `/dopeapps`). If someone creates a Notion category named "articles", "search", "404", "images", or "_pagefind", the routing breaks silently. No deny-list exists.

2. **Article slug validation:** If an author sets the Slug property to "How to Setup DopeApps" (with spaces, uppercase), the URL becomes broken or ugly. No sanitization or validation exists.

## Findings

- Architecture Strategist: "The plan does not validate that category slugs cannot collide with reserved paths."
- Spec Flow Analyzer: "What if the Slug contains invalid URL characters (spaces, special characters, uppercase)? What if the Category value doesn't match any defined category slug?"

## Proposed Solutions

### Option 1: Add Validation Rules to Plan (Recommended)

**Approach:** Add to Phase 2 build pipeline:
1. Maintain a deny-list of reserved path segments: `articles`, `search`, `404`, `images`, `_pagefind`, `fonts`, `_headers`, `_redirects`, `api`
2. Slugify article slugs during build: lowercase, replace spaces with hyphens, strip special characters. Log warning when sanitized differs from original.
3. Validate that each article's Category value matches a defined category in site config. Skip articles with unrecognized categories (with warning).

**Pros:** Prevents silent routing failures, catches author mistakes at build time
**Cons:** None
**Effort:** 30 minutes (plan update)
**Risk:** Low

## Acceptance Criteria

- [ ] Reserved path deny-list specified in plan
- [ ] Slug sanitization rules specified
- [ ] Unrecognized category handling specified
- [ ] All validations produce build warnings (not failures)

## Work Log

### 2026-03-12 - Code Review Discovery

**By:** Architecture Strategist, Spec Flow Analyzer
**Actions:** Identified routing collision risk and missing input validation
