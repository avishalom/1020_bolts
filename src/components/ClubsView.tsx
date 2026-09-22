'use client';

import React from 'react';
import { Club, UserProfile } from '@/types';
import { Users, ShieldCheck, UserPlus, MapPin, Globe, Check } from 'lucide-react';

interface ClubsViewProps {
  clubs: Club[];
  users: UserProfile[];
}

export const ClubsView: React.FC<ClubsViewProps> = ({ clubs, users }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6 text-purple-400" />
          <span>Clubs & Informal Trust Network</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Access between people is asymmetric (one-sided access grants). Club membership grants access only to content shared with that club.
        </p>
      </div>

      {/* Trusted Friends List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <span>Your Trusted People (Explicit Grants)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {users.filter(u => u.id !== 'user_1').map(u => (
            <div key={u.id} className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={u.avatar_url}
                  alt={u.full_name}
                  className="h-10 w-10 rounded-full ring-2 ring-emerald-500/30 object-cover"
                />
                <div>
                  <h3 className="text-sm font-semibold text-white">{u.full_name}</h3>
                  <p className="text-xs text-slate-400">@{u.username}</p>
                </div>
              </div>

              <span className="flex items-center gap-1 text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                <Check className="h-3 w-3" />
                <span>Granted</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Clubs Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-400" />
          <span>Your Clubs</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clubs.map(club => (
            <div key={club.id} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{club.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{club.description}</p>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium shrink-0">
                  {club.members_count} members
                </span>
              </div>

              {club.location && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-blue-400" />
                  <span>{club.location}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Member Status: <strong className="text-emerald-400 font-medium">Active Member</strong></span>
                <button className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors">
                  View Club Shared Needs & Items
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
