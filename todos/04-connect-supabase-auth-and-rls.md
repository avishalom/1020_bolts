# Connect Supabase authentication, persistence, and RLS

**Priority:** P0
**Status:** Todo
**Depends on:** [03 — Implement visibility and permissions](03-implement-visibility-and-permissions.md)
**Source:** [PRD and code review](../progress/2026-09-21-prd-and-code-review.md)

## Problem

The application uses mock data and local storage exclusively. RLS is enabled in the schema, but most tables have no policies and are unusable from an authenticated client.

## Work

- Add supported Supabase browser and server clients.
- Implement sign-in, sign-out, session handling, and profile creation.
- Replace hard-coded `user_1` mutations with the authenticated user.
- Add migrations rather than relying on a single monolithic schema file.
- Complete owner and shared-reader RLS policies for every enabled table.
- Add explicit `WITH CHECK` rules for writes.
- Allow shared readers to read only the child records permitted by inherited visibility.
- Define safe policies for trust, club membership, grants, answers, discussions, and notifications.
- Add indexes required by permission and reverse-search queries.
- Migrate or intentionally discard local prototype data.
- Add database-level integration tests for authorization boundaries.

## Acceptance criteria

- Two authenticated test users can create independent data.
- A user cannot read or mutate another user's private content.
- Explicit trust and club grants expose only the intended records.
- Requirements, owned items, questions, answers, discussions, and notifications can be used under RLS.
- Revoking a grant removes access.
- Database integration tests exercise every RLS policy.
