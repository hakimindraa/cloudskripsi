"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/workspace-context";
import { X, CheckCircle2, Sparkles } from "lucide-react";

interface AddGptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddGptModal({ isOpen, onClose }: AddGptModalProps) {
  const { addGptNote, currentProject } = useWorkspace();
  const [topic, setTopic] = useState("");
  const [prompt, setPrompt] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [synthesizedNote, setSynthesizedNote] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !synthesizedNote.trim()) {
      alert("Harap lengkapi topik dan kalimat sintesis / hasil parafrase!");
      return;
    }

    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addGptNote({
      topic,
      prompt,
      aiOutput,
      synthesizedNote,
      tags: tags.length ? tags : ["Teori", "GPT"],
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
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">
                Arsipkan Catatan & Prompt GPT
              </h3>
              <p className="text-xs text-slate-500">
                Ruang Kerja: <strong className="text-slate-800 font-semibold">{currentProject.studentName}</strong>
              </p>
            </div>
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
            <h4 className="text-base font-semibold text-slate-900">Catatan AI Berhasil Disimpan!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Ide dan hasil sintesis teori telah terarsip rapi di vault skripsi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 overflow-y-auto flex-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Topik / Masalah yang Ditanyakan
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Perbedaan AdamW vs SGD Optimizer dalam Deep Learning"
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Prompt yang Digunakan (Opsional)
              </label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Contoh: Jelaskan secara matematis mengapa AdamW lebih stabil..."
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sintesis / Kalimat Siap Pakai (Parafrase Mandiri Bebas Plagiasi) *
              </label>
              <textarea
                value={synthesizedNote}
                onChange={(e) => setSynthesizedNote(e.target.value)}
                placeholder="Tuliskan rangkuman atau kalimat parafrase yang sudah Anda formulasikan sendiri dan siap dimasukkan ke naskah skripsi..."
                rows={4}
                className="w-full text-xs bg-purple-50/30 border border-purple-200/80 rounded-lg p-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-600 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jawaban Mentah dari GPT / AI (Opsional untuk Arsip)
              </label>
              <textarea
                value={aiOutput}
                onChange={(e) => setAiOutput(e.target.value)}
                placeholder="Salin teks jawaban asli dari ChatGPT di sini jika ingin disimpan sebagai cadangan..."
                rows={2}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tag / Kategori (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Bab 2, Teori, Algoritma"
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
                Simpan Catatan AI
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
