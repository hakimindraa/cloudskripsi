"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { BottomNav } from "@/components/bottom-nav";
import { UploadDraftModal } from "@/components/modals/upload-draft-modal";
import { useWorkspace } from "@/context/workspace-context";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentUser } = useWorkspace();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("cloudskripsi_user");
      if (!savedUser && !currentUser) {
        router.push("/register");
      }
    }
  }, [currentUser, router]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar + Mobile Drawer */}
      <Sidebar
        mobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onOpenUploadModal={() => setIsUploadOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Thumb-friendly 1-hand usage) */}
      <BottomNav onOpenMenu={() => setIsMobileMenuOpen(true)} />

      {/* Global Upload Draft Modal */}
      <UploadDraftModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}
