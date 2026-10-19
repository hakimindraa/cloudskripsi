export type WorkspaceType = "saya" | "pasangan";

export interface Project {
  id: string;
  workspace: WorkspaceType;
  studentName: string;
  title: string;
  fieldOfStudy: string;
  supervisor1: string;
  supervisor2: string;
  targetDefenseDate: string;
  currentMilestone: string;
  progressPercent: number;
}

export type BabCategory = "BAB 1" | "BAB 2" | "BAB 3" | "BAB 4" | "BAB 5" | "FULL" | "LAMPIRAN";

export interface DraftRevision {
  id: string;
  projectId: string;
  babCategory: BabCategory;
  versionLabel: string;
  fileName: string;
  fileSizeKb: number;
  fileUrl: string;
  revisionNotes: string;
  createdAt: string;
  isApproved?: boolean;
}

export type ReferenceStatus = "to_read" | "reading" | "cited";

export interface LiteratureReference {
  id: string;
  projectId: string;
  title: string;
  authors: string;
  publicationYear: number;
  sourceUrl?: string;
  pdfUrl?: string;
  abstract?: string;
  targetBab: BabCategory;
  status: ReferenceStatus;
  apaCitation: string;
  tags: string[];
  createdAt: string;
}

export interface GptNote {
  id: string;
  projectId: string;
  topic: string;
  prompt?: string;
  aiOutput?: string;
  synthesizedNote: string;
  tags: string[];
  createdAt: string;
}

export interface ActionItem {
  id: string;
  task: string;
  done: boolean;
}

export interface SupervisorLog {
  id: string;
  projectId: string;
  consultationDate: string;
  supervisorName: string;
  meetingMethod: "Tatap Muka" | "Email / Chat" | "Zoom";
  feedbackNotes: string;
  actionItems: ActionItem[];
  status: "needs_revision" | "approved";
  createdAt: string;
}
