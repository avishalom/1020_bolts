'use client';

import React, { useState } from 'react';
import { ProjectRequirement, OwnedItem, Question } from '@/types';
import { Search, X, Box, Package, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

interface ReverseSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirements: ProjectRequirement[];
  ownedItems: OwnedItem[];
  questions: Question[];
  onSelectItem: (item: OwnedItem) => void;
}

export const ReverseSearchModal: React.FC<ReverseSearchModalProps> = ({
  isOpen,
  onClose,
  requirements,
  ownedItems,
  questions,
  onSelectItem
}) => {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'both' | 'supply' | 'demand'>('both');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Supply Side: Available items (Surplus or Lendable)
  const matchedSupply = ownedItems.filter(item => {
    if (item.sharing_disposition === 'private' || item.sharing_disposition === 'unavailable') return false;
    if (!q) return true;
    const matchName = item.name.toLowerCase().includes(q);
    const matchCat = item.category?.toLowerCase().includes(q);
    const matchSpecs = item.specifications?.toLowerCase().includes(q);
    const matchAliases = item.search_aliases?.some(a => a.toLowerCase().includes(q));
    return matchName || matchCat || matchSpecs || matchAliases;
  });

  // Demand Side: Unresolved Project Requirements
  const matchedDemand = requirements.filter(req => {
    if (req.fulfillment_status === 'fulfilled') return false;
    if (!q) return true;
    const matchName = req.name.toLowerCase().includes(q);
    const matchCat = req.category?.toLowerCase().includes(q);
    const matchSpecs = req.specifications?.toLowerCase().includes(q);
    return matchName || matchCat || matchSpecs;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center pt-16 px-4">
      <div className="glass-panel rounded-2xl max-w-3xl w-full p-6 border border-slate-800 space-y-5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
        
        {/* Search Input Bar */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex-1 flex items-center gap-3 bg-slate-900 px-4 py-3 rounded-xl border border-slate-800 focus-within:border-blue-500">
            <Search className="h-5 w-5 text-blue-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search supply or demand: '1/4-20 set screw', '14-gauge wire', 'sanitation hose'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Scope:</span>
            <button
              onClick={() => setSearchMode('both')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                searchMode === 'both' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Both Supply & Demand
            </button>
            <button
              onClick={() => setSearchMode('supply')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                searchMode === 'supply' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Who Has Available? ({matchedSupply.length})
            </button>
            <button
              onClick={() => setSearchMode('demand')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                searchMode === 'demand' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Who Needs Items? ({matchedDemand.length})
            </button>
          </div>
        </div>

        {/* Results Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          
          {/* SUPPLY SIDE COLUMN */}
          {(searchMode === 'both' || searchMode === 'supply') && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Box className="h-4 w-4 text-emerald-400" />
                <span>Available Supply (Tools & Surplus)</span>
              </h3>

              {matchedSupply.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center italic">No available items match query.</p>
              ) : (
                matchedSupply.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectItem(item);
                      onClose();
                    }}
                    className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 hover:border-blue-500/40 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium capitalize">
                        {item.sharing_disposition.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400">Owner: {item.owner_name}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </h4>

                    {item.specifications && (
                      <p className="text-xs text-slate-400 line-clamp-1">{item.specifications}</p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-blue-400 font-medium">
                      <span>{item.available_quantity || 'Available'}</span>
                      <span className="flex items-center gap-1">
                        Inquire / Contact <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* DEMAND SIDE COLUMN */}
          {(searchMode === 'both' || searchMode === 'demand') && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="h-4 w-4 text-amber-400" />
                <span>Unresolved Needs (Demand)</span>
              </h3>

              {matchedDemand.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center italic">No project requirements match query.</p>
              ) : (
                matchedDemand.map(req => (
                  <div
                    key={req.id}
                    className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-medium">
                        Need: {req.quantity} {req.unit}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{req.category}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-white">
                      {req.name}
                    </h4>

                    {req.specifications && (
                      <p className="text-xs text-slate-400 line-clamp-1">{req.specifications}</p>
                    )}

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Prefers: <strong className="text-slate-200 capitalize">{req.sourcing_preference}</strong></span>
                      <span className="text-blue-400 font-medium">Offer Surplus</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
