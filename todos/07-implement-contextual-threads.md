# Implement item, need, and question threads

**Priority:** P1
**Status:** Todo
**Depends on:** [03 — Implement visibility and permissions](03-implement-visibility-and-permissions.md), [04 — Connect Supabase authentication, persistence, and RLS](04-connect-supabase-auth-and-rls.md)
**Source:** [PRD and code review](../progress/2026-09-21-prd-and-code-review.md)

## Problem

“Inquire / Contact” routes to global search, supply selection loses the selected item, and demand results have no response action. Contextual discussion types exist but are not connected to these flows.

## Work

- Open the selected available item directly from catalog and search results.
- Open the selected visible need directly from demand results.
- Attach a lightweight discussion thread to each item or requirement.
- Show enough owner/project context for a recipient to understand the request.
- Add answer editing/removal and question-owner close behavior.
- Notify owners of new answers and thread replies.
- Enforce the parent entity's visibility on every thread read and write.
- Remove or disable dead contact controls until the corresponding flow exists.

## Acceptance criteria

- Selecting “Inquire / Contact” opens the correct item thread.
- Selecting “Offer Surplus” opens the correct requirement thread.
- A permitted second user can reply and the owner receives a notification.
- An unauthorized user cannot discover or access the entity or thread.
- The application does not claim to reserve, lend, collect payment, or manage fulfillment.
