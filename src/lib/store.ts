'use client';

import { useState, useEffect } from 'react';
import {
  Project,
  Task,
  ProjectRequirement,
  OwnedItem,
  Question,
  Answer,
  PlanningBucket,
  UserProfile,
  DiscussionComment,
  ProjectStatus,
  TaskStatus,
  RequirementFulfillment,
  SharingDisposition
} from '@/types';
import {
  MOCK_PROJECTS,
  MOCK_TASKS,
  MOCK_REQUIREMENTS,
  MOCK_OWNED_ITEMS,
  MOCK_QUESTIONS,
  MOCK_BUCKETS,
  MOCK_USERS,
  MOCK_DISCUSSIONS,
  MOCK_CLUBS
} from './mockData';
import { createOwnedItem, createProject } from './creationDefaults';

// Local storage key for persistence
const LOCAL_STORAGE_KEY = 'craftshare_store_v1';

interface AppState {
  projects: Project[];
  tasks: Task[];
  requirements: ProjectRequirement[];
  ownedItems: OwnedItem[];
  questions: Question[];
  buckets: PlanningBucket[];
  discussions: DiscussionComment[];
}

const getInitialState = (): AppState => {
  if (typeof window === 'undefined') {
    return {
      projects: MOCK_PROJECTS,
      tasks: MOCK_TASKS,
      requirements: MOCK_REQUIREMENTS,
      ownedItems: MOCK_OWNED_ITEMS,
      questions: MOCK_QUESTIONS,
      buckets: MOCK_BUCKETS,
      discussions: MOCK_DISCUSSIONS
    };
  }

  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load local storage state', e);
  }

  return {
    projects: MOCK_PROJECTS,
    tasks: MOCK_TASKS,
    requirements: MOCK_REQUIREMENTS,
    ownedItems: MOCK_OWNED_ITEMS,
    questions: MOCK_QUESTIONS,
    buckets: MOCK_BUCKETS,
    discussions: MOCK_DISCUSSIONS
  };
};

export function useCraftStore() {
  const [state, setState] = useState<AppState>(getInitialState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to save to local storage', e);
      }
    }
  }, [state]);

  // Project Actions
  const addProject = (projectData: Partial<Project>) => {
    const newProj = createProject(projectData);

    setState(prev => ({
      ...prev,
      projects: [newProj, ...prev.projects]
    }));
    return newProj;
  };

  const updateProjectStatus = (projectId: string, status: ProjectStatus) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === projectId ? { ...p, status, updated_at: new Date().toISOString() } : p
      )
    }));
  };

  const duplicateProject = (sourceProjectId: string) => {
    const source = state.projects.find(p => p.id === sourceProjectId);
    if (!source) return null;

    const newProjectId = `proj_${Date.now()}`;
    const duplicatedProj: Project = {
      ...source,
      id: newProjectId,
      title: `${source.title} (Copy)`,
      status: 'active',
      visibility: 'private', // fresh workflow & privacy state
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tasks_count: 0,
      tasks_done_count: 0,
      requirements_count: 0,
      requirements_needed_count: 0,
      questions_count: 0
    };

    // Copy tasks (reset status to backlog)
    const sourceTasks = state.tasks.filter(t => t.project_id === sourceProjectId);
    const newTasks: Task[] = sourceTasks.map((t, idx) => ({
      ...t,
      id: `t_${Date.now()}_${idx}`,
      project_id: newProjectId,
      status: 'backlog',
      referenced_person_id: null,
      referenced_person_name: undefined,
      created_at: new Date().toISOString()
    }));

    // Copy requirements (reset status to needed, unlink owned items)
    const sourceReqs = state.requirements.filter(r => r.project_id === sourceProjectId);
    const newReqs: ProjectRequirement[] = sourceReqs.map((r, idx) => ({
      ...r,
      id: `req_${Date.now()}_${idx}`,
      project_id: newProjectId,
      fulfillment_status: 'needed',
      fulfilled_by_owned_item_id: null,
      fulfilled_item: undefined,
      created_at: new Date().toISOString()
    }));

    duplicatedProj.tasks_count = newTasks.length;
    duplicatedProj.requirements_count = newReqs.length;
    duplicatedProj.requirements_needed_count = newReqs.length;

    setState(prev => ({
      ...prev,
      projects: [duplicatedProj, ...prev.projects],
      tasks: [...newTasks, ...prev.tasks],
      requirements: [...newReqs, ...prev.requirements]
    }));

    return duplicatedProj;
  };

  // Task Actions
  const addTask = (projectId: string, title: string, notes?: string, categoryId?: string) => {
    const newTask: Task = {
      id: `t_${Date.now()}`,
      project_id: projectId,
      category_id: categoryId || null,
      title,
      notes: notes || '',
      status: 'backlog',
      position: Date.now(),
      created_at: new Date().toISOString()
    };

    setState(prev => {
      const proj = prev.projects.find(p => p.id === projectId);
      const updatedProjects = prev.projects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            tasks_count: (p.tasks_count || 0) + 1
          };
        }
        return p;
      });
      return {
        ...prev,
        projects: updatedProjects,
        tasks: [newTask, ...prev.tasks]
      };
    });
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setState(prev => {
      const task = prev.tasks.find(t => t.id === taskId);
      if (!task) return prev;

      const updatedTasks = prev.tasks.map(t => (t.id === taskId ? { ...t, status } : t));
      const projTasks = updatedTasks.filter(t => t.project_id === task.project_id);
      const doneCount = projTasks.filter(t => t.status === 'done').length;

      const updatedProjects = prev.projects.map(p =>
        p.id === task.project_id ? { ...p, tasks_done_count: doneCount } : p
      );

      return {
        ...prev,
        tasks: updatedTasks,
        projects: updatedProjects
      };
    });
  };

  // Requirement Actions
  const addRequirement = (projectId: string, reqData: Partial<ProjectRequirement>) => {
    const newReq: ProjectRequirement = {
      id: `req_${Date.now()}`,
      project_id: projectId,
      name: reqData.name || 'New Item',
      category: reqData.category || 'General',
      quantity: reqData.quantity || '1',
      unit: reqData.unit || 'pc',
      specifications: reqData.specifications || '',
      notes: reqData.notes || '',
      fulfillment_status: 'needed',
      sourcing_preference: reqData.sourcing_preference || 'undecided',
      visibility: 'inherited',
      created_at: new Date().toISOString()
    };

    setState(prev => {
      const updatedProjects = prev.projects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            requirements_count: (p.requirements_count || 0) + 1,
            requirements_needed_count: (p.requirements_needed_count || 0) + 1
          };
        }
        return p;
      });
      return {
        ...prev,
        projects: updatedProjects,
        requirements: [newReq, ...prev.requirements]
      };
    });
  };

  const updateRequirementFulfillment = (
    reqId: string,
    fulfillmentStatus: RequirementFulfillment,
    fulfilledByItemId?: string
  ) => {
    setState(prev => {
      const req = prev.requirements.find(r => r.id === reqId);
      if (!req) return prev;

      const fulfilledItem = fulfilledByItemId
        ? prev.ownedItems.find(item => item.id === fulfilledByItemId)
        : req.fulfilled_item;

      const updatedReqs = prev.requirements.map(r =>
        r.id === reqId
          ? {
              ...r,
              fulfillment_status: fulfillmentStatus,
              fulfilled_by_owned_item_id: fulfilledByItemId || r.fulfilled_by_owned_item_id,
              fulfilled_item: fulfilledItem
            }
          : r
      );

      const projReqs = updatedReqs.filter(r => r.project_id === req.project_id);
      const neededCount = projReqs.filter(r => r.fulfillment_status === 'needed').length;

      const updatedProjects = prev.projects.map(p =>
        p.id === req.project_id ? { ...p, requirements_needed_count: neededCount } : p
      );

      return {
        ...prev,
        requirements: updatedReqs,
        projects: updatedProjects
      };
    });
  };

  // Owned Item Actions
  const addOwnedItem = (itemData: Partial<OwnedItem>) => {
    const newItem = createOwnedItem(itemData);

    setState(prev => ({
      ...prev,
      ownedItems: [newItem, ...prev.ownedItems]
    }));
    return newItem;
  };

  const updateOwnedItemSharing = (itemId: string, disposition: SharingDisposition) => {
    setState(prev => ({
      ...prev,
      ownedItems: prev.ownedItems.map(item =>
        item.id === itemId ? { ...item, sharing_disposition: disposition } : item
      )
    }));
  };

  // Question Actions
  const addQuestion = (projectId: string, title: string, details?: string) => {
    const proj = state.projects.find(p => p.id === projectId);
    const newQ: Question = {
      id: `q_${Date.now()}`,
      project_id: projectId,
      project_title: proj?.title || '',
      author_id: 'user_1',
      author_name: 'Vish (You)',
      title,
      details: details || '',
      status: 'open',
      visibility: 'inherited',
      created_at: new Date().toISOString(),
      answers_count: 0,
      answers: []
    };

    setState(prev => {
      const updatedProjects = prev.projects.map(p =>
        p.id === projectId ? { ...p, questions_count: (p.questions_count || 0) + 1 } : p
      );
      return {
        ...prev,
        projects: updatedProjects,
        questions: [newQ, ...prev.questions]
      };
    });
  };

  const addAnswer = (questionId: string, content: string) => {
    const newAns: Answer = {
      id: `ans_${Date.now()}`,
      question_id: questionId,
      author_id: 'user_1',
      author_name: 'Vish (You)',
      content,
      is_accepted: false,
      created_at: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          const answers = [...(q.answers || []), newAns];
          return {
            ...q,
            answers_count: answers.length,
            status: q.status === 'open' ? 'answered' : q.status,
            answers
          };
        }
        return q;
      })
    }));
  };

  // Discussion Actions
  const addComment = (
    entityType: 'project' | 'question' | 'owned_item' | 'requirement',
    entityId: string,
    content: string
  ) => {
    const newComm: DiscussionComment = {
      id: `disc_${Date.now()}`,
      entity_type: entityType,
      entity_id: entityId,
      author_id: 'user_1',
      author_name: 'Vish (You)',
      content,
      created_at: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      discussions: [...prev.discussions, newComm]
    }));
  };

  const resetToDefaults = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setState({
      projects: MOCK_PROJECTS,
      tasks: MOCK_TASKS,
      requirements: MOCK_REQUIREMENTS,
      ownedItems: MOCK_OWNED_ITEMS,
      questions: MOCK_QUESTIONS,
      buckets: MOCK_BUCKETS,
      discussions: MOCK_DISCUSSIONS
    });
  };

  return {
    state,
    users: MOCK_USERS,
    clubs: MOCK_CLUBS,
    addProject,
    updateProjectStatus,
    duplicateProject,
    addTask,
    updateTaskStatus,
    addRequirement,
    updateRequirementFulfillment,
    addOwnedItem,
    updateOwnedItemSharing,
    addQuestion,
    addAnswer,
    addComment,
    resetToDefaults
  };
}
