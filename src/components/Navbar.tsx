'use client';

import React from 'react';
import { 
  Wrench, 
  Search, 
  Plus, 
  FolderKanban, 
  Box, 
  HelpCircle, 
  Users, 
  ShieldCheck, 
  Bell,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'projects' | 'catalog' | 'questions' | 'clubs';
  setActiveTab: (tab: 'projects' | 'catalog' | 'questions' | 'clubs') => void;
  onOpenNewProject: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewProject,
  onOpenSearch
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-blue-400">
              CraftShare
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ProjectHub
            </span>
          </div>
        </div>

        {/* Global Search Bar trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 text-sm hover:border-slate-700 transition-colors shadow-inner"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-400" />
              <span>Search tools, materials, needs, or "Who has 1/4-20 set screw?"...</span>
            </span>
            <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-800 rounded border border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FolderKanban className="h-4 w-4" />
            <span className="hidden sm:inline">Projects</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'catalog'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Box className="h-4 w-4" />
            <span className="hidden sm:inline">Inventory & Surplus</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'questions'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Q&A</span>
          </button>

          <button
            onClick={() => setActiveTab('clubs')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'clubs'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Clubs & Trust</span>
          </button>
        </nav>

        {/* Actions & User Info */}
        <div className="flex items-center gap-2">
          {/* Mobile search trigger */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* New Project Button */}
          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all transform active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Project</span>
          </button>

          {/* User profile avatar badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Vish"
                className="h-8 w-8 rounded-full ring-2 ring-blue-500/40 object-cover"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
