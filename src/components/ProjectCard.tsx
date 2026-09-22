'use client';

import React from 'react';
import { Project, ProjectStatus } from '@/types';
import { 
  FolderKanban, 
  GitFork, 
  CheckCircle2, 
  Package, 
  HelpCircle, 
  Lock, 
  Users, 
  Copy,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onDuplicate: (projectId: string) => void;
  onStatusChange: (projectId: string, status: ProjectStatus) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  onDuplicate,
  onStatusChange
}) => {
  const taskProgress = project.tasks_count && project.tasks_count > 0
    ? Math.round(((project.tasks_done_count || 0) / project.tasks_count) * 100)
    : 0;

  const statusColors: Record<ProjectStatus, string> = {
    draft: 'bg-slate-800 text-slate-400 border-slate-700',
    active: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    paused: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  };

  const visibilityIcons: Record<string, React.ReactNode> = {
    private: <Lock className="h-3 w-3 text-slate-400" />,
    trusted_people: <Users className="h-3 w-3 text-emerald-400" />,
    selected_clubs: <Users className="h-3 w-3 text-purple-400" />,
    selected_people: <Users className="h-3 w-3 text-blue-400" />
  };

  return (
    <div
      onClick={() => onSelect(project)}
      className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between cursor-pointer border border-slate-800/80 group"
    >
      <div>
        {/* Top Meta Header: Parent info & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {project.parent_title ? (
            <div className="flex items-center gap-1.5 text-xs text-blue-400/90 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20 font-medium">
              <GitFork className="h-3 w-3" />
              <span className="truncate max-w-[180px]">{project.parent_title}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono">
              <span>Root Project</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize ${statusColors[project.status]}`}>
              {project.status}
            </span>
            <div title={`Visibility: ${project.visibility}`}>
              {visibilityIcons[project.visibility] || <Lock className="h-3 w-3 text-slate-400" />}
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-semibold text-slate-100 group-hover:text-blue-400 transition-colors mb-1.5 line-clamp-1">
          {project.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {project.description || 'No description provided.'}
        </p>

        {/* Planning Bucket Pills */}
        {project.buckets && project.buckets.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.buckets.map(bucket => (
              <span
                key={bucket.id}
                className="text-[11px] font-medium px-2 py-0.5 rounded-full border border-slate-700/60 bg-slate-900/60"
                style={{ color: bucket.color }}
              >
                ● {bucket.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="pt-3 border-t border-slate-800/80">
        {/* Task Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1 font-medium">
            <span>Tasks Progress</span>
            <span className="text-slate-300">{project.tasks_done_count || 0} / {project.tasks_count || 0} ({taskProgress}%)</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${taskProgress}%` }}
            />
          </div>
        </div>

        {/* Quick Indicators & Actions */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            {project.requirements_needed_count && project.requirements_needed_count > 0 ? (
              <span className="flex items-center gap-1 text-amber-400 font-medium" title="Items needed">
                <Package className="h-3.5 w-3.5" />
                <span>{project.requirements_needed_count} needed</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400" title="Requirements fulfilled">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Fulfilled</span>
              </span>
            )}

            {project.questions_count && project.questions_count > 0 ? (
              <span className="flex items-center gap-1 text-blue-400" title="Open questions">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>{project.questions_count} Qs</span>
              </span>
            ) : null}

            {project.child_count && project.child_count > 0 ? (
              <span className="flex items-center gap-1 text-purple-400" title="Child sub-projects">
                <GitFork className="h-3.5 w-3.5" />
                <span>{project.child_count} sub-projects</span>
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(project.id);
              }}
              title="Duplicate project as new template"
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>

            <span className="p-1 text-slate-500 group-hover:text-blue-400 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
