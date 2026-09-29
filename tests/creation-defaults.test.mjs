import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_OWNED_ITEM_SHARING,
  DEFAULT_OWNED_ITEM_VISIBILITY,
  DEFAULT_PROJECT_VISIBILITY,
  createOwnedItem,
  createProject
} from '../src/lib/creationDefaults.ts';

test('project creation defaults are private in the UI and persisted value', () => {
  assert.equal(DEFAULT_PROJECT_VISIBILITY, 'private');
  assert.equal(
    createProject({ title: 'Private project' }, 'project-test', '2026-09-22T00:00:00.000Z')
      .visibility,
    'private'
  );
});

test('owned item creation defaults are private in the UI and persisted values', () => {
  assert.equal(DEFAULT_OWNED_ITEM_SHARING, 'private');
  assert.equal(DEFAULT_OWNED_ITEM_VISIBILITY, 'private');

  const item = createOwnedItem(
    { name: 'Private item' },
    'item-test',
    '2026-09-22T00:00:00.000Z'
  );

  assert.equal(item.sharing_disposition, 'private');
  assert.equal(item.visibility, 'private');
});

test('deliberately selected sharing and visibility values are preserved', () => {
  const project = createProject(
    { visibility: 'trusted_people' },
    'project-shared',
    '2026-09-22T00:00:00.000Z'
  );
  const item = createOwnedItem(
    { sharing_disposition: 'available_to_lend', visibility: 'selected_people' },
    'item-shared',
    '2026-09-22T00:00:00.000Z'
  );

  assert.equal(project.visibility, 'trusted_people');
  assert.equal(item.sharing_disposition, 'available_to_lend');
  assert.equal(item.visibility, 'selected_people');
});
