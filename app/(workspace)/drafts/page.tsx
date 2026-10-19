"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/workspace-context";
import { BabCategory, DraftRevision } from "@/types";
import {
  FileText,
  Upload,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Plus,
  History,
  HardDrive,
  FileCode,
} from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";
import { UploadDraftModal } from "@/components/modals/upload-draft-modal";

const categories: (BabCategory | "ALL")[] = [
  "ALL",
  "BAB 1",
  "BAB 2",
  "BAB 3",
  "BAB 4",
  "BAB 5",
  "FULL",
  "LAMPIRAN",
];

export default function DraftsPage() {
  const { drafts, currentProject, searchQuery } = useWorkspace();
  const [selectedCategory, setSelectedCategory] = useState<BabCategory | "ALL">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetBabForUpload, setTargetBabForUpload] = useState<BabCategory>("BAB 3");

  // Filter drafts based on category and global search
  const filteredDrafts = drafts.filter((d) => {
    const matchCategory = selectedCategory === "ALL" || d.babCategory === selectedCategory;
    const matchQuery =
      searchQuery === "" ||
      d.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.revisionNotes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.versionLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  // Group by Bab Category
  const groupedDrafts = categories
    .filter((cat) => cat !== "ALL")
    .map((cat) => ({
      category: cat as BabCategory,
      items: filteredDrafts.filter((d) => d.babCategory === cat),
    }))
    .filter((group) => selectedCategory === "ALL" || group.category === selectedCategory);

  const handleOpenUploadForBab = (bab: BabCategory) => {
    setTargetBabForUpload(bab);
    setIsModalOpen(true);
  };

  const handleDownloadSim = (draft: DraftRevision) => {
    alert(`Mengunduh file: ${draft.fileName} (${draft.versionLabel})\nUkuran: ${formatBytes(draft.fileSizeKb * 1024)}\n\nCatatan: Pada tahap live Supabase, file ini langsung terunduh dari bucket storage 'skripsi-vault'.`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {currentProject.studentName}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Vault Berkas Skripsi
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Penyimpanan Berkas & Riwayat Update Progres
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Simpan naskah skripsi Word, PDF, dan dataset dengan nomor versi otomatis (v1, v2) agar draft tidak tertumpuk atau hilang.
          </p>
        </div>

        <button
          onClick={() => {
            setTargetBabForUpload("BAB 3");
            setIsModalOpen(true);
          }}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Update Progres</span>
        </button>
      </div>

      {/* Filter Tabs per Bab */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? "bg-slate-900 text-white shadow-2xs font-semibold"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100/70"
            }`}
          >
            {cat === "ALL" ? "Semua Bab" : cat}
          </button>
        ))}
      </div>

      {/* Drafts List by Group */}
      <div className="space-y-5">
        {groupedDrafts.length === 0 || filteredDrafts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-900">
              Belum Ada Berkas untuk Kategori Ini
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Unggah file dokumen pertama Anda untuk kategori ini dengan mengklik tombol di bawah.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Upload Berkas Sekarang
            </button>
          </div>
        ) : (
          groupedDrafts.map((group) => {
            if (group.items.length === 0) return null;
            return (
              <div
                key={group.category}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
              >
                {/* Category Header Bar */}
                <div className="bg-slate-50/70 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                      {group.category}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 font-semibold">
                      {group.items.length} Versi Tersimpan
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenUploadForBab(group.category)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Upload Update {group.category}
                  </button>
                </div>

                {/* Items in this category */}
                <div className="divide-y divide-slate-100">
                  {group.items.map((draft, idx) => (
                    <div
                      key={draft.id}
                      className="p-5 hover:bg-slate-50/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                          <FileText className="w-5 h-5 text-slate-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-slate-900">
                              {draft.fileName}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-900 text-white">
                              {draft.versionLabel}
                            </span>
                            {idx === 0 && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Versi Terkini
                              </span>
                            )}
                            {draft.isApproved ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Acc Dosen
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Draft Progres
                              </span>
                            )}
                          </div>

                          {/* Revision Notes */}
                          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2 font-normal">
                            <strong className="text-slate-800 font-semibold">Catatan Update: </strong>
                            {draft.revisionNotes}
                          </p>

                          <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
                            <span>Ukuran: {formatBytes(draft.fileSizeKb * 1024)}</span>
                            <span>•</span>
                            <span>Diupdate: {formatDate(draft.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Download Action */}
                      <div className="shrink-0 flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <button
                          onClick={() => handleDownloadSim(draft)}
                          className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-600" />
                          <span>Unduh File</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      <UploadDraftModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultBab={targetBabForUpload}
      />
    </div>
  );
}
