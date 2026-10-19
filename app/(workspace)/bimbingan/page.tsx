"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/workspace-context";
import {
  ClipboardList,
  Plus,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Video,
  Mail,
  Check,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AddLogModal } from "@/components/modals/add-log-modal";

export default function BimbinganPage() {
  const { supervisorLogs, toggleActionItem, currentProject, searchQuery } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredLogs = supervisorLogs.filter((log) => {
    return (
      searchQuery === "" ||
      log.supervisorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.feedbackNotes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionItems.some((item) => item.task.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const totalTasks = supervisorLogs.flatMap((l) => l.actionItems).length;
  const completedTasks = supervisorLogs.flatMap((l) => l.actionItems).filter((i) => i.done).length;
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

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
              Buku Kendali Bimbingan
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Logbook Konsultasi Dosen & Checklist Revisi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Catat hasil arahan dosen pembimbing, batas waktu revisi, dan centang setiap pekerjaan yang telah Anda perbaiki.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Bimbingan Baru</span>
        </button>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Sesi Bimbingan
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {supervisorLogs.length} <span className="text-xs font-normal text-slate-500">Pertemuan</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Dengan Dospem 1 & Dospem 2
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Revisi Dosen Diselesaikan
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {completedTasks} / {totalTasks} <span className="text-xs font-normal text-slate-500">Poin</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            {totalTasks - completedTasks} tugas revisi tersisa
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Penyelesaian Revisi
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {taskPercent}%
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${taskPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-900">
              Belum Ada Catatan Konsultasi
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Setiap kali selesai bimbingan dengan dosen pembimbing, masukkan notulensinya di sini agar poin revisi tidak terlupakan.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Catat Bimbingan Sekarang
            </button>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const completedCount = log.actionItems.filter((i) => i.done).length;

            return (
              <div
                key={log.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-900">
                        {log.supervisorName}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium flex items-center gap-1">
                        {log.meetingMethod === "Tatap Muka" && <User className="w-3 h-3" />}
                        {log.meetingMethod === "Zoom" && <Video className="w-3 h-3" />}
                        {log.meetingMethod === "Email / Chat" && <Mail className="w-3 h-3" />}
                        {log.meetingMethod}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Pertemuan tanggal: {formatDate(log.consultationDate)}</span>
                    </div>
                  </div>

                  <div>
                    {log.status === "approved" ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Disetujui / Acc
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        Perlu Revisi
                      </span>
                    )}
                  </div>
                </div>

                {/* Feedback Notes */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Masukan & Evaluasi Dosen:
                  </h4>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                    {log.feedbackNotes}
                  </p>
                </div>

                {/* Action Items / Revision Checklist */}
                {log.actionItems.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Pekerjaan Revisi yang Harus Diselesaikan ({completedCount}/{log.actionItems.length}):
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Klik centang jika sudah selesai
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {log.actionItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleActionItem(log.id, item.id)}
                          className={`p-2.5 rounded-lg border text-xs flex items-center gap-2.5 cursor-pointer transition ${
                            item.done
                              ? "bg-slate-50 border-slate-200 text-slate-400 line-through"
                              : "bg-white border-slate-200 hover:border-slate-400 text-slate-800"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={item.done}
                            onChange={() => {}} // Handled by onClick
                            className="rounded text-slate-900 focus:ring-0 cursor-pointer"
                          />
                          <span className="flex-1 font-medium">{item.task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <AddLogModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
