"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWorkspace } from "@/context/workspace-context";
import {
  FileText,
  BookmarkCheck,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Download,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";
import { UploadDraftModal } from "@/components/modals/upload-draft-modal";

export default function DashboardPage() {
  const {
    currentProject,
    drafts,
    references,
    gptNotes,
    supervisorLogs,
    toggleActionItem,
  } = useWorkspace();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Latest draft
  const latestDraft = drafts[0];

  // Action items calculation
  const allActionItems = supervisorLogs.flatMap((log) =>
    log.actionItems.map((item) => ({ ...item, logId: log.id, date: log.consultationDate }))
  );
  const pendingActionItems = allActionItems.filter((i) => !i.done);

  // Citation count
  const citedPapersCount = references.filter((r) => r.status === "cited").length;

  // Milestone Stages
  const milestones = [
    { label: "Pengajuan Judul", done: true },
    { label: "Bab 1 - 3 (Proposal)", done: true },
    { label: "Seminar Proposal", current: true },
    { label: "Bab 4 - 5 (Hasil & Sidang)", done: false },
    { label: "Sidang Skripsi & Yudisium", done: false },
  ];

  const handleCopyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Thesis Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {currentProject.workspace === "saya" ? "Ruang Kerja Saya" : "Ruang Kerja Pasangan"}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                • {currentProject.fieldOfStudy}
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
              {currentProject.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Mahasiswa: <strong className="text-slate-800 font-semibold">{currentProject.studentName}</strong> • Dosen Pembimbing: {currentProject.supervisor1} & {currentProject.supervisor2}
            </p>
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="shrink-0 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Upload Update Draft</span>
          </button>
        </div>

        {/* Milestone Progress Bar */}
        <div className="pt-5">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-700">Tahapan Skripsi: {currentProject.currentMilestone}</span>
            <span className="text-slate-900 font-bold">{currentProject.progressPercent}% Selesai</span>
          </div>

          {/* Progress bar line */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-3">
            <div
              className="bg-slate-900 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentProject.progressPercent}%` }}
            />
          </div>

          {/* Milestone steps pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg border text-xs font-medium transition ${
                  m.done
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                    : m.current
                    ? "bg-amber-50/80 border-amber-300 text-amber-900 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-500"
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  {m.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : m.current ? (
                    <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  ) : (
                    <span className="w-3 h-3 rounded-full border border-slate-300 inline-block" />
                  )}
                  <span>{m.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Draft Terkini */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Draft Terkini</span>
            <FileText className="w-4 h-4 text-slate-700" />
          </div>
          {latestDraft ? (
            <div>
              <div className="text-base font-bold text-slate-900 truncate" title={latestDraft.fileName}>
                {latestDraft.versionLabel} • {latestDraft.babCategory}
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {latestDraft.fileName} ({formatBytes(latestDraft.fileSizeKb * 1024)})
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span>{formatDate(latestDraft.createdAt)}</span>
                <Link href="/drafts" className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5">
                  Semua ({drafts.length}) <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 mt-2">Belum ada file draft yang diunggah.</p>
          )}
        </div>

        {/* Card 2: Paper & Jurnal */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Koleksi Paper</span>
            <BookmarkCheck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {references.length} <span className="text-xs font-normal text-slate-500">Jurnal</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            <strong className="text-emerald-700 font-semibold">{citedPapersCount} Paper</strong> sudah disitasi di naskah
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Katalog Rujukan</span>
            <Link href="/references" className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5">
              Kelola <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 3: Bank Catatan GPT */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Catatan GPT</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {gptNotes.length} <span className="text-xs font-normal text-slate-500">Sintesis Teori</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Prompt & parafrase siap pakai
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Arsip Riset AI</span>
            <Link href="/gpt-vault" className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5">
              Buka Vault <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 4: Revisi Pending Dosen */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">To-Do Revisi</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {pendingActionItems.length} <span className="text-xs font-normal text-slate-500">Pending</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dari {supervisorLogs.length} sesi bimbingan dosen
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Buku Kendali</span>
            <Link href="/bimbingan" className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5">
              Lihat Logbook <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Urgent Revision Tasks */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Checklist Revisi Dosen Pembimbing
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {pendingActionItems.length} belum tuntas
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            Klik centang untuk menandai revisi yang sudah Anda kerjakan di naskah skripsi:
          </p>

          <div className="space-y-2 flex-1">
            {allActionItems.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                Belum ada catatan tugas revisi dari dosen pembimbing.
              </p>
            ) : (
              allActionItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleActionItem(item.logId, item.id)}
                  className={`p-3 rounded-lg border text-xs flex items-start gap-3 cursor-pointer transition ${
                    item.done
                      ? "bg-slate-50 border-slate-200 text-slate-400 line-through"
                      : "bg-white border-slate-200 hover:border-slate-400 text-slate-800 shadow-2xs"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => {}} // Controlled by onClick on parent
                    className="mt-0.5 rounded text-slate-900 focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="font-medium">{item.task}</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">
                      Bimbingan {formatDate(item.date)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 text-right">
            <Link
              href="/bimbingan"
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
            >
              Buka Semua Riwayat Bimbingan & Catatan Dosen <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Recent Papers & Citations Ready */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Rujukan Jurnal Siap Sitasi (APA 7th)
              </h3>
            </div>
            <Link
              href="/references"
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              Koleksi ({references.length}) <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            Salin format sitasi langsung dengan 1-klik untuk ditempel ke Word naskah skripsi:
          </p>

          <div className="space-y-2.5 flex-1">
            {references.slice(0, 3).map((ref) => (
              <div
                key={ref.id}
                className="p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-xs text-slate-900">
                    {ref.title}
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium shrink-0">
                    {ref.targetBab}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 italic">
                  {ref.apaCitation}
                </div>
                <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-500">
                    {ref.authors.split(",")[0]} et al. ({ref.publicationYear})
                  </span>
                  <div className="flex items-center gap-2">
                    {ref.sourceUrl && (
                      <a
                        href={ref.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Buka URL
                      </a>
                    )}
                    <button
                      onClick={() => handleCopyCitation(ref.apaCitation, ref.id)}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 bg-indigo-50/70 hover:bg-indigo-100 px-2 py-0.5 rounded transition cursor-pointer"
                    >
                      {copiedId === ref.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin APA</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <UploadDraftModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
}
