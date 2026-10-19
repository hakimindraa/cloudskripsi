"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BookmarkCheck,
  ClipboardList,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/context/workspace-context";

interface BottomNavProps {
  onOpenMenu: () => void;
}

export function BottomNav({ onOpenMenu }: BottomNavProps) {
  const pathname = usePathname();
  const { activeWorkspace, supervisorLogs } = useWorkspace();

  // Count pending revisions
  const pendingRevisions = supervisorLogs
    .flatMap((log) => log.actionItems)
    .filter((i) => !i.done).length;

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/drafts",
      label: "Draft",
      icon: FileText,
    },
    {
      href: "/references",
      label: "Paper",
      icon: BookmarkCheck,
    },
    {
      href: "/bimbingan",
      label: "Bimbingan",
      icon: ClipboardList,
      badge: pendingRevisions > 0 ? pendingRevisions : null,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-lg transition relative text-center min-w-0 select-none",
                isActive
                  ? activeWorkspace === "saya"
                    ? "text-slate-900 font-bold"
                    : "text-pink-600 font-bold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              )}
            >
              <div className="relative">
                <div
                  className={cn(
                    "w-9 h-7 rounded-lg flex items-center justify-center transition-all",
                    isActive &&
                      (activeWorkspace === "saya"
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-pink-600 text-white shadow-xs")
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isActive && "scale-105"
                    )}
                  />
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] mt-0.5 truncate tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Menu button to open mobile drawer */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-lg transition text-slate-500 hover:text-slate-900 font-medium select-none cursor-pointer"
        >
          <div className="w-9 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 transition relative">
            <Menu className="w-4 h-4 text-slate-600" />
            <span
              className={cn(
                "absolute top-1 right-1.5 w-2 h-2 rounded-full",
                activeWorkspace === "saya" ? "bg-slate-900" : "bg-pink-500"
              )}
            />
          </div>
          <span className="text-[10px] mt-0.5 truncate tracking-tight">
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
}
