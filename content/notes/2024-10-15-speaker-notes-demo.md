+++
title = "Speaker Notes — Demo Talk"
date = 2024-10-15
description = "Speaker notes for a demo conference presentation."

[taxonomies]
tags = ["talks", "speaker-notes"]

[extra]
lang    = "en"
math    = true
copy    = true
comment = false
+++

These are the speaker notes for the talk *[Talk Title]* given at
[Conference Name], [Month Year].

Slides: [link to slides if public]

---

## Slide 1 — Introduction

- Open with the problem statement
- Mention why it matters to this audience specifically
- Target: 2 minutes

---

## Slide 2 — Related Work

Key point to make verbally: the prior work missed X because they
assumed Y. Our insight is Z.

---

## Slide 3 — Method

Walk through the diagram slowly. The key equation is:

$$\hat{y} = f_\theta(x) = W_2 \,\sigma(W_1 x + b_1) + b_2$$

Emphasise that $\sigma$ here is not ReLU — this surprised reviewers.

---

## Q&A preparation

**Expected Q: Why not just use method X?**
A: Method X requires O(n²) memory which is prohibitive at our scale.
Our approach is O(n log n) by exploiting sparsity in…
