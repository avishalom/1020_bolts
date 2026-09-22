'use client';

import React, { useState } from 'react';
import { OwnedItem, SharingDisposition } from '@/types';
import { 
  Box, 
  Plus, 
  Share2, 
  Search, 
  CheckCircle, 
  Clock, 
  Lock, 
  Users, 
  Tag, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface CatalogViewProps {
  ownedItems: OwnedItem[];
  onAddOwnedItem: (item: Partial<OwnedItem>) => void;
  onUpdateSharing: (itemId: string, disposition: SharingDisposition) => void;
  onOpenThread: (item: OwnedItem) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  ownedItems,
  onAddOwnedItem,
  onUpdateSharing,
  onOpenThread
}) => {
  const [filter, setFilter] = useState<'all' | 'my_items' | 'lendable' | 'surplus'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hardware & Fasteners');
  const [specs, setSpecs] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [sharing, setSharing] = useState<SharingDisposition>('surplus_available');

  const filteredItems = ownedItems.filter(item => {
    if (filter === 'my_items' && item.owner_id !== 'user_1') return false;
    if (filter === 'lendable' && item.sharing_disposition !== 'available_to_lend') return false;
    if (filter === 'surplus' && item.sharing_disposition !== 'surplus_available') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCat = item.category?.toLowerCase().includes(q);
      const matchSpecs = item.specifications?.toLowerCase().includes(q);
      const matchAliases = item.search_aliases?.some(a => a.toLowerCase().includes(q));
      return matchName || matchCat || matchSpecs || matchAliases;
    }

    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddOwnedItem({
      name: name.trim(),
      category: category.trim(),
      specifications: specs.trim(),
      available_quantity: quantity.trim(),
      sharing_disposition: sharing,
      search_aliases: name.toLowerCase().split(' ')
    });

    setName('');
    setSpecs('');
    setQuantity('1');
    setShowAddModal(false);
  };

  const sharingBadges: Record<SharingDisposition, { label: string; class: string }> = {
    private: { label: 'Private (Not Shared)', class: 'bg-slate-800 text-slate-400 border-slate-700' },
    available_to_lend: { label: 'Available to Lend', class: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    surplus_available: { label: 'Surplus Available', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    unavailable: { label: 'Unavailable', class: 'bg-amber-500/10 text-amber-400 border-amber-500/30' }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Principle Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Box className="h-6 w-6 text-blue-400" />
            <span>Personal Inventory & Shared Catalog</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Your catalog emerges naturally as you fulfill project requirements. Items remain private by default unless explicitly shared to lend or transfer surplus.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs shadow-md shadow-blue-500/20 transition-all w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Add Owned Item</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Shared & Owned Items ({ownedItems.length})
          </button>
          <button
            onClick={() => setFilter('my_items')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'my_items'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            My Owned Items
          </button>
          <button
            onClick={() => setFilter('lendable')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'lendable'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Available to Lend
          </button>
          <button
            onClick={() => setFilter('surplus')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'surplus'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Surplus Available
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search items by name or spec..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full glass-panel rounded-2xl p-12 text-center text-slate-500">
            No items found matching your filters.
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {item.category || 'General'}
                  </span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${sharingBadges[item.sharing_disposition].class}`}>
                    {sharingBadges[item.sharing_disposition].label}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{item.name}</h3>
                {item.specifications && (
                  <p className="text-xs text-slate-400 mb-2 leading-relaxed">{item.specifications}</p>
                )}

                {item.available_quantity && (
                  <div className="text-xs text-slate-300 font-medium">
                    Quantity: <span className="text-blue-400">{item.available_quantity}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="text-slate-400">
                  Owner: <strong className="text-slate-200">{item.owner_name}</strong>
                </div>

                {item.owner_id === 'user_1' ? (
                  <select
                    value={item.sharing_disposition}
                    onChange={(e) => onUpdateSharing(item.id, e.target.value as SharingDisposition)}
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none"
                  >
                    <option value="private">Private</option>
                    <option value="available_to_lend">Available to Lend</option>
                    <option value="surplus_available">Surplus Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                ) : (
                  <button
                    onClick={() => onOpenThread(item)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-xs font-medium transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Inquire / Contact</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: ADD ITEM */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Add Owned Item to Inventory</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SX1262 LoRa Transceiver Module"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Tools"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Available Quantity</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 surplus units"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Specifications</label>
                <input
                  type="text"
                  placeholder="e.g. 915MHz SPI interface module"
                  value={specs}
                  onChange={(e) => setSpecs(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sharing Disposition</label>
                <select
                  value={sharing}
                  onChange={(e) => setSharing(e.target.value as SharingDisposition)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="private">Private (Only You)</option>
                  <option value="available_to_lend">Available to Lend</option>
                  <option value="surplus_available">Surplus Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
