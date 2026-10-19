"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/context/workspace-context";
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  BookmarkCheck,
  Sparkles,
  ClipboardList,
  Settings,
  ChevronDown,
  Check,
  User,
  Users,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/drafts", label: "Draft & Berkas", icon: FileText },
  { href: "/references", label: "Paper & Jurnal", icon: BookmarkCheck },
  { href: "/gpt-vault", label: "Catatan GPT", icon: Sparkles },
  { href: "/bimbingan", label: "Log Bimbingan", icon: ClipboardList },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { activeWorkspace, setActiveWorkspace, projects, currentProject, logout } = useWorkspace();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-base leading-tight tracking-tight">
              Cloudskripsi
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Academic Vault
            </div>
          </div>
        </Link>
      </div>

      {/* Dual-Workspace Switcher */}
      <div className="p-3 border-b border-slate-100 relative">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
          <span>Ruang Kerja (Workspace)</span>
          <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-medium">Dual</span>
        </div>

        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full text-left p-2 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 transition flex items-center justify-between gap-2 text-sm"
        >
          <div className="flex items-center gap-2 truncate">
            <div className={cn(
              "w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold shrink-0",
              activeWorkspace === "saya" 
                ? "bg-slate-900 text-white" 
                : "bg-pink-600 text-white"
            )}>
              {activeWorkspace === "saya" ? "S" : "P"}
            </div>
            <div className="truncate">
              <div className="font-semibold text-slate-900 text-xs truncate">
                {activeWorkspace === "saya" ? `Skripsi Saya (${projects.saya.studentName})` : `Skripsi Pasangan (${projects.pasangan.studentName})`}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {currentProject.fieldOfStudy}
              </div>
            </div>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform shrink-0", dropdownOpen && "rotate-180")} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute left-3 right-3 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 overflow-hidden">
            <div className="px-3 py-1.5 text-[11px] font-medium text-slate-500 bg-slate-50/70 border-b border-slate-100">
              Pilih Ruang Kerja:
            </div>
            
            <button
              type="button"
              onClick={() => {
                setActiveWorkspace("saya");
                setDropdownOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition",
                activeWorkspace === "saya" && "bg-slate-50 font-semibold text-slate-900"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px]">S</span>
                <div>
                  <div>Skripsi Saya ({projects.saya.studentName})</div>
                  <div className="text-[10px] text-slate-500">{projects.saya.fieldOfStudy}</div>
                </div>
              </div>
              {activeWorkspace === "saya" && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveWorkspace("pasangan");
                setDropdownOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition",
                activeWorkspace === "pasangan" && "bg-slate-50 font-semibold text-slate-900"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-pink-600 text-white flex items-center justify-center text-[10px]">P</span>
                <div>
                  <div>Skripsi Pasangan ({projects.pasangan.studentName})</div>
                  <div className="text-[10px] text-slate-500">{projects.pasangan.fieldOfStudy}</div>
                </div>
              </div>
              {activeWorkspace === "pasangan" && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </button>
          </div>
        )}
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
          Menu Utama
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition",
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-500")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile info */}
      <div className="p-3 border-t border-slate-100">
        <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
              {currentProject.studentName.slice(0, 2).toUpperCase()}
            </div>
            <div className="truncate text-xs">
              <div className="font-semibold text-slate-900 truncate">
                {currentProject.studentName}
              </div>
              <div className="text-slate-500 truncate text-[11px]">
                {currentProject.workspace === "saya" ? "Admin / Akun Utama" : "Partner Workspace"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            title="Keluar / Ganti Akun"
            className="text-slate-500 hover:text-rose-600 p-1.5 rounded-md hover:bg-white transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
