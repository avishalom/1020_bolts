# Private-by-default implementation

**Date:** 2026-09-22
**Todo:** [01 — Fix private-by-default behavior](../todos/01-fix-private-by-default.md)
**Status:** Complete

## Changes

- Added centralized creation defaults and pure project/owned-item factories in `src/lib/creationDefaults.ts`.
- New projects now default to `private` in both the project form and the state layer.
- New owned items now default to both private visibility and a private sharing disposition.
- Project and item form sharing state resets to private after submit or cancel, preventing a previous explicit sharing choice from becoming a later implicit default.
- Changing an existing owned item from private to lendable or surplus now requires explicit confirmation.
- Audited the remaining creation flows: requirements and questions inherit their project visibility, and duplicated projects already reset to private.
- Added regression tests for UI-facing default constants, persisted factory values, and preservation of deliberately selected non-private values.

## Verification

- `npm test` — passed (3 tests).
- `npx tsc --noEmit` — passed.
- `npm run lint` — still blocked by the four pre-existing unescaped-quote errors tracked in [08 — Restore quality gates](../todos/08-restore-quality-gates.md); this change introduced no new lint errors.
- `npm run build` — Turbopack remains blocked by the environment's internal-port restriction.
- `npx next build --webpack` — reached compilation and remains blocked by the existing Google Fonts network dependency tracked in todo 08.
