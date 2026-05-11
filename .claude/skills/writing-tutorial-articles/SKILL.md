---
name: writing-tutorial-articles
description: Use when creating MDX tutorial articles for Obsidian tutorial site. Covers tutorial structure, frontmatter patterns, and content organization for multi-language tutorial pairs.
---

# Writing Tutorial Articles

## Overview

Tutorial articles follow structured pattern: **Metadata → Hook → Prep → Workflow → Reference → Troubleshooting → Expert Tips**. Every section serves specific purpose — hook builds motivation, prep prevents setup failures, troubleshooting reduces support burden.

## When to Use

Create/edit `posts/{lang}/{field}/{software}/{slug}.mdx`. Pair zh/en via `translationOf`.

## Tutorial Structure (8-Section Pattern)

**ALL 8 sections required.** No skipping. Each serves distinct purpose.

```
1. METADATA HEADER  — version, difficulty ★ rating, time estimate
2. HOOK             — pain point → why common approach fails → what this offers
3. PREPARATION      — setup steps with specific config values
4. CORE WORKFLOW    — numbered steps, each with specific parameters
5. REFERENCE TABLE  — shortcuts, tools, or parameters in table form
6. TROUBLESHOOTING  — 3-5 common failures, root cause, fix
7. EXPERT TIPS      — real-world metrics, experience data, shortcuts
8. SUMMARY          — next steps, related articles
```

### 1. Metadata Header

Open article with version compatibility, difficulty, and time. Use blockquote format:

ZH version:
```markdown
> **适用版本**：Photoshop 2024（25.0 及以上，部分功能向后兼容至 CC 2019）
> **难度等级**：★★★☆☆（需熟悉图层、蒙版及基础调色）
> **预计耗时**：单张精修 20–30 分钟
```

EN version:
```markdown
> **Version**: Photoshop 2024 (25.0+, backward compatible to CC 2019)
> **Difficulty**: ★★★☆☆ (requires layers, masks, basic color)
> **Time**: 20–30 min per portrait
```

Difficulty scale:
- ★☆☆☆☆ — no prerequisites
- ★★☆☆☆ — basic familiarity
- ★★★☆☆ — needs intermediate knowledge
- ★★★★☆ — requires advanced skills
- ★★★★★ — expert only

### 2. Hook

Start with specific pain point reader recognizes. Then explain why common approach fails. Then state what this tutorial offers differently.

Include specific data points (percentages, years of experience) for credibility.

### 3. Preparation

List exact setup steps with concrete values:
- Software version and settings
- Color space / preferences / performance config
- File requirements (RAW vs JPEG, DPI)
- Prerequisite knowledge

### 4. Core Workflow

Number each major step. Within each step:
- Give **specific parameter values** (exposure +0.45, radius 8px, opacity 8%)
- Include **keyboard shortcuts** with key names
- Explain **WHY** behind each parameter
- Show **before/after** expected outcome
- Give **stop condition** (how to know when done)

### 5. Reference Table

Quick-scan table for tools/shortcuts/parameters:

| Function | Shortcut | Notes |
|----------|----------|-------|
| Fill 50% Gray | Shift+F5 → 50% Gray | Neutral base layer |
| Brush opacity | Number keys 0-9 | 8% and 15% common |

### 6. Troubleshooting

3-5 common failures. Each entry:

```markdown
1. **Symptom** → **Root cause** → **Fix**
```

Use real failure descriptions not generic "if something goes wrong."

### 7. Expert Tips

Data-backed advice:
- Time metrics ("avg 22 min per photo, first 10 take 1hr+")
- Specific iteration counts ("42 brush strokes for under-eye")
- Edge cases and gotchas
- Workflow speed-up tricks

### 8. Summary

Link to related tutorials in series. Call out next logical article.

## Frontmatter Rules

```yaml
---
title: "<Software> <Topic>: <Subtitle>"
description: <30-50 chars, what reader will learn>
field: <one of: design/dev/office/productivity/video/ai>
software: <lowercase, no spaces>
level: beginner|intermediate|advanced
language: zh|en
slug: <kebab-case>
date: <YYYY-MM-DD>
readTime: <integer minutes>
translationOf: </zh|en/{field}/{software}/{slug}>  # EN articles only
affiliateLinks:
  - name: <Vendor/Product>
    url: <affiliate URL>
    description: <value prop>
    vendor: <vendor name>
---
```

- `readTime`: 8-20 typical range
- `affiliateLinks`: align with field (design→Adobe, dev→GitHub, etc.)
- `translationOf`: EN article cross-refs ZH version

## Multi-Language Pairing

Every ZH article has EN counterpart with same slug:
- ZH: `posts/zh/{field}/{software}/{slug}.mdx`
- EN: `posts/en/{field}/{software}/{slug}.mdx` + `translationOf: /zh/{field}/{software}/{slug}`

Content mirrors but adapted per language — not machine translation. Both link to same affiliate products.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Vague values ("adjust slightly") | Give exact number + range |
| No preparation section | User hits config issues mid-tutorial |
| No stop conditions | Add "you should see X after this step" |
| Generic troubleshooting | Use real specific failures |
| No beginner empathy | Add time expectations ("first 10 take 1hr+") |

## Post-Writing Checklist

Before publishing, verify:

- [ ] All 8 sections present
- [ ] Metadata header uses blockquote format
- [ ] Each step has specific parameter values (not "adjust slightly")
- [ ] Each step explains WHY
- [ ] Reference table exists (shortcuts / tools / params)
- [ ] Troubleshooting has 3+ entries with root cause + fix
- [ ] Expert tips include real metrics/time data
- [ ] Frontmatter: field, software, level, language, slug, date, readTime all set
- [ ] EN article has `translationOf` linking to ZH version
- [ ] Affiliate links match article field

## Real-World Impact

Example tutorial (Photoshop portrait retouching) covers 17 parameter values, 9 shortcuts, 5 troubleshooting entries. Professional workflow with measurable metrics — structure that converts beginners into confident practitioners.

## Reference

See `posts/zh/design/photoshop/basics.mdx` and `posts/zh/design/photoshop/color-grading.mdx` for implemented examples.
