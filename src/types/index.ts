export type ProjectStatus = 'draft' | 'active' | 'paused' | 'completed';
export type VisibilityScope = 'private' | 'selected_people' | 'trusted_people' | 'selected_clubs';
export type TaskStatus = 'backlog' | 'in_progress' | 'blocked' | 'done';
export type RequirementFulfillment = 'needed' | 'fulfilled' | 'no_longer_needed';
export type SourcingPreference = 'already_owned' | 'buy' | 'borrow' | 'make' | 'any' | 'undecided';
export type SharingDisposition = 'private' | 'available_to_lend' | 'surplus_available' | 'unavailable';
export type QuestionStatus = 'open' | 'answered' | 'closed';

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
}

export interface PlanningBucket {
  id: string;
  user_id: string;
  name: string;
  color: string;
}

export interface Project {
  id: string;
  owner_id: string;
  parent_id?: string | null;
  title: string;
  description?: string;
  status: ProjectStatus;
  visibility: VisibilityScope;
  created_at: string;
  updated_at: string;
  buckets?: PlanningBucket[];
  parent_title?: string;
  child_count?: number;
  tasks_count?: number;
  tasks_done_count?: number;
  requirements_count?: number;
  requirements_needed_count?: number;
  questions_count?: number;
}

export interface TaskCategory {
  id: string;
  project_id: string;
  name: string;
  position: number;
}

export interface Task {
  id: string;
  project_id: string;
  category_id?: string | null;
  title: string;
  notes?: string;
  status: TaskStatus;
  referenced_person_id?: string | null;
  referenced_person_name?: string;
  position: number;
  created_at: string;
  requirements?: ProjectRequirement[];
}

export interface OwnedItem {
  id: string;
  owner_id: string;
  owner_name?: string;
  name: string;
  category?: string;
  search_aliases?: string[];
  specifications?: string;
  sharing_disposition: SharingDisposition;
  available_quantity?: string;
  visibility: VisibilityScope;
  created_at: string;
}

export interface ProjectRequirement {
  id: string;
  project_id: string;
  name: string;
  category?: string;
  quantity?: string;
  unit?: string;
  specifications?: string;
  notes?: string;
  fulfillment_status: RequirementFulfillment;
  sourcing_preference: SourcingPreference;
  fulfilled_by_owned_item_id?: string | null;
  visibility: VisibilityScope | 'inherited';
  created_at: string;
  fulfilled_item?: OwnedItem;
}

export interface Question {
  id: string;
  project_id: string;
  project_title?: string;
  author_id: string;
  author_name: string;
  task_id?: string | null;
  requirement_id?: string | null;
  title: string;
  details?: string;
  status: QuestionStatus;
  visibility: VisibilityScope | 'inherited';
  created_at: string;
  answers_count?: number;
  answers?: Answer[];
}

export interface Answer {
  id: string;
  question_id: string;
  author_id: string;
  author_name: string;
  content: string;
  is_accepted: boolean;
  created_at: string;
}

export interface DiscussionComment {
  id: string;
  entity_type: 'project' | 'question' | 'owned_item' | 'requirement';
  entity_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface Club {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  is_private: boolean;
  location?: string;
  members_count?: number;
}
