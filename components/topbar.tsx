"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/workspace-context";
import {
  Search,
  Plus,
  Calendar,
  HardDrive,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onOpenUploadModal?: () => void;
  onOpenMobileMenu?: () => void;
}

export function Topbar({ onOpenUploadModal, onOpenMobileMenu }: TopbarProps) {
  const {
    currentProject,
    searchQuery,
    setSearchQuery,
    activeWorkspace,
    setActiveWorkspace,
  } = useWorkspace();

  const [diffDays, setDiffDays] = useState<number | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  React.useEffect(() => {
    if (currentProject?.targetDefenseDate) {
      const targetDate = new Date(currentProject.targetDefenseDate);
      const today = new Date();
      const diffTime = targetDate.getTime() - today.getTime();
      setDiffDays(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
  }, [currentProject?.targetDefenseDate]);

  return (
    <>
      <header className="h-14 sm:h-16 border-b border-slate-200 bg-white/95 backdrop-blur-xs sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 select-none">
        {/* Left Side: Mobile Menu Button + Workspace Pill */}
        <div className="flex items-center gap-2">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Quick Workspace Switcher Pill */}
          <button
            type="button"
            onClick={() =>
              setActiveWorkspace(activeWorkspace === "saya" ? "pasangan" : "saya")
            }
            title="Ketuk untuk beralih ruang kerja (Saya / Pasangan)"
            className={cn(
              "md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition shadow-2xs cursor-pointer",
              activeWorkspace === "saya"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-pink-600 text-white border-pink-600"
            )}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
              {activeWorkspace === "saya" ? "S" : "P"}
            </span>
            <span className="max-w-[85px] truncate text-[11px]">
              {activeWorkspace === "saya" ? "Saya" : "Pasangan"}
            </span>
            <ChevronDown className="w-3 h-3 opacity-75" />
          </button>

          {/* Desktop Global Search Bar */}
          <div className="hidden md:block flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari draft, paper jurnal, atau catatan GPT..."
              className="w-64 lg:w-80 pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Right widgets: Mobile Search Toggle, Countdown & Upload Action */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Mobile Search Button Toggle */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            aria-label="Cari Dokumen"
          >
            {mobileSearchOpen ? (
              <X className="w-4 h-4 text-slate-700" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>

          {/* Storage quota indicator (Desktop only) */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
            <HardDrive className="w-3.5 h-3.5 text-slate-500" />
            <span>
              Storage: <strong className="text-slate-900 font-semibold">12.4 MB</strong> / 1 GB
            </span>
          </div>

          {/* Countdown Badge */}
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">
              {diffDays !== null ? (
                diffDays > 0 ? (
                  <>
                    <strong className="font-bold text-amber-800">{diffDays}</strong>
                    <span className="hidden sm:inline"> Hari Menuju Sidang</span>
                    <span className="sm:hidden">h</span>
                  </>
                ) : (
                  <span className="text-[11px]">Hari Sidang!</span>
                )
              ) : (
                <span className="text-[11px]">Target...</span>
              )}
            </span>
          </div>

          {/* Upload Button */}
          {onOpenUploadModal && (
            <button
              type="button"
              onClick={onOpenUploadModal}
              className={cn(
                "flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-white text-xs font-semibold transition shadow-xs cursor-pointer shrink-0",
                activeWorkspace === "saya"
                  ? "bg-slate-900 hover:bg-slate-800"
                  : "bg-pink-600 hover:bg-pink-700"
              )}
              title="Upload Berkas Draft Baru"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Update Draft</span>
              <span className="sm:hidden">Draft</span>
            </button>
          )}
        </div>
      </header>

      {/* Expandable Mobile Search Bar Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden px-3 py-2 bg-slate-100 border-b border-slate-200 flex items-center gap-2 animate-in slide-in-from-top-2 duration-150">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari draft, bab, jurnal, atau GPT..."
              className="w-full pl-8 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMobileSearchOpen(false)}
            className="text-xs font-medium text-slate-600 px-2 py-1 hover:text-slate-900"
          >
            Batal
          </button>
        </div>
      )}
    </>
  );
}
