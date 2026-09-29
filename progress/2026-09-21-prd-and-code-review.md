# PRD and Code Review

**Date:** 2026-09-21
**Reviewed branch:** `main`
**Reviewed commit:** `a03188fa7ba4e53304069fd47b7f4bbee918c368`
**Remote:** <https://github.com/avishalom/1020_bolts>

## Summary

The local checkout was clean and matched the current GitHub `main` commit at review time.

The revised PRD is substantially stronger than the original concept. It establishes a coherent project-centered product, an organic project-to-inventory loop, conservative privacy principles, sensible MVP exclusions, and a durable decision log.

The code is best characterized as a visual, single-browser prototype. It demonstrates much of the proposed information architecture with mock data and local persistence, but it does not yet implement the multi-user product described by the PRD.

## What is working well

- Project, task, requirement, question, item, club, and visibility concepts are represented in the TypeScript types.
- The UI demonstrates project hierarchy, planning buckets, task states, requirements, Q&A, catalog browsing, and reverse search.
- Completed projects can be duplicated with task and requirement workflow state reset.
- The Supabase schema anticipates asymmetric trust, clubs, project hierarchy, visibility grants, task categories, requirements, answers, discussions, and notifications.
- The PRD now clearly distinguishes fulfillment, sourcing, and sharing disposition.

## Findings

### 1. Critical — Supabase is unusable under the current RLS policies

`supabase/schema.sql` enables row-level security on every application table, but policies exist only for profiles, projects, and owner-managed tasks.

Authenticated clients cannot read or write:

- Trust relationships
- Clubs or memberships
- Planning buckets
- Project bucket assignments
- Visibility grants
- Requirements
- Owned items
- Questions and answers
- Discussions
- Notifications

Shared users also cannot read tasks because the task policy permits only the project owner.

The UI masks this because it does not connect to Supabase.

### 2. High — Private-by-default is violated

New projects default to `trusted_people` in both the project modal and store.

The add-item form defaults to `surplus_available`, despite nearby copy promising that items remain private unless explicitly shared.

Accepting the defaults therefore exposes newly created content beyond the owner.

### 3. High — Visibility scopes are labels rather than enforced permissions

The UI offers selected people, trusted people, and selected clubs but does not collect the corresponding grants.

Reverse search filters by item disposition, requirement state, and text, but not by:

- Visibility
- Trust grants
- Club membership
- Selected-person or selected-club grants
- Ownership
- Inherited project visibility

The SQL shared-project policy implements only `trusted_people`; selected-person and selected-club access cannot pass it.

### 4. High — The implementation is local-only

There is no Supabase client, authentication integration, server action, API route, or database query in `src`.

All state is mock data persisted to `localStorage`. Mutations are hard-coded to `user_1` and “Vish.”

Consequently, the defining network behaviors cannot occur between real users:

- Trusted access
- Club membership
- Shared discovery
- Cross-user Q&A
- Contextual discussions
- Notifications

This is acceptable for a clickable prototype but not yet an MVP implementation.

### 5. Medium — No-longer-needed requirements appear as active demand

Reverse search excludes only fulfilled requirements. A requirement marked `no_longer_needed` is still shown under unresolved needs.

Demand search should include only requirements whose fulfillment state is `needed`.

### 6. Medium — Contact actions do not open contextual threads

The catalog’s “Inquire / Contact” action opens global reverse search rather than a thread for the selected item.

Selecting a supply result switches to the general catalog and discards the selected item. Demand results have no actionable response control.

The PRD’s lightweight item and need discussions are modeled but not reachable.

### 7. Medium — Agreed MVP states and relationships are not operable

The following PRD capabilities are represented partially or not exposed in the UI:

- Select sourcing preference when creating a requirement.
- Mark a requirement no longer needed.
- Fulfill a requirement with a linked owned item.
- Offer to create or link an owned item after fulfillment.
- Close a question.
- Choose question visibility.
- Link questions to tasks or requirements.
- Categorize tasks.
- Link tasks to people, requirements, and questions.
- Create, rename, and remove planning buckets.
- Edit item visibility.
- Configure selected-person and selected-club grants.
- Copy task categories when duplicating a completed project.

### 8. Medium — The implemented catalog flow weakens the product wedge

The most visible catalog workflow is manual “Add Owned Item.”

Requirement fulfillment only flips a status. It does not create or link an owned item, nor prompt for sharing disposition.

The distinctive project → requirement → fulfillment → owned/shareable-item loop should be the primary catalog-building path.

### 9. Medium — Visibility inheritance is not implemented safely in SQL

Requirements and questions can store `inherited`, but no SQL policy or access function resolves inheritance through the parent project.

There are no visibility-grant tables for owned items, requirements, or questions. The polymorphic project visibility grant has no foreign key for its grantee.

Permission evaluation should be designed centrally and tested before the backend is connected.

### 10. Low — Lint fails

`npm run lint` reports 4 errors and 39 warnings.

The blocking errors are unescaped quotation marks in:

- `src/components/Navbar.tsx`
- `src/components/ProjectDetailView.tsx`

Warnings are primarily unused imports, unused variables, and unoptimized images.

### 11. Low — A production build was not verified

The default Turbopack build panicked while trying to bind an internal port in the execution environment.

The Webpack fallback progressed further but failed when `next/font` attempted to download Geist from Google Fonts without network access.

This does not establish an application-code compilation failure, but the repository does not currently have a verified deterministic/offline build.

## PRD assessment

The PRD is coherent, but the combined MVP remains large. Clubs, asymmetric trust, granular visibility, reverse-index discovery, contextual threads, notifications, taxonomy, and project management create substantial implementation and security surface area.

Recommended delivery slices:

### Slice 1 — Personal-project alpha

- Projects and hierarchy
- Planning buckets
- Tasks and categories
- Requirements and fulfillment
- Private questions
- Completed-project reuse
- Owned items derived from fulfilled requirements

### Slice 2 — Trusted-network beta

- Authentication
- Asymmetric trust grants
- Clubs and membership
- Visibility grants and inheritance
- Shared supply/demand search
- Answers and contextual discussions
- Notifications

## Recommended order of work

1. Correct privacy defaults immediately.
2. Establish the two delivery slices and mark unsupported UI honestly.
3. Design one centralized visibility model and its permission test matrix.
4. Implement authentication, Supabase persistence, and complete RLS.
5. Build the requirement-to-owned-item workflow.
6. Complete the remaining core interactions and contextual threads.
7. Add automated tests, clear lint, and make production builds deterministic.

## Verification performed

- Confirmed local `main` and GitHub `main` pointed to the same commit.
- Inspected the PRD, TypeScript domain types, local store, mock data, primary views, and Supabase schema.
- Ran `npm run lint`: failed with 4 errors and 39 warnings.
- Ran the default production build: blocked by a Turbopack environment-level port error.
- Ran a Webpack production build: reached compilation, then failed while fetching Google Fonts.

## Related todos

- [01 — Fix privacy defaults](../todos/01-fix-private-by-default.md)
- [02 — Define delivery slices](../todos/02-define-alpha-beta-slices.md)
- [03 — Implement and test visibility](../todos/03-implement-visibility-and-permissions.md)
- [04 — Connect Supabase and complete RLS](../todos/04-connect-supabase-auth-and-rls.md)
- [05 — Build requirement-to-inventory loop](../todos/05-build-requirement-to-inventory-loop.md)
- [06 — Complete MVP domain interactions](../todos/06-complete-mvp-domain-interactions.md)
- [07 — Implement contextual threads](../todos/07-implement-contextual-threads.md)
- [08 — Restore quality gates](../todos/08-restore-quality-gates.md)
