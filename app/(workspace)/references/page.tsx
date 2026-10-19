"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/workspace-context";
import { LiteratureReference, ReferenceStatus, BabCategory } from "@/types";
import {
  BookmarkCheck,
  Plus,
  ExternalLink,
  Copy,
  Check,
  Search,
  Filter,
  BookOpen,
  Tag,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AddReferenceModal } from "@/components/modals/add-reference-modal";

export default function ReferencesPage() {
  const { references, updateReferenceStatus, currentProject, searchQuery } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ReferenceStatus | "ALL">("ALL");
  const [selectedBab, setSelectedBab] = useState<BabCategory | "ALL">("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredReferences = references.filter((ref) => {
    const matchStatus = selectedStatus === "ALL" || ref.status === selectedStatus;
    const matchBab = selectedBab === "ALL" || ref.targetBab === selectedBab;
    const matchQuery =
      searchQuery === "" ||
      ref.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ref.abstract && ref.abstract.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchStatus && matchBab && matchQuery;
  });

  const handleCopyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
              Katalog Literatur
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Koleksi Paper Jurnal & URL Referensi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Simpan artikel ilmiah, DOI, paper arXiv/IEEE, dan salin format sitasi (APA 7th) langsung ke dokumen Word skripsi Anda.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Paper / URL</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 mr-1">Status:</span>
          {(["ALL", "to_read", "reading", "cited"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                selectedStatus === st
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600"
              }`}
            >
              {st === "ALL" && "Semua"}
              {st === "to_read" && "Belum Dibaca"}
              {st === "reading" && "Sedang Dibaca"}
              {st === "cited" && "🟢 Sudah Disitasi"}
            </button>
          ))}
        </div>

        {/* Bab Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Rujukan:</span>
          <select
            value={selectedBab}
            onChange={(e) => setSelectedBab(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 focus:outline-hidden"
          >
            <option value="ALL">Semua Bab</option>
            <option value="BAB 1">BAB 1</option>
            <option value="BAB 2">BAB 2</option>
            <option value="BAB 3">BAB 3</option>
            <option value="BAB 4">BAB 4</option>
          </select>
        </div>
      </div>

      {/* References Grid / Cards */}
      <div className="space-y-4">
        {filteredReferences.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <BookmarkCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-900">
              Tidak Ada Paper yang Cocok
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Tambahkan tautan jurnal atau ubah filter pencarian di atas.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Tambah Paper Sekarang
            </button>
          </div>
        ) : (
          filteredReferences.map((ref) => (
            <div
              key={ref.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                      {ref.targetBab}
                    </span>

                    {/* Status Pill with Quick Switch */}
                    <select
                      value={ref.status}
                      onChange={(e) =>
                        updateReferenceStatus(ref.id, e.target.value as ReferenceStatus)
                      }
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border cursor-pointer focus:outline-hidden ${
                        ref.status === "cited"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : ref.status === "reading"
                          ? "bg-sky-50 text-sky-800 border-sky-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      <option value="to_read">Belum Dibaca</option>
                      <option value="reading">Sedang Dibaca</option>
                      <option value="cited">🟢 Sudah Disitasi</option>
                    </select>

                    <span className="text-xs text-slate-500">
                      Tahun {ref.publicationYear}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {ref.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1">
                    <strong className="text-slate-700 font-medium">Penulis: </strong>
                    {ref.authors}
                  </p>
                </div>

                {/* External Link */}
                {ref.sourceUrl && (
                  <a
                    href={ref.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                    <span>Buka Jurnal</span>
                  </a>
                )}
              </div>

              {/* Abstract snippet if present */}
              {ref.abstract && (
                <p className="text-xs text-slate-500 bg-slate-50/70 p-3 rounded-lg border border-slate-100 line-clamp-3 italic">
                  &ldquo;{ref.abstract}&rdquo;
                </p>
              )}

              {/* APA Citation Box */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5 tracking-wider">
                    Format Sitasi APA 7th
                  </span>
                  <div className="text-xs text-slate-800 font-mono select-all truncate" title={ref.apaCitation}>
                    {ref.apaCitation}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCitation(ref.apaCitation, ref.id)}
                  className="shrink-0 px-3 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                >
                  {copiedId === ref.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Salin Sitasi</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tags & Metadata */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Tag className="w-3 h-3 text-slate-500" />
                  {ref.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <span>Tersimpan {formatDate(ref.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <AddReferenceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
