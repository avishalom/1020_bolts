import type { OwnedItem, Project, VisibilityScope } from '../types';

export const DEFAULT_PROJECT_VISIBILITY: VisibilityScope = 'private';
export const DEFAULT_OWNED_ITEM_VISIBILITY: VisibilityScope = 'private';
export const DEFAULT_OWNED_ITEM_SHARING = 'private' as const;

export function createProject(
  projectData: Partial<Project>,
  id = `proj_${Date.now()}`,
  timestamp = new Date().toISOString()
): Project {
  return {
    id,
    owner_id: 'user_1',
    parent_id: projectData.parent_id || null,
    parent_title: projectData.parent_title,
    title: projectData.title || 'Untitled Project',
    description: projectData.description || '',
    status: projectData.status || 'active',
    visibility: projectData.visibility || DEFAULT_PROJECT_VISIBILITY,
    created_at: timestamp,
    updated_at: timestamp,
    buckets: projectData.buckets || [],
    tasks_count: 0,
    tasks_done_count: 0,
    requirements_count: 0,
    requirements_needed_count: 0,
    questions_count: 0
  };
}

export function createOwnedItem(
  itemData: Partial<OwnedItem>,
  id = `item_${Date.now()}`,
  timestamp = new Date().toISOString()
): OwnedItem {
  return {
    id,
    owner_id: 'user_1',
    owner_name: 'Vish (You)',
    name: itemData.name || 'New Item',
    category: itemData.category || 'Tools',
    search_aliases: itemData.search_aliases || [],
    specifications: itemData.specifications || '',
    sharing_disposition: itemData.sharing_disposition || DEFAULT_OWNED_ITEM_SHARING,
    available_quantity: itemData.available_quantity || '',
    visibility: itemData.visibility || DEFAULT_OWNED_ITEM_VISIBILITY,
    created_at: timestamp
  };
}
