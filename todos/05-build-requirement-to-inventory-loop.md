# Build the requirement-to-inventory loop

**Priority:** P1
**Status:** Todo
**Depends on:** [01 — Fix privacy defaults](01-fix-private-by-default.md)
**Source:** [PRD and code review](../progress/2026-09-21-prd-and-code-review.md)

## Problem

Requirement fulfillment currently changes only a status. The primary inventory workflow is manual entry, weakening the product's distinctive project-centered catalog model.

## Work

- Let users choose sourcing preference when creating or editing a requirement.
- Support Needed, Fulfilled, and No Longer Needed actions.
- When fulfilling, allow the user to:
  - Link an existing owned item.
  - Create a private owned item.
  - Fulfill without recording an owned item.
- After creating or linking an item, optionally mark it Available to Lend or Surplus Available.
- Keep fulfillment separate from item sharing.
- Show which owned item fulfills a requirement.
- Handle reopening a requirement without silently deleting or unsharing the owned item.
- Preserve free-text quantities for the MVP.

## Acceptance criteria

- A requirement can be fulfilled from an existing owned item.
- A newly acquired requirement can deliberately become an owned item.
- The resulting item remains private unless the user explicitly shares it.
- Reopening or abandoning a requirement leaves inventory in a predictable state.
- The manual add-item flow remains available but is not the only catalog-building path.
