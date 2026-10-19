"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/workspace-context";
import { BabCategory } from "@/types";
import { X, UploadCloud, FileText, CheckCircle2 } from "lucide-react";

interface UploadDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBab?: BabCategory;
}

export function UploadDraftModal({ isOpen, onClose, defaultBab = "BAB 3" }: UploadDraftModalProps) {
  const { addDraft, currentProject } = useWorkspace();
  const [babCategory, setBabCategory] = useState<BabCategory>(defaultBab);
  const [versionLabel, setVersionLabel] = useState("v2.2");
  const [fileName, setFileName] = useState("Draft_Revisi_Terkini.docx");
  const [fileSizeKb, setFileSizeKb] = useState(2500);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNotes.trim()) {
      alert("Harap masukkan catatan progres revisi!");
      return;
    }

    addDraft({
      babCategory,
      versionLabel,
      fileName,
      fileSizeKb,
      fileUrl: "#",
      revisionNotes,
      isApproved: false,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSizeKb(Math.round(file.size / 1024));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-semibold text-slate-900 text-base">
              Upload Update Progres File
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
            <h4 className="text-base font-semibold text-slate-900">Versi Berkas Berhasil Disimpan!</h4>
            <p className="text-xs text-slate-500 mt-1">
              File {fileName} ({versionLabel}) tersimpan rapi di vault skripsi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* File Dropzone Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pilih Berkas Dokumen (Word / PDF)
              </label>
              <label className="border-2 border-dashed border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition">
                <UploadCloud className="w-8 h-8 text-slate-500 mb-2" />
                <span className="text-xs font-semibold text-slate-700">
                  {fileName ? fileName : "Klik untuk telusuri file dari laptop"}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  Mendukung .docx, .pdf, .zip (Max. 50 MB)
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".docx,.pdf,.doc,.zip,.xlsx"
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Bab Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Bab
                </label>
                <select
                  value={babCategory}
                  onChange={(e) => setBabCategory(e.target.value as BabCategory)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                >
                  <option value="BAB 1">BAB 1 - Pendahuluan</option>
                  <option value="BAB 2">BAB 2 - Kajian Pustaka</option>
                  <option value="BAB 3">BAB 3 - Metodologi</option>
                  <option value="BAB 4">BAB 4 - Hasil & Pembahasan</option>
                  <option value="BAB 5">BAB 5 - Penutup</option>
                  <option value="FULL">FULL SKRIPSI (Semua Bab)</option>
                  <option value="LAMPIRAN">Lampiran & Dataset</option>
                </select>
              </div>

              {/* Version Label */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Label Versi
                </label>
                <input
                  type="text"
                  value={versionLabel}
                  onChange={(e) => setVersionLabel(e.target.value)}
                  placeholder="Contoh: v2.2 / v1.3"
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
            </div>

            {/* Revision Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Perubahan / Update Progres
              </label>
              <textarea
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="Tuliskan poin apa saja yang direvisi, masukan dosen pembimbing yang sudah diakomodasi, atau progres terbaru..."
                rows={3}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            {/* Actions */}
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
                Simpan Versi Baru
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
