import { Project, DraftRevision, LiteratureReference, GptNote, SupervisorLog } from "@/types";

export const initialProjects: Record<"saya" | "pasangan", Project> = {
  saya: {
    id: "proj-saya",
    workspace: "saya",
    studentName: "Saya",
    title: "Belum Ada Judul Skripsi (Atur di Pengaturan)",
    fieldOfStudy: "Program Studi",
    supervisor1: "Dosen Pembimbing 1",
    supervisor2: "Dosen Pembimbing 2",
    targetDefenseDate: "2026-12-31",
    currentMilestone: "Pengajuan Judul",
    progressPercent: 0,
  },
  pasangan: {
    id: "proj-pasangan",
    workspace: "pasangan",
    studentName: "Pasangan",
    title: "Belum Ada Judul Skripsi Pasangan (Atur di Pengaturan)",
    fieldOfStudy: "Program Studi",
    supervisor1: "Dosen Pembimbing 1",
    supervisor2: "Dosen Pembimbing 2",
    targetDefenseDate: "2026-12-31",
    currentMilestone: "Pengajuan Judul",
    progressPercent: 0,
  },
};

// Data Kosong Bersih (Clean Slate)
export const initialDrafts: DraftRevision[] = [];
export const initialReferences: LiteratureReference[] = [];
export const initialGptNotes: GptNote[] = [];
export const initialSupervisorLogs: SupervisorLog[] = [];
