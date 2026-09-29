# Restore lint, build, and test quality gates

**Priority:** P1
**Status:** Todo
**Source:** [PRD and code review](../progress/2026-09-21-prd-and-code-review.md)

## Problem

Lint fails, production builds are not verified in the current environment, and the repository has no automated tests for core workflows or permissions.

## Work

- Fix the four blocking lint errors.
- Remove unused imports and variables or document intentional exceptions.
- Replace raw avatar images with an appropriate optimized or explicitly justified approach.
- Self-host fonts or otherwise prevent build-time network dependence.
- Verify both development and production builds.
- Add unit tests for state transitions and duplication.
- Add component or end-to-end tests for:
  - Private creation defaults.
  - Project, task, and requirement creation.
  - Requirement fulfillment.
  - Question answering and closing.
  - Supply/demand search filtering.
- Add integration tests for Supabase RLS before enabling real multi-user data.
- Run lint, type checking, tests, and production build in CI.

## Acceptance criteria

- Lint exits successfully with no errors.
- Type checking exits successfully.
- Production build succeeds without downloading fonts at build time.
- Core personal-project flows have automated coverage.
- Permission and RLS tests include denial cases, not only successful access.
- CI blocks merging when any required quality gate fails.
