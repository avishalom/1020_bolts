-- CraftShare / ProjectHub Database Schema for Supabase PostgreSQL

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. User Trust (Asymmetric access grants)
-- User A (grantor) grants User B (grantee) access to content shared with "trusted_people".
CREATE TABLE IF NOT EXISTS public.user_trust (
  grantor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  grantee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (grantor_id, grantee_id),
  CONSTRAINT no_self_trust CHECK (grantor_id <> grantee_id)
);

-- 3. Clubs
CREATE TABLE IF NOT EXISTS public.clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT false NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Club Memberships
CREATE TABLE IF NOT EXISTS public.club_members (
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (club_id, user_id)
);

-- 5. Planning Buckets (User-defined tags: "Urgent", "Later", "Winter", "Sunny Day", "At the Shop", "On the Hard")
CREATE TABLE IF NOT EXISTS public.planning_buckets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, name)
);

-- 6. Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.projects(id) ON DELETE SET NULL, -- Organizational hierarchy
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  visibility TEXT DEFAULT 'private' NOT NULL CHECK (visibility IN ('private', 'selected_people', 'trusted_people', 'selected_clubs')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 7. Project Planning Buckets Junction
CREATE TABLE IF NOT EXISTS public.project_buckets (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  bucket_id UUID REFERENCES public.planning_buckets(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (project_id, bucket_id)
);

-- 8. Project Visibility Grants (For selected_people or selected_clubs)
CREATE TABLE IF NOT EXISTS public.project_visibility_grants (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  grantee_type TEXT NOT NULL CHECK (grantee_type IN ('person', 'club')),
  grantee_id UUID NOT NULL,
  PRIMARY KEY (project_id, grantee_type, grantee_id)
);

-- 9. Task Categories
CREATE TABLE IF NOT EXISTS public.task_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  position INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 10. Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.task_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'backlog' NOT NULL CHECK (status IN ('backlog', 'in_progress', 'blocked', 'done')),
  referenced_person_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- "ask Sam" informal reference
  position INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 11. Owned & Available Items (User inventory/shareable catalog)
CREATE TABLE IF NOT EXISTS public.owned_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  search_aliases TEXT[] DEFAULT '{}',
  specifications TEXT,
  sharing_disposition TEXT DEFAULT 'private' NOT NULL CHECK (sharing_disposition IN ('private', 'available_to_lend', 'surplus_available', 'unavailable')),
  available_quantity TEXT,
  visibility TEXT DEFAULT 'trusted_people' NOT NULL CHECK (visibility IN ('private', 'selected_people', 'trusted_people', 'selected_clubs')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 12. Project Requirements (BOM / Tools / Consumables)
CREATE TABLE IF NOT EXISTS public.project_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  quantity TEXT,
  unit TEXT,
  specifications TEXT,
  notes TEXT,
  fulfillment_status TEXT DEFAULT 'needed' NOT NULL CHECK (fulfillment_status IN ('needed', 'fulfilled', 'no_longer_needed')),
  sourcing_preference TEXT DEFAULT 'undecided' NOT NULL CHECK (sourcing_preference IN ('already_owned', 'buy', 'borrow', 'make', 'any', 'undecided')),
  fulfilled_by_owned_item_id UUID REFERENCES public.owned_items(id) ON DELETE SET NULL,
  visibility TEXT DEFAULT 'inherited' NOT NULL CHECK (visibility IN ('inherited', 'private', 'selected_people', 'trusted_people', 'selected_clubs')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 13. Task Requirements Junction
CREATE TABLE IF NOT EXISTS public.task_requirements (
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  requirement_id UUID REFERENCES public.project_requirements(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (task_id, requirement_id)
);

-- 14. Questions
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  requirement_id UUID REFERENCES public.project_requirements(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'answered', 'closed')),
  visibility TEXT DEFAULT 'inherited' NOT NULL CHECK (visibility IN ('inherited', 'private', 'selected_people', 'trusted_people', 'selected_clubs')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 15. Answers
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_accepted BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 16. Contextual Discussions / Comments
CREATE TABLE IF NOT EXISTS public.discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('project', 'question', 'owned_item', 'requirement')),
  entity_id UUID NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 17. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link_url TEXT,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- INDEXES for Fast Queries & Search
CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_parent ON public.projects(parent_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_requirements_project ON public.project_requirements(project_id);
CREATE INDEX IF NOT EXISTS idx_owned_items_owner ON public.owned_items(owner_id);
CREATE INDEX IF NOT EXISTS idx_owned_items_sharing ON public.owned_items(sharing_disposition);
CREATE INDEX IF NOT EXISTS idx_questions_project ON public.questions(project_id);
CREATE INDEX IF NOT EXISTS idx_discussions_entity ON public.discussions(entity_type, entity_id);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trust ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planning_buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_visibility_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owned_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- BASIC RLS POLICIES FOR PROFILES
CREATE POLICY "Public profiles are viewable by authenticated users" 
  ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- BASIC RLS POLICIES FOR PROJECTS (Owner full access, others based on visibility)
CREATE POLICY "Users can manage their own projects"
  ON public.projects FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Users can view shared projects"
  ON public.projects FOR SELECT USING (
    visibility = 'trusted_people' AND EXISTS (
      SELECT 1 FROM public.user_trust WHERE grantor_id = owner_id AND grantee_id = auth.uid()
    )
  );

-- BASIC RLS POLICIES FOR TASKS (Inherits project ownership)
CREATE POLICY "Users can manage tasks in their projects"
  ON public.tasks FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = tasks.project_id AND owner_id = auth.uid())
  );

-- TRIGGER FOR PROFILE CREATION ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
