# Complete MVP domain interactions

**Priority:** P1
**Status:** Todo
**Depends on:** [02 — Define delivery slices](02-define-alpha-beta-slices.md)
**Source:** [PRD and code review](../progress/2026-09-21-prd-and-code-review.md)

## Problem

The types and schema model several agreed behaviors that cannot be performed in the current UI.

## Work

### Tasks

- Create and manage task categories.
- Link tasks to people, requirements, and questions.
- Preserve or copy categories correctly when duplicating a project.

### Questions

- Close and reopen questions.
- Choose or narrow question visibility.
- Link questions to tasks and requirements.
- Distinguish Answered from Closed.

### Planning buckets

- Create, rename, and remove user-defined buckets.
- Preserve project assignments safely when renaming.
- Require confirmation or a migration choice when deleting a used bucket.

### Project hierarchy

- Define hierarchy depth and cycle rules.
- Support moving a project without deleting descendants.
- Keep parent and child metadata derived rather than stale counters where practical.

### Items and grants

- Edit item visibility independently from sharing disposition.
- Configure selected people and selected clubs.

## Acceptance criteria

- Every alpha capability assigned in the delivery plan has an operable UI flow.
- Project duplication produces valid task-category and relationship data.
- Closed questions no longer appear as open work.
- Bucket and hierarchy changes do not orphan or silently destroy project data.
