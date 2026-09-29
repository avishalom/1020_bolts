# Define personal alpha and trusted-network beta

**Priority:** P0
**Status:** Todo
**Source:** [PRD and code review](../progress/2026-09-21-prd-and-code-review.md)

## Problem

The PRD describes a broad MVP while the code is a local visual prototype. The repository does not clearly distinguish demonstrated UI from working product behavior.

## Work

- Amend the PRD or add a delivery plan defining:
  - Personal-project alpha.
  - Trusted-network beta.
- Map every PRD capability to one slice.
- Mark prototype-only controls that do not yet have functional behavior.
- Decide whether alpha remains local-only or uses authenticated cloud persistence.
- Establish measurable exit criteria for each slice.
- Replace the boilerplate README with repository-specific setup, architecture, status, and limitations.

## Acceptance criteria

- Every in-scope capability has a delivery slice.
- The README accurately describes what works, what is mocked, and how to run it.
- Users and contributors are not led to believe sharing or Supabase persistence already works.
- Alpha and beta each have explicit completion criteria.
