"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/workspace-context";
import { GptNote } from "@/types";
import {
  Sparkles,
  Plus,
  Copy,
  Check,
  Tag,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Bot,
  UserCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AddGptModal } from "@/components/modals/add-gpt-modal";

export default function GptVaultPage() {
  const { gptNotes, currentProject, searchQuery } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNotes = gptNotes.filter((note) => {
    return (
      searchQuery === "" ||
      note.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.synthesizedNote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (note.prompt && note.prompt.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
              {currentProject.studentName}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Bank Prompt & Parafrase AI
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            Arsip Referensi & Catatan Teori GPT
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Simpan ide, prompt, dan hasil parafrase dari ChatGPT/Claude/Gemini agar teori yang Anda temukan tidak hilang dan siap dikutip ke naskah skripsi.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Catatan GPT</span>
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Sparkles className="w-10 h-10 text-purple-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-900">
              Belum Ada Catatan GPT yang Disimpan
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Pernah menanyakan konsep teori atau algoritma ke AI? Arsipkan prompt dan hasil parafrasenya di sini.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Catat Sekarang
            </button>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isExpanded = expandedId === note.id;

            return (
              <div
                key={note.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-slate-300 transition"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {note.topic}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {note.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-100"
                        >
                          #{t}
                        </span>
                      ))}
                      <span className="text-[11px] text-slate-500">
                        • Tersimpan {formatDate(note.createdAt)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(note.synthesizedNote, note.id)}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-purple-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                  >
                    {copiedId === note.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Tersalin ke Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-purple-600" />
                        <span>Salin Kalimat Naskah</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Primary Box: Synthesized Note (Parafrase Siap Pakai) */}
                <div className="bg-purple-50/40 p-4 rounded-lg border border-purple-200/80">
                  <div className="flex items-center gap-1.5 text-purple-900 font-bold text-[11px] uppercase tracking-wider mb-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-purple-700" />
                    <span>Kalimat Siap Pakai di Skripsi (Parafrase Mandiri):</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-normal">
                    {note.synthesizedNote}
                  </p>
                </div>

                {/* Accordion Toggle for Prompt & Raw AI output */}
                {(note.prompt || note.aiOutput) && (
                  <div>
                    <button
                      onClick={() => toggleExpand(note.id)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer pt-1"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Sembunyikan Prompt & Jawaban Asli GPT</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Lihat Prompt & Jawaban Asli GPT</span>
                        </>
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-2.5 pt-3 border-t border-slate-100">
                        {note.prompt && (
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                            <div className="flex items-center gap-1 text-slate-600 font-bold text-[10px] uppercase tracking-wider mb-1">
                              <MessageSquare className="w-3 h-3 text-slate-500" /> Prompt yang Diketik:
                            </div>
                            <div className="text-slate-800 font-mono text-[11px]">
                              {note.prompt}
                            </div>
                          </div>
                        )}

                        {note.aiOutput && (
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                            <div className="flex items-center gap-1 text-slate-600 font-bold text-[10px] uppercase tracking-wider mb-1">
                              <Bot className="w-3 h-3 text-slate-500" /> Jawaban Asli AI:
                            </div>
                            <div className="text-slate-700 text-xs whitespace-pre-wrap max-h-48 overflow-y-auto">
                              {note.aiOutput}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <AddGptModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
