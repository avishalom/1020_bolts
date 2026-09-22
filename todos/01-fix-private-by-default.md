# Fix private-by-default behavior

**Priority:** P0
**Status:** Done
**Source:** [PRD and code review](../progress/2026-09-21-prd-and-code-review.md)

## Problem

New projects default to `trusted_people`, and the add-item form defaults to `surplus_available`. This contradicts the PRD and can expose content when a user accepts the form defaults.

## Work

- Default new projects to `private` in the UI and state layer.
- Default new owned items to the `private` sharing disposition.
- Default owned-item visibility to `private` unless the user deliberately selects another scope.
- Audit all creation flows for implicit sharing.
- Make the sharing choice explicit when changing an item from private to available or surplus.
- Add regression tests for creation defaults.

## Acceptance criteria

- Creating a project without changing visibility produces a private project.
- Creating an item without changing sharing controls produces a private item.
- No project, requirement, question, item, or discussion becomes shared solely by accepting defaults.
- Automated tests cover both UI defaults and persisted values.

## Outcome

Completed on 2026-09-22. Project and owned-item creation now use centralized private defaults, form state resets to private between creation attempts, and moving an owned item from private to a shared disposition requires confirmation. Regression tests cover the form-facing constants and the values produced for persistence. See [implementation notes](../progress/2026-09-22-private-by-default.md).
