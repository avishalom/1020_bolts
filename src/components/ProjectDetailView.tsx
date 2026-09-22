'use client';

import React, { useState } from 'react';
import { 
  Project, 
  Task, 
  ProjectRequirement, 
  Question, 
  OwnedItem, 
  TaskStatus, 
  RequirementFulfillment,
  DiscussionComment
} from '@/types';
import { 
  ArrowLeft, 
  FolderKanban, 
  CheckSquare, 
  Package, 
  HelpCircle, 
  GitFork, 
  Copy, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MessageSquare,
  Lock,
  Users,
  Share2,
  ExternalLink,
  UserCheck
} from 'lucide-react';

interface ProjectDetailViewProps {
  project: Project;
  allProjects: Project[];
  tasks: Task[];
  requirements: ProjectRequirement[];
  questions: Question[];
  ownedItems: OwnedItem[];
  discussions: DiscussionComment[];
  onBack: () => void;
  onSelectProject: (proj: Project) => void;
  onAddTask: (projectId: string, title: string, notes?: string) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onAddRequirement: (projectId: string, req: Partial<ProjectRequirement>) => void;
  onUpdateRequirementFulfillment: (reqId: string, status: RequirementFulfillment, itemId?: string) => void;
  onAddQuestion: (projectId: string, title: string, details?: string) => void;
  onAddAnswer: (questionId: string, content: string) => void;
  onAddComment: (entityType: 'project' | 'question' | 'owned_item' | 'requirement', entityId: string, content: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onUpdateProjectStatus: (projectId: string, status: Project['status']) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  allProjects,
  tasks,
  requirements,
  questions,
  ownedItems,
  discussions,
  onBack,
  onSelectProject,
  onAddTask,
  onUpdateTaskStatus,
  onAddRequirement,
  onUpdateRequirementFulfillment,
  onAddQuestion,
  onAddAnswer,
  onAddComment,
  onDuplicateProject,
  onUpdateProjectStatus
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'requirements' | 'questions' | 'children' | 'discussions'>('tasks');
  
  // Modal / Form states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskNotes, setTaskNotes] = useState('');

  const [showReqModal, setShowReqModal] = useState(false);
  const [reqName, setReqName] = useState('');
  const [reqCategory, setReqCategory] = useState('Hardware');
  const [reqQty, setReqQty] = useState('1');
  const [reqUnit, setReqUnit] = useState('pcs');
  const [reqSpecs, setReqSpecs] = useState('');

  const [showQModal, setShowQModal] = useState(false);
  const [qTitle, setQTitle] = useState('');
  const [qDetails, setQDetails] = useState('');

  const [newComment, setNewComment] = useState('');
  const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({});

  // Filtered sub-items for this project
  const projectTasks = tasks.filter(t => t.project_id === project.id);
  const projectReqs = requirements.filter(r => r.project_id === project.id);
  const projectQuestions = questions.filter(q => q.project_id === project.id);
  const childProjects = allProjects.filter(p => p.parent_id === project.id);
  const projectDiscussions = discussions.filter(d => d.entity_type === 'project' && d.entity_id === project.id);

  // Available surplus/lendable items to offer
  const availableInventoryItems = ownedItems.filter(
    item => item.sharing_disposition !== 'unavailable'
  );

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    onAddTask(project.id, taskTitle.trim(), taskNotes.trim());
    setTaskTitle('');
    setTaskNotes('');
    setShowTaskModal(false);
  };

  const handleReqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName.trim()) return;
    onAddRequirement(project.id, {
      name: reqName.trim(),
      category: reqCategory,
      quantity: reqQty,
      unit: reqUnit,
      specifications: reqSpecs
    });
    setReqName('');
    setReqSpecs('');
    setShowReqModal(false);
  };

  const handleQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTitle.trim()) return;
    onAddQuestion(project.id, qTitle.trim(), qDetails.trim());
    setQTitle('');
    setQDetails('');
    setShowQModal(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment('project', project.id, newComment.trim());
    setNewComment('');
  };

  const taskStatusColumns: { status: TaskStatus; label: string; icon: React.ReactNode }[] = [
    { status: 'backlog', label: 'Backlog', icon: <Clock className="h-4 w-4 text-slate-400" /> },
    { status: 'in_progress', label: 'In Progress', icon: <Clock className="h-4 w-4 text-blue-400" /> },
    { status: 'blocked', label: 'Blocked', icon: <AlertTriangle className="h-4 w-4 text-amber-400" /> },
    { status: 'done', label: 'Done', icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header Navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Status selector */}
          <select
            value={project.status}
            onChange={(e) => onUpdateProjectStatus(project.id, e.target.value as Project['status'])}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="draft">Status: Draft</option>
            <option value="active">Status: Active</option>
            <option value="paused">Status: Paused</option>
            <option value="completed">Status: Completed</option>
          </select>

          {/* Duplicate Project Button */}
          <button
            onClick={() => onDuplicateProject(project.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Duplicate for Reuse</span>
          </button>
        </div>
      </div>

      {/* Main Project Overview Box */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        {/* Parent Breadcrumb if part of a hierarchy */}
        {project.parent_title && (
          <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
            <GitFork className="h-3.5 w-3.5" />
            <span>Parent Program:</span>
            <button
              onClick={() => {
                const parent = allProjects.find(p => p.id === project.parent_id);
                if (parent) onSelectProject(parent);
              }}
              className="hover:underline text-blue-300"
            >
              {project.parent_title}
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
              {project.title}
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              {project.description || 'No detailed description set for this project.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              Scope: {project.visibility}
            </span>
          </div>
        </div>

        {/* Planning Bucket Pills */}
        {project.buckets && project.buckets.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400 font-medium">Planning Buckets:</span>
            {project.buckets.map(bucket => (
              <span
                key={bucket.id}
                className="text-xs px-2.5 py-0.5 rounded-full border border-slate-700 bg-slate-900/80 font-medium"
                style={{ color: bucket.color }}
              >
                ● {bucket.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Secondary Navigation Tabs */}
      <div className="border-b border-slate-800 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'tasks'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            <span>Tasks ({projectTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('requirements')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'requirements'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Requirements (BOM & Tools) ({projectReqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'questions'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Questions & Advice ({projectQuestions.length})</span>
          </button>

          {childProjects.length > 0 && (
            <button
              onClick={() => setActiveTab('children')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'children'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitFork className="h-4 w-4" />
              <span>Sub-Projects ({childProjects.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('discussions')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'discussions'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Discussion ({projectDiscussions.length})</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: TASKS (Kanban Columns) */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Project Tasks</h2>
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {taskStatusColumns.map(col => {
              const colTasks = projectTasks.filter(t => t.status === col.status);
              return (
                <div key={col.status} className="glass-panel rounded-xl p-4 border border-slate-800/80 flex flex-col h-full min-h-[300px]">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                      {col.icon}
                      {col.label}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {colTasks.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-4 text-center">No tasks in {col.label.toLowerCase()}</p>
                    ) : (
                      colTasks.map(t => (
                        <div
                          key={t.id}
                          className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm text-slate-100 font-medium leading-snug">{t.title}</span>
                          </div>

                          {t.notes && (
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{t.notes}</p>
                          )}

                          {t.referenced_person_name && (
                            <div className="flex items-center gap-1 text-[11px] text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 w-fit">
                              <UserCheck className="h-3 w-3" />
                              <span>Ref: Ask {t.referenced_person_name}</span>
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                            <select
                              value={t.status}
                              onChange={(e) => onUpdateTaskStatus(t.id, e.target.value as TaskStatus)}
                              className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] text-slate-300 focus:outline-none"
                            >
                              <option value="backlog">Move to Backlog</option>
                              <option value="in_progress">Move to In Progress</option>
                              <option value="blocked">Move to Blocked</option>
                              <option value="done">Move to Done</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: REQUIREMENTS (BOM & Non-Standard Tools) */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Project Requirements (BOM & Tools)</h2>
              <p className="text-xs text-slate-400">
                Materials, components, and specialized tools required to complete this project.
              </p>
            </div>
            <button
              onClick={() => setShowReqModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors w-fit"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Requirement</span>
            </button>
          </div>

          <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="px-4 py-3">Item Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Qty & Unit</th>
                  <th className="px-4 py-3">Fulfillment Status</th>
                  <th className="px-4 py-3">Sourcing Pref</th>
                  <th className="px-4 py-3 text-right">Actions / Offer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {projectReqs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No project requirements added yet. Click "Add Requirement" to list materials or non-standard tools.
                    </td>
                  </tr>
                ) : (
                  projectReqs.map(req => (
                    <tr key={req.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-4 py-3.5 font-medium text-slate-100">
                        <div>{req.name}</div>
                        {req.specifications && (
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5">{req.specifications}</div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                          {req.category || 'General'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-300">
                        {req.quantity} {req.unit}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full border text-[11px] font-medium capitalize ${
                          req.fulfillment_status === 'fulfilled'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {req.fulfillment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 capitalize">
                        {req.sourcing_preference}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {req.fulfillment_status === 'needed' ? (
                            <button
                              onClick={() => onUpdateRequirementFulfillment(req.id, 'fulfilled')}
                              className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-xs font-medium transition-colors"
                            >
                              Mark Fulfilled
                            </button>
                          ) : (
                            <button
                              onClick={() => onUpdateRequirementFulfillment(req.id, 'needed')}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition-colors"
                            >
                              Reopen Need
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: QUESTIONS & ADVICE */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Contextual Questions & Advice</h2>
              <p className="text-xs text-slate-400">
                Ask trusted friends or club members questions anchored directly to this project.
              </p>
            </div>
            <button
              onClick={() => setShowQModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Ask Question</span>
            </button>
          </div>

          <div className="space-y-4">
            {projectQuestions.length === 0 ? (
              <div className="glass-panel p-8 rounded-xl text-center text-slate-500">
                No questions asked on this project yet.
              </div>
            ) : (
              projectQuestions.map(q => (
                <div key={q.id} className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${
                          q.status === 'answered'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        }`}>
                          {q.status}
                        </span>
                        <span className="text-xs text-slate-400">Asked by <strong className="text-slate-200">{q.author_name}</strong></span>
                      </div>
                      <h3 className="text-base font-semibold text-white">{q.title}</h3>
                      {q.details && <p className="text-xs text-slate-300 mt-1 leading-relaxed">{q.details}</p>}
                    </div>
                  </div>

                  {/* Answers */}
                  {q.answers && q.answers.length > 0 && (
                    <div className="pl-4 border-l-2 border-blue-500/40 space-y-3 pt-2">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Answers & Advice</h4>
                      {q.answers.map(ans => (
                        <div key={ans.id} className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between text-slate-400">
                            <span className="font-semibold text-slate-200">{ans.author_name}</span>
                            {ans.is_accepted && (
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-medium">
                                ✓ Accepted Solution
                              </span>
                            )}
                          </div>
                          <p className="text-slate-300 leading-relaxed">{ans.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Answer Form */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add your answer or advice..."
                      value={answerInputs[q.id] || ''}
                      onChange={(e) => setAnswerInputs({ ...answerInputs, [q.id]: e.target.value })}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => {
                        if (answerInputs[q.id]?.trim()) {
                          onAddAnswer(q.id, answerInputs[q.id].trim());
                          setAnswerInputs({ ...answerInputs, [q.id]: '' });
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                    >
                      Post Answer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: SUB-PROJECTS (HIERARCHY) */}
      {activeTab === 'children' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Child Sub-Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {childProjects.map(child => (
              <div
                key={child.id}
                onClick={() => onSelectProject(child)}
                className="glass-panel rounded-xl p-4 border border-slate-800 hover:border-blue-500/40 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="capitalize text-blue-400 font-medium">Status: {child.status}</span>
                  <span>{child.tasks_count || 0} tasks</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-1">{child.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{child.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: CONTEXTUAL DISCUSSIONS */}
      {activeTab === 'discussions' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Project Discussion Thread</h2>
          <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
            <div className="space-y-3">
              {projectDiscussions.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No messages in this project thread yet.</p>
              ) : (
                projectDiscussions.map(d => (
                  <div key={d.id} className="bg-slate-900/80 rounded-lg p-3 border border-slate-800 text-xs">
                    <div className="flex justify-between text-slate-400 font-semibold mb-1">
                      <span>{d.author_name}</span>
                      <span className="text-[10px]">{new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-300">{d.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder="Post a contextual comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TASK */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Add Task to Project</h3>
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Route Trident 101 smell-proof hose"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Optional details..."
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD REQUIREMENT */}
      {showReqModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Add Project Requirement</h3>
            <form onSubmit={handleReqSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 316 Stainless Steel T-Bolt Hose Clamps 1.5&quot;"
                  value={reqName}
                  onChange={(e) => setReqName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Hardware"
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Quantity & Unit</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="Qty"
                      value={reqQty}
                      onChange={(e) => setReqQty(e.target.value)}
                      className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Unit"
                      value={reqUnit}
                      onChange={(e) => setReqUnit(e.target.value)}
                      className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Specifications</label>
                <input
                  type="text"
                  placeholder="e.g. 316 Marine SS grade"
                  value={reqSpecs}
                  onChange={(e) => setReqSpecs(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReqModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
                >
                  Save Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASK QUESTION */}
      {showQModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Ask Contextual Question</h3>
            <form onSubmit={handleQSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Question Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best technique to lubricate 1-1/2&quot; hose?"
                  value={qTitle}
                  onChange={(e) => setQTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Details & Context</label>
                <textarea
                  rows={3}
                  placeholder="Describe your question..."
                  value={qDetails}
                  onChange={(e) => setQDetails(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
