'use client';

import React, { useState } from 'react';
import { Project, PlanningBucket, VisibilityScope } from '@/types';
import { X, FolderPlus, GitFork, Tag, Lock, Users } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  allProjects: Project[];
  availableBuckets: PlanningBucket[];
  onCreateProject: (projectData: Partial<Project>) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  allProjects,
  availableBuckets,
  onCreateProject
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [visibility, setVisibility] = useState<VisibilityScope>('trusted_people');
  const [selectedBucketIds, setSelectedBucketIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parentProject = allProjects.find(p => p.id === parentId);
    const chosenBuckets = availableBuckets.filter(b => selectedBucketIds.includes(b.id));

    onCreateProject({
      title: title.trim(),
      description: description.trim(),
      parent_id: parentId || null,
      parent_title: parentProject?.title,
      visibility,
      buckets: chosenBuckets,
      status: 'active'
    });

    setTitle('');
    setDescription('');
    setParentId('');
    setSelectedBucketIds([]);
    onClose();
  };

  const toggleBucket = (bucketId: string) => {
    setSelectedBucketIds(prev =>
      prev.includes(bucketId) ? prev.filter(id => id !== bucketId) : [...prev, bucketId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel rounded-2xl max-w-lg w-full p-6 border border-slate-800 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create New Project</h2>
              <p className="text-xs text-slate-400">Organize tasks, requirements, tools, and questions.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Repairing head plumbing on boat"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Brief details or scope of work..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Parent Project Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <GitFork className="h-3.5 w-3.5 text-blue-400" />
              <span>Parent Program / Parent Project (Optional)</span>
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">None (Standalone Root Project)</option>
              {allProjects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Planning Buckets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-purple-400" />
              <span>Planning Buckets (Multi-select)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableBuckets.map(b => {
                const isSelected = selectedBucketIds.includes(b.id);
                return (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => toggleBucket(b.id)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors font-medium ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    ● {b.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visibility Scope */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
              <span>Visibility Scope</span>
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as VisibilityScope)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="private">Private (Only You)</option>
              <option value="trusted_people">Trusted People (Your Friends)</option>
              <option value="selected_clubs">Selected Clubs (Members of your clubs)</option>
            </select>
          </div>

          {/* Footer actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
