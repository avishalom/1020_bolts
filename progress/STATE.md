# Current repository state

**Updated:** 2026-09-28
**Baseline:** `main` at `a03188f`, plus the review, planning, and privacy-default changes in the current working tree

## Executive summary

ProjectHub / CraftShare is currently a polished, local-first visual prototype for planning physical projects. It is useful for demonstrating the information architecture and personal workflow in one browser, but it is not yet the authenticated, multi-user product described by the PRD.

The first implementation todo, private-by-default creation, is complete. Seven follow-up todos remain, beginning with explicitly defining the personal alpha and trusted-network beta.

## What you can see and try now

Run the app locally:

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

The current prototype lets you:

- Browse, search, and filter seeded projects by status and planning bucket.
- Create private projects, including child projects and bucket assignments.
- Open a project and manage task statuses, requirements, questions, answers, and project discussions.
- Mark requirements fulfilled and update project status.
- Duplicate a completed project into fresh, private workflow state.
- Browse the owned/shared-item catalog and add private owned items.
- Deliberately mark owned items lendable or surplus; moving an existing private item to a shared state asks for confirmation.
- Browse the visual questions feed and mock clubs.
- Use the reverse-search interface over seeded supply and demand.

State is saved in browser `localStorage` under `craftshare_store_v1`. Existing browser data is not migrated by the privacy fix; it can be cleared with browser developer tools if you want to reload the seeded demo state.

## What is real versus simulated

| Area | Current state |
| --- | --- |
| UI and navigation | Working local React/Next.js prototype |
| Personal project mutations | Working in browser state and `localStorage` |
| Privacy defaults | Implemented and regression-tested for new projects and owned items |
| Seed projects, people, clubs, supply, and demand | Mock data |
| Authentication and user identity | Not connected; mutations use hard-coded `user_1` / “Vish” |
| Supabase persistence | Schema exists, but the app does not query it |
| Multi-user sharing | Not functional |
| Visibility and permission enforcement | Not functional; most scopes are currently labels |
| Club membership and trust grants | Not functional |
| Contextual item/need contact threads | Not functional; some controls route to general search |
| Notifications | Not functional |
| Automated coverage | Three tests for private creation defaults only |

Do not use this build for sensitive or genuinely shared data. Browser-local behavior is not a security boundary, and the incomplete Supabase RLS policies are not ready for an authenticated client.

## Verification state

- `npm test`: passes (3 tests).
- `npx tsc --noEmit`: passes.
- Changed-file ESLint: no errors; pre-existing warnings remain.
- Full `npm run lint`: fails on four pre-existing unescaped-quote errors plus warnings. Tracked in [todo 08](../todos/08-restore-quality-gates.md).
- Default production build: blocked in this execution environment by Turbopack attempting to bind an internal port.
- Webpack production build: reaches compilation, then fails because `next/font` tries to fetch Google Fonts without network access. Also tracked in todo 08.

## Work queue

1. **Done:** [Make creation private by default](../todos/01-fix-private-by-default.md).
2. **Next:** [Define the personal alpha and trusted-network beta](../todos/02-define-alpha-beta-slices.md).
3. [Centralize visibility and permissions](../todos/03-implement-visibility-and-permissions.md).
4. [Connect Supabase authentication, persistence, and RLS](../todos/04-connect-supabase-auth-and-rls.md).
5. [Build the requirement-to-inventory loop](../todos/05-build-requirement-to-inventory-loop.md).
6. [Complete remaining MVP domain interactions](../todos/06-complete-mvp-domain-interactions.md).
7. [Implement contextual threads](../todos/07-implement-contextual-threads.md).
8. [Restore lint, build, test, and CI quality gates](../todos/08-restore-quality-gates.md).

The detailed findings and recommended sequencing are in the [PRD and code review](2026-09-21-prd-and-code-review.md).

## What you need to do

1. Review and merge the current PR if the private-default behavior and delivery backlog look right.
2. Decide the key scope question for todo 02: should the personal alpha remain browser-local, or should authenticated Supabase persistence be part of alpha? The current recommendation is browser-local personal alpha first, followed by an authenticated trusted-network beta.
3. Choose whether the next implementation pass should prioritize product capability or repository reliability:
   - Product path: complete todo 02, then design permissions before connecting Supabase.
   - Reliability path: pull the deterministic build and basic CI portions of todo 08 forward.
4. When testing the privacy change, create a new project and a new owned item. Both should begin private. Seeded mock records intentionally still demonstrate shared visibility states.

No Supabase credentials, deployment action, or data migration are required to review the current prototype.
