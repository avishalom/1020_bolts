'use client';

import React, { useState } from 'react';
import { useCraftStore } from '@/lib/store';
import { Project, OwnedItem } from '@/types';
import { Navbar } from '@/components/Navbar';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectDetailView } from '@/components/ProjectDetailView';
import { NewProjectModal } from '@/components/NewProjectModal';
import { CatalogView } from '@/components/CatalogView';
import { ReverseSearchModal } from '@/components/ReverseSearchModal';
import { ClubsView } from '@/components/ClubsView';
import { 
  FolderKanban, 
  HelpCircle, 
  Plus, 
  Search, 
  Sparkles, 
  CheckCircle,
  Package,
  Wrench,
  GitFork,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const {
    state,
    users,
    clubs,
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
    addComment
  } = useCraftStore();

  const [activeTab, setActiveTab] = useState<'projects' | 'catalog' | 'questions' | 'clubs'>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter & Search states for Projects
  const [bucketFilter, setBucketFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectSearch, setProjectSearch] = useState<string>('');

  // Modals
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showReverseSearch, setShowReverseSearch] = useState(false);

  // Notification Banner State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDuplicate = (projectId: string) => {
    const dup = duplicateProject(projectId);
    if (dup) {
      triggerToast(`Project duplicated successfully as "${dup.title}"! Fresh workflow state created.`);
      setSelectedProject(dup);
    }
  };

  // Filtered projects
  const filteredProjects = state.projects.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (bucketFilter && !p.buckets?.some(b => b.id === bucketFilter)) return false;
    if (projectSearch.trim()) {
      const q = projectSearch.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      return matchTitle || matchDesc;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans">
      
      {/* Toast alert banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-blue-600 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl border border-blue-400/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="h-4 w-4 shrink-0 text-blue-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedProject(null);
        }}
        onOpenNewProject={() => setShowNewProjectModal(true)}
        onOpenSearch={() => setShowReverseSearch(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 pb-16">
        {selectedProject ? (
          <ProjectDetailView
            project={selectedProject}
            allProjects={state.projects}
            tasks={state.tasks}
            requirements={state.requirements}
            questions={state.questions}
            ownedItems={state.ownedItems}
            discussions={state.discussions}
            onBack={() => setSelectedProject(null)}
            onSelectProject={(p) => setSelectedProject(p)}
            onAddTask={addTask}
            onUpdateTaskStatus={updateTaskStatus}
            onAddRequirement={addRequirement}
            onUpdateRequirementFulfillment={updateRequirementFulfillment}
            onAddQuestion={addQuestion}
            onAddAnswer={addAnswer}
            onAddComment={addComment}
            onDuplicateProject={handleDuplicate}
            onUpdateProjectStatus={(pid, st) => {
              updateProjectStatus(pid, st);
              setSelectedProject(prev => prev ? { ...prev, status: st } : null);
            }}
          />
        ) : activeTab === 'projects' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            
            {/* Dashboard Hero Header */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5 flex items-center gap-2">
                  <span>Physical Projects Workspace</span>
                </h1>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Plan projects, manage tasks, record required tools & materials. Requirements naturally build your shareable catalog without front-loading workshop inventory.
                </p>
              </div>

              {/* Quick Stats Pills */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-center">
                  <div className="text-lg font-bold text-blue-400">{state.projects.length}</div>
                  <div className="text-[11px] text-slate-400 font-medium">Projects</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-center">
                  <div className="text-lg font-bold text-amber-400">
                    {state.requirements.filter(r => r.fulfillment_status === 'needed').length}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Items Needed</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-center">
                  <div className="text-lg font-bold text-emerald-400">
                    {state.ownedItems.filter(i => i.sharing_disposition !== 'private').length}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Shared Surplus & Tools</div>
                </div>
              </div>
            </div>

            {/* Planning Bucket Filter Pills Bar */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Flexible Planning Buckets
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setBucketFilter(null)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                    bucketFilter === null
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  All Projects ({state.projects.length})
                </button>

                {state.buckets.map(b => {
                  const isSelected = bucketFilter === b.id;
                  const count = state.projects.filter(p => p.buckets?.some(bk => bk.id === b.id)).length;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setBucketFilter(isSelected ? null : b.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-800 border-slate-600 text-white'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span style={{ color: b.color }}>●</span>
                      <span>{b.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status & Search Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed Library</option>
                </select>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter projects..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full glass-panel rounded-2xl p-12 text-center text-slate-500">
                  No projects match your current bucket or status filter.
                </div>
              ) : (
                filteredProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onSelect={(p) => setSelectedProject(p)}
                    onDuplicate={handleDuplicate}
                    onStatusChange={updateProjectStatus}
                  />
                ))
              )}
            </div>

          </div>
        ) : activeTab === 'catalog' ? (
          <CatalogView
            ownedItems={state.ownedItems}
            onAddOwnedItem={addOwnedItem}
            onUpdateSharing={updateOwnedItemSharing}
            onOpenThread={(item) => {
              setShowReverseSearch(true);
            }}
          />
        ) : activeTab === 'questions' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-blue-400" />
              <span>Questions & Advice Feed</span>
            </h1>

            <div className="space-y-4">
              {state.questions.map(q => (
                <div key={q.id} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-blue-400 font-medium">Project: {q.project_title}</span>
                    <span>Asked by {q.author_name}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{q.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{q.details}</p>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                    <span>{q.answers_count || 0} answers</span>
                    <button
                      onClick={() => {
                        const proj = state.projects.find(p => p.id === q.project_id);
                        if (proj) {
                          setSelectedProject(proj);
                          setActiveTab('projects');
                        }
                      }}
                      className="text-blue-400 hover:underline flex items-center gap-1"
                    >
                      View in Project <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ClubsView clubs={clubs} users={users} />
        )}
      </main>

      {/* Modals */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        allProjects={state.projects}
        availableBuckets={state.buckets}
        onCreateProject={(data) => {
          const newP = addProject(data);
          setSelectedProject(newP);
        }}
      />

      <ReverseSearchModal
        isOpen={showReverseSearch}
        onClose={() => setShowReverseSearch(false)}
        requirements={state.requirements}
        ownedItems={state.ownedItems}
        questions={state.questions}
        onSelectItem={(item) => {
          setActiveTab('catalog');
        }}
      />

    </div>
  );
}
