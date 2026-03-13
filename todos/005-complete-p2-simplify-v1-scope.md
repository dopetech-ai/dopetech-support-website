---
status: complete
priority: p2
issue_id: "005"
tags: [code-review, simplicity, yagni, scope]
dependencies: []
---

# Simplify V1 Scope — Remove Over-Engineered Features

## Problem Statement

The "Research Insights" sections from the deepen-plan phase introduced several engineering solutions to problems that don't exist at V1 scale (10-20 articles, one trusted content author, modest traffic). Every recommendation was framed as "CRITICAL" or "HIGH" severity, which inflated their perceived importance. These collectively add ~3 unnecessary dependencies and 1-2 days of implementation work.

## Findings

The simplicity reviewer identified 6 YAGNI violations. Each needs a decision:

**1. DOMPurify (isomorphic-dompurify + jsdom dependency)**
- Content comes from a trusted Notion workspace you control
- Notion API returns structured blocks, not raw HTML
- `notion-to-md` converts those blocks — no pathway for arbitrary HTML injection
- DOMPurify can silently strip legitimate content (video embeds, iframes)
- **Recommendation:** Remove for V1. Revisit if CMS opens to external contributors.

**2. Sharp (native binary dependency)**
- Only 10-20 articles, minimal images at launch
- Sharp adds platform-specific native builds and CI complications
- The useful part (image dimensions for CLS prevention) can be done with `image-size` (pure JS, 15KB)
- WebP conversion can wait until image payload size actually matters
- **Recommendation:** Replace with `image-size` for dimensions only. Serve original images.

**3. Per-article JSON files + manifest**
- Justified by "scales to hundreds of articles without loading all content into memory"
- V1 has 10-20 articles — even 100 would be well under 10MB of JSON
- Adds file system complexity (two data directories, per-file read/write logic)
- If Astro is chosen, this entire concept is moot (Content Layer API)
- **Recommendation:** Use single `articles.json`. Split later if needed (~30min refactor).

**4. Content change detection (hash + cache/KV storage)**
- Requires caching mechanism, hash computation, cross-build state persistence
- The real problem: 15-minute cron = 96 deploys/day, exceeding Cloudflare free tier (500/month)
- Simpler fix: reduce cron to every 2-4 hours (6-12 deploys/day)
- Keep `workflow_dispatch` for urgent updates
- **Recommendation:** Change cron to every 2 hours. Remove hashing subsystem.

**5. CSP headers**
- Static site with no user input, no forms, no cookies, no dynamic content
- Will break Pagefind (dynamic script loading) and Cloudflare Analytics (external script)
- Plan already acknowledges: "Adjust CSP for Pagefind if needed" — you'll spend more time debugging CSP violations than it prevents
- **Recommendation:** Remove CSP. Keep other security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy).

**6. Pre-defined categories: 7 listed, brainstorm says 4-5**
- 7 categories with 10-20 articles = 2-3 per category (anemic pages)
- Plan already filters empty categories, but defining 7 route slugs is premature
- **Recommendation:** Define 4-5 in site config: Getting Started, DopeApps, DopeSites, Troubleshooting. Add others when content exists.

## Proposed Solutions

### Option 1: Accept All 6 Simplifications (Recommended)

**Approach:** Update the plan to remove/simplify all 6 items.

**Pros:** Saves 1-2 days implementation, eliminates 3 dependencies (isomorphic-dompurify/jsdom, sharp, tailwind-merge), removes 1 subsystem (change detection), reduces scope to match brainstorm V1 intent
**Cons:** Less "production-ready" posture — these features would need to be added later if scale demands
**Effort:** 1 hour (plan updates)
**Risk:** Low — all can be added later without architectural changes

### Option 2: Keep Selective Items

**Approach:** Keep DOMPurify (defense-in-depth) and image-size (dimensions), remove the rest.

**Pros:** Balanced security posture
**Cons:** Still carries jsdom dependency weight
**Effort:** 45 minutes
**Risk:** Low

## Acceptance Criteria

- [ ] Decision made on each of the 6 items
- [ ] Plan updated to reflect decisions
- [ ] Enhancement Summary updated to match
- [ ] No new dependencies added for removed features

## Work Log

### 2026-03-12 - Code Review Discovery

**By:** Code Simplicity Reviewer
**Actions:** Identified 6 YAGNI violations introduced by deepen-plan research insights. Estimated 1-2 days of implementation savings from removal.
