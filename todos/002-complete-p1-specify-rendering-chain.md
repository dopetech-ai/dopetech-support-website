---
status: complete
priority: p1
issue_id: "002"
tags: [code-review, architecture, notion]
dependencies: []
---

# Specify Full Rendering Chain (notion-to-md → ??? → HTML)

## Problem Statement

The plan uses `notion-to-md` v4 as the primary renderer, which produces **Markdown**, not HTML. But the DOMPurify sanitization step operates on **HTML**. There is an implicit, undocumented intermediate step: Markdown-to-HTML conversion. The plan says "Render blocks to HTML" and references `notion-to-md` in the same step without clarifying the full chain.

This matters because: Notion toggles, column layouts, and callout blocks do not have standard Markdown representations. `notion-to-md` will either flatten or skip them, losing semantic information that a direct block-to-HTML renderer would preserve.

## Findings

- Architecture Strategist: "The intermediate Markdown step loses semantic information (Notion callout types, toggle states, column layouts) that a direct block-to-HTML renderer preserves."
- Spec Flow Analyzer: "Does `notion-to-md` produce Markdown that is then converted to HTML? Or does it directly output HTML? If Markdown, what library converts the Markdown to HTML?"
- The pipeline as-written is: Notion blocks → `notion-to-md` → Markdown → ??? → HTML → DOMPurify → final HTML

## Proposed Solutions

### Option 1: Specify Markdown-to-HTML library (Simple)

**Approach:** Add `marked` or `remark` + `rehype` to the pipeline. Document: notion-to-md → Markdown → marked/remark → HTML → DOMPurify → output.

**Pros:** Keeps notion-to-md, minimal plan change
**Cons:** Still loses Notion-specific block semantics (toggles, callouts, columns)
**Effort:** 30 minutes (plan update)
**Risk:** Medium — callouts/toggles may render poorly

### Option 2: Evaluate notion-to-html alternatives (Better)

**Approach:** Research whether `notion-to-md` v4 can output HTML directly, or evaluate `@notionhq/client` block iteration with a lightweight custom HTML mapper. Only map the ~10 block types that actually appear in your content.

**Pros:** Preserves block semantics, simpler pipeline (no Markdown intermediate)
**Cons:** More research needed before locking the plan
**Effort:** 1-2 hours (research + plan update)
**Risk:** Low

## Acceptance Criteria

- [ ] Full rendering chain documented in Phase 2 (input format → each transformation → output format)
- [ ] Markdown-to-HTML library identified (if keeping notion-to-md)
- [ ] Callout, toggle, and code block rendering behavior specified

## Work Log

### 2026-03-12 - Code Review Discovery

**By:** Architecture Strategist, Spec Flow Analyzer
**Actions:** Identified rendering chain ambiguity by tracing data flow through pipeline stages
