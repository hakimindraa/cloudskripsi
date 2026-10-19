"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/workspace-context";
import { BabCategory, ReferenceStatus } from "@/types";
import { X, Sparkles, CheckCircle2 } from "lucide-react";

interface AddReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddReferenceModal({ isOpen, onClose }: AddReferenceModalProps) {
  const { addReference, currentProject } = useWorkspace();
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [publicationYear, setPublicationYear] = useState<number>(2026);
  const [sourceUrl, setSourceUrl] = useState("");
  const [targetBab, setTargetBab] = useState<BabCategory>("BAB 2");
  const [status, setStatus] = useState<ReferenceStatus>("to_read");
  const [tagInput, setTagInput] = useState("");
  const [abstract, setAbstract] = useState("");
  const [apaCitation, setApaCitation] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const generateCitation = () => {
    if (!title || !authors) {
      alert("Masukkan Judul dan Penulis terlebih dahulu untuk membuat sitasi otomatis!");
      return;
    }
    const formatted = `${authors} (${publicationYear}). ${title}. ${sourceUrl ? "Retrieved from " + sourceUrl : ""}`;
    setApaCitation(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authors.trim()) {
      alert("Harap lengkapi judul dan penulis jurnal!");
      return;
    }

    const citationToUse = apaCitation.trim() || `${authors} (${publicationYear}). ${title}.`;
    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addReference({
      title,
      authors,
      publicationYear,
      sourceUrl,
      targetBab,
      status,
      tags: tags.length ? tags : ["Referensi"],
      abstract,
      apaCitation: citationToUse,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-semibold text-slate-900 text-base">
              Tambah Paper / Tautan Jurnal
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ruang Kerja: <strong className="text-slate-800 font-semibold">{currentProject.studentName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce mb-2" />
            <h4 className="text-base font-semibold text-slate-900">Paper Berhasil Ditambahkan!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Jurnal telah masuk ke katalog dan siap disitasi untuk {targetBab}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 overflow-y-auto flex-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Paper / Artikel Ilmiah
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: A Survey of Deep Learning for Sentiment Analysis"
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Penulis (Authors)
                </label>
                <input
                  type="text"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  placeholder="Contoh: Zhang, L., Wang, S., & Liu, B."
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tahun Terbit
                </label>
                <input
                  type="number"
                  value={publicationYear}
                  onChange={(e) => setPublicationYear(parseInt(e.target.value) || 2024)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tautan Sumber (URL DOI / ArXiv / IEEE / Google Scholar)
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://doi.org/... atau https://arxiv.org/abs/..."
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rujukan untuk Bab
                </label>
                <select
                  value={targetBab}
                  onChange={(e) => setTargetBab(e.target.value as BabCategory)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                >
                  <option value="BAB 1">BAB 1 - Latar Belakang</option>
                  <option value="BAB 2">BAB 2 - Kajian Pustaka / Teori</option>
                  <option value="BAB 3">BAB 3 - Metodologi Penelitian</option>
                  <option value="BAB 4">BAB 4 - Hasil & Pembahasan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Membaca
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ReferenceStatus)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                >
                  <option value="to_read">Belum Dibaca</option>
                  <option value="reading">Sedang Dibaca</option>
                  <option value="cited">Sudah Disitasi di Naskah</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Format Sitasi APA 7th (Otomatis)
                </label>
                <button
                  type="button"
                  onClick={generateCitation}
                  className="text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  Generate Sitasi
                </button>
              </div>
              <textarea
                value={apaCitation}
                onChange={(e) => setApaCitation(e.target.value)}
                placeholder="Klik 'Generate Sitasi' atau tulis format rujukan manual di sini..."
                rows={2}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tag / Topik Kata Kunci (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="NLP, Transformer, Deep Learning"
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-xs"
              >
                Simpan Paper
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
