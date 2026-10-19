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
  LogOut,
  X,
  Calendar,
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

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const {
    activeWorkspace,
    setActiveWorkspace,
    projects,
    currentProject,
    logout,
  } = useWorkspace();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleNavClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  // Reusable Sidebar Content
  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <Link
          href="/dashboard"
          onClick={handleNavClick}
          className="flex items-center gap-2.5"
        >
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

        {isMobile && onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dual-Workspace Switcher */}
      <div className="p-3 border-b border-slate-100 relative">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
          <span>Ruang Kerja (Workspace)</span>
          <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-medium">
            Dual
          </span>
        </div>

        {isMobile ? (
          // Direct, easy-to-tap cards for mobile (No confusing dropdowns)
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveWorkspace("saya");
              }}
              className={cn(
                "w-full text-left p-2.5 rounded-lg border transition flex items-center justify-between gap-2.5 cursor-pointer",
                activeWorkspace === "saya"
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0",
                    activeWorkspace === "saya"
                      ? "bg-white text-slate-900"
                      : "bg-slate-900 text-white"
                  )}
                >
                  S
                </div>
                <div className="min-w-0">
                  <div
                    className={cn(
                      "font-semibold text-xs truncate",
                      activeWorkspace === "saya" ? "text-white" : "text-slate-900"
                    )}
                  >
                    Skripsi Saya ({projects.saya.studentName})
                  </div>
                  <div
                    className={cn(
                      "text-[10px] truncate",
                      activeWorkspace === "saya"
                        ? "text-slate-300"
                        : "text-slate-500"
                    )}
                  >
                    {projects.saya.fieldOfStudy}
                  </div>
                </div>
              </div>
              {activeWorkspace === "saya" && (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveWorkspace("pasangan");
              }}
              className={cn(
                "w-full text-left p-2.5 rounded-lg border transition flex items-center justify-between gap-2.5 cursor-pointer",
                activeWorkspace === "pasangan"
                  ? "bg-pink-600 text-white border-pink-600 shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0",
                    activeWorkspace === "pasangan"
                      ? "bg-white text-pink-600"
                      : "bg-pink-600 text-white"
                  )}
                >
                  P
                </div>
                <div className="min-w-0">
                  <div
                    className={cn(
                      "font-semibold text-xs truncate",
                      activeWorkspace === "pasangan"
                        ? "text-white"
                        : "text-slate-900"
                    )}
                  >
                    Skripsi Pasangan ({projects.pasangan.studentName})
                  </div>
                  <div
                    className={cn(
                      "text-[10px] truncate",
                      activeWorkspace === "pasangan"
                        ? "text-pink-150"
                        : "text-slate-500"
                    )}
                  >
                    {projects.pasangan.fieldOfStudy}
                  </div>
                </div>
              </div>
              {activeWorkspace === "pasangan" && (
                <Check className="w-4 h-4 text-white shrink-0" />
              )}
            </button>
          </div>
        ) : (
          // Desktop Dropdown
          <>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full text-left p-2 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 transition flex items-center justify-between gap-2 text-sm cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <div
                  className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold shrink-0",
                    activeWorkspace === "saya"
                      ? "bg-slate-900 text-white"
                      : "bg-pink-600 text-white"
                  )}
                >
                  {activeWorkspace === "saya" ? "S" : "P"}
                </div>
                <div className="truncate">
                  <div className="font-semibold text-slate-900 text-xs truncate">
                    {activeWorkspace === "saya"
                      ? `Skripsi Saya (${projects.saya.studentName})`
                      : `Skripsi Pasangan (${projects.pasangan.studentName})`}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {currentProject.fieldOfStudy}
                  </div>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-slate-500 transition-transform shrink-0",
                  dropdownOpen && "rotate-180"
                )}
              />
            </button>

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
                    "w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition cursor-pointer",
                    activeWorkspace === "saya" &&
                      "bg-slate-50 font-semibold text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px]">
                      S
                    </span>
                    <div>
                      <div>Skripsi Saya ({projects.saya.studentName})</div>
                      <div className="text-[10px] text-slate-500">
                        {projects.saya.fieldOfStudy}
                      </div>
                    </div>
                  </div>
                  {activeWorkspace === "saya" && (
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveWorkspace("pasangan");
                    setDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition cursor-pointer",
                    activeWorkspace === "pasangan" &&
                      "bg-slate-50 font-semibold text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-pink-600 text-white flex items-center justify-center text-[10px]">
                      P
                    </span>
                    <div>
                      <div>
                        Skripsi Pasangan ({projects.pasangan.studentName})
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {projects.pasangan.fieldOfStudy}
                      </div>
                    </div>
                  </div>
                  {activeWorkspace === "pasangan" && (
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                </button>
              </div>
            )}
          </>
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
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition",
                isActive
                  ? activeWorkspace === "saya"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-pink-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4",
                  isActive ? "text-white" : "text-slate-500"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Target Sidang Info Banner */}
      {isMobile && currentProject.targetDefenseDate && (
        <div className="mx-3 mb-2 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-[11px] mb-0.5">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>Target Sidang</span>
          </div>
          <div className="text-[11px] text-amber-800">
            {currentProject.targetDefenseDate}
          </div>
        </div>
      )}

      {/* Footer Profile info */}
      <div className="p-3 border-t border-slate-100">
        <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
              {currentProject.studentName.slice(0, 2).toUpperCase()}
            </div>
            <div className="truncate text-xs">
              <div className="font-semibold text-slate-900 truncate">
                {currentProject.studentName}
              </div>
              <div className="text-slate-500 truncate text-[11px]">
                {currentProject.workspace === "saya"
                  ? "Admin / Akun Utama"
                  : "Partner Workspace"}
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
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: Hidden on mobile (< md), sticky w-64 on desktop */}
      <aside className="hidden md:flex w-64 border-r border-slate-200 bg-white flex-col h-screen sticky top-0 z-30 select-none shrink-0">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer Slide-over: Visible only on mobile when mobileOpen is true */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          {/* Slide-out Sidebar Panel */}
          <aside className="relative w-[85%] max-w-[300px] bg-white h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
