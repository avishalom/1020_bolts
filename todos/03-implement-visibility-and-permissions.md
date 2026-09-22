# Implement centralized visibility and permissions

**Priority:** P0
**Status:** Todo
**Depends on:** [02 — Define delivery slices](02-define-alpha-beta-slices.md)
**Source:** [PRD and code review](../progress/2026-09-21-prd-and-code-review.md)

## Problem

Visibility values currently act as labels. Search and browsing do not enforce trust, club membership, selected grants, ownership, or inherited visibility.

## Work

- Write a permission matrix for:
  - Owner.
  - Selected person.
  - Trusted person.
  - Selected-club member.
  - Unrelated authenticated user.
- Define inheritance rules for projects, requirements, questions, answers, and discussions.
- Define visibility behavior for owned items independently of sharing disposition.
- Create one canonical authorization API or SQL function used by all reads.
- Add concrete selected-person and selected-club grant records.
- Apply authorization to project lists, project details, Q&A, catalog browsing, and reverse search.
- Ensure `no_longer_needed` requirements never appear as active demand.
- Test access removal after trust revocation or leaving a club.

## Acceptance criteria

- Every content query applies the same documented permission rules.
- Reverse search returns only visible, explicitly available supply and visible `needed` demand.
- Private child entities cannot leak through shared parents or search.
- Revoked access takes effect on subsequent reads.
- A permission test matrix covers positive and negative cases for every visibility scope.
