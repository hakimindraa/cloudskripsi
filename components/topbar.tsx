"use client";

import React from "react";
import { useWorkspace } from "@/context/workspace-context";
import { Search, Plus, Calendar, HardDrive, Sparkles } from "lucide-react";

interface TopbarProps {
  onOpenUploadModal?: () => void;
}

export function Topbar({ onOpenUploadModal }: TopbarProps) {
  const { currentProject, searchQuery, setSearchQuery } = useWorkspace();

  const [diffDays, setDiffDays] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (currentProject?.targetDefenseDate) {
      const targetDate = new Date(currentProject.targetDefenseDate);
      const today = new Date();
      const diffTime = targetDate.getTime() - today.getTime();
      setDiffDays(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
  }, [currentProject?.targetDefenseDate]);

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-xs sticky top-0 z-20 px-6 flex items-center justify-between gap-4">
      {/* Global Search Bar */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari draft, paper jurnal, atau catatan GPT..."
          className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
        />
      </div>

      {/* Right widgets: Countdown & Upload Action */}
      <div className="flex items-center gap-3">
        {/* Storage quota indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
          <HardDrive className="w-3.5 h-3.5 text-slate-500" />
          <span>Storage: <strong className="text-slate-900 font-semibold">12.4 MB</strong> / 1 GB (Free)</span>
        </div>

        {/* Countdown Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          <span>
            {diffDays !== null ? (
              diffDays > 0 ? (
                <>
                  <strong className="font-bold text-amber-800">{diffDays} Hari</strong> Menuju Sidang
                </>
              ) : (
                "Hari Target Sidang Telah Tiba!"
              )
            ) : (
              "Menghitung Target..."
            )}
          </span>
        </div>

        {/* Upload Button */}
        {onOpenUploadModal && (
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Update Draft</span>
          </button>
        )}
      </div>
    </header>
  );
}
