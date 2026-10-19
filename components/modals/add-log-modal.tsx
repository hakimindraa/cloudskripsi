"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/workspace-context";
import { X, CheckCircle2, Plus, Trash2 } from "lucide-react";

interface AddLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddLogModal({ isOpen, onClose }: AddLogModalProps) {
  const { addSupervisorLog, currentProject } = useWorkspace();
  const [consultationDate, setConsultationDate] = useState("2026-10-19");
  const [supervisorName, setSupervisorName] = useState(currentProject.supervisor1);
  const [meetingMethod, setMeetingMethod] = useState<"Tatap Muka" | "Email / Chat" | "Zoom">("Tatap Muka");
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [taskInputs, setTaskInputs] = useState<string[]>([""]);
  const [status, setStatus] = useState<"needs_revision" | "approved">("needs_revision");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddTaskField = () => {
    setTaskInputs([...taskInputs, ""]);
  };

  const handleTaskChange = (index: number, val: string) => {
    const updated = [...taskInputs];
    updated[index] = val;
    setTaskInputs(updated);
  };

  const handleRemoveTask = (index: number) => {
    setTaskInputs(taskInputs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackNotes.trim()) {
      alert("Harap masukkan catatan hasil bimbingan dosen!");
      return;
    }

    const actionItems = taskInputs
      .filter((t) => t.trim().length > 0)
      .map((t, idx) => ({
        id: "act-" + Date.now() + "-" + idx,
        task: t.trim(),
        done: false,
      }));

    addSupervisorLog({
      consultationDate,
      supervisorName,
      meetingMethod,
      feedbackNotes,
      actionItems,
      status,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-semibold text-slate-900 text-base">
              Catat Hasil Konsultasi / Bimbingan
            </h3>
            <p className="text-xs text-slate-500">
              Ruang Kerja: <strong className="text-slate-800 font-semibold">{currentProject.studentName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce mb-2" />
            <h4 className="text-base font-semibold text-slate-900">Catatan Bimbingan Tersimpan!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Daftar to-do revisi siap Anda centang di logbook.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-3.5 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Bimbingan
                </label>
                <input
                  type="date"
                  value={consultationDate}
                  onChange={(e) => setConsultationDate(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Metode Bimbingan
                </label>
                <select
                  value={meetingMethod}
                  onChange={(e) => setMeetingMethod(e.target.value as any)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Tatap Muka">Tatap Muka Langsung</option>
                  <option value="Email / Chat">Email / WhatsApp Chat</option>
                  <option value="Zoom">Daring (Zoom / GMeet)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dosen Pembimbing
              </label>
              <input
                type="text"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
                placeholder="Nama Dosen Pembimbing"
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Masukan / Evaluasi Dosen *
              </label>
              <textarea
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                placeholder="Tuliskan poin koreksi, kritik, atau arahan metodologi yang disampaikan dosen saat konsultasi..."
                rows={3}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Daftar Pekerjaan Revisi (To-Do Items)
                </label>
                <button
                  type="button"
                  onClick={handleAddTaskField}
                  className="text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Tambah Poin
                </button>
              </div>

              <div className="space-y-1.5">
                {taskInputs.map((task, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={task}
                      onChange={(e) => handleTaskChange(idx, e.target.value)}
                      placeholder={`Poin revisi ${idx + 1}...`}
                      className="flex-1 text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                    />
                    {taskInputs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(idx)}
                        className="text-slate-500 hover:text-rose-600 p-1.5 rounded-md hover:bg-slate-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Hasil Konsultasi
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              >
                <option value="needs_revision">Perlu Revisi (Harus diperbaiki dulu)</option>
                <option value="approved">Disetujui / Acc Lanjut ke Bab Berikutnya</option>
              </select>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
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
                Simpan Log Bimbingan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
