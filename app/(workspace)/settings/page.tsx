"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/workspace-context";
import { Settings, Save, CheckCircle2, Database, ShieldCheck, User } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function SettingsPage() {
  const { currentProject, updateProjectDetails } = useWorkspace();

  const [studentName, setStudentName] = useState(currentProject.studentName);
  const [title, setTitle] = useState(currentProject.title);
  const [fieldOfStudy, setFieldOfStudy] = useState(currentProject.fieldOfStudy);
  const [supervisor1, setSupervisor1] = useState(currentProject.supervisor1);
  const [supervisor2, setSupervisor2] = useState(currentProject.supervisor2);
  const [targetDefenseDate, setTargetDefenseDate] = useState(currentProject.targetDefenseDate);
  const [currentMilestone, setCurrentMilestone] = useState(currentProject.currentMilestone);
  const [progressPercent, setProgressPercent] = useState(currentProject.progressPercent);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectDetails({
      studentName,
      title,
      fieldOfStudy,
      supervisor1,
      supervisor2,
      targetDefenseDate,
      currentMilestone,
      progressPercent,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const isConfigured = isSupabaseConfigured();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {currentProject.workspace === "saya" ? "Ruang Kerja Saya" : "Ruang Kerja Pasangan"}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Konfigurasi Workspace
          </span>
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900">
          Pengaturan Informasi Skripsi & Dosen
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Ubah judul skripsi, nama dosen pembimbing, dan target tanggal sidang untuk ruang kerja yang sedang aktif.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">
            Data Naskah Skripsi ({currentProject.studentName})
          </h3>
          {isSaved && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Perubahan Berhasil Disimpan!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Mahasiswa (Pemilik Ruang Kerja)
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Program Studi / Bidang Minat
            </label>
            <input
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Judul Skripsi Lengkap
          </label>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={2}
            className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dosen Pembimbing 1
            </label>
            <input
              type="text"
              value={supervisor1}
              onChange={(e) => setSupervisor1(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dosen Pembimbing 2
            </label>
            <input
              type="text"
              value={supervisor2}
              onChange={(e) => setSupervisor2(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Tanggal Sidang / Kelulusan
            </label>
            <input
              type="date"
              value={targetDefenseDate}
              onChange={(e) => setTargetDefenseDate(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tahapan Skripsi Saat Ini
            </label>
            <select
              value={currentMilestone}
              onChange={(e) => setCurrentMilestone(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              <option value="Pengajuan Judul">Pengajuan Judul</option>
              <option value="BAB 1 - Pendahuluan">BAB 1 - Pendahuluan</option>
              <option value="BAB 2 - Kajian Pustaka">BAB 2 - Kajian Pustaka</option>
              <option value="BAB 3 - Metodologi Penelitian">BAB 3 - Metodologi Penelitian</option>
              <option value="Seminar Proposal (Sempro)">Seminar Proposal (Sempro)</option>
              <option value="BAB 4 - Hasil Penelitian">BAB 4 - Hasil Penelitian</option>
              <option value="BAB 5 - Pembahasan & Penutup">BAB 5 - Pembahasan & Penutup</option>
              <option value="Seminar Hasil (Semhas)">Seminar Hasil (Semhas)</option>
              <option value="Sidang Skripsi">Sidang Skripsi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Persentase Progres ({progressPercent}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercent}
              onChange={(e) => setProgressPercent(parseInt(e.target.value) || 0)}
              className="w-full mt-2 accent-slate-900"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Informasi Skripsi</span>
          </button>
        </div>
      </form>

      {/* Cloud & Supabase Integration Status */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Database className="w-4 h-4 text-slate-700" />
          <h3 className="font-bold text-slate-900 text-sm">
            Status Koneksi Penyimpanan Cloud (Supabase)
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs">
          <div>
            <div className="font-semibold text-slate-900">
              {isConfigured ? "🟢 Terhubung ke Supabase Cloud" : "🟡 Mode Penyimpanan Browser Lokal (Offline / Standby)"}
            </div>
            <div className="text-slate-500 mt-0.5 text-[11px]">
              {isConfigured
                ? "Semua berkas dan catatan tersinkronisasi otomatis dengan server Supabase."
                : "Semua perubahan saat ini tersimpan aman di peramban (LocalStorage). Masukkan URL & Anon Key Supabase di file .env.local untuk live sync."}
            </div>
          </div>
          <span className="self-start sm:self-center text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-slate-200 text-slate-700 shrink-0">
            {isConfigured ? "Live Sync" : "Local Persist"}
          </span>
        </div>
      </div>
    </div>
  );
}
