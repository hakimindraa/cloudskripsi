"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  WorkspaceType,
  Project,
  DraftRevision,
  LiteratureReference,
  GptNote,
  SupervisorLog,
  ReferenceStatus,
} from "@/types";
import {
  initialProjects,
  initialDrafts,
  initialReferences,
  initialGptNotes,
  initialSupervisorLogs,
} from "@/lib/mock-data";

export interface UserProfile {
  fullName: string;
  username: string;
}

interface WorkspaceContextType {
  currentUser: UserProfile | null;
  login: (username: string, password: string) => boolean;
  register: (fullName: string, username: string, password: string, partnerName?: string) => boolean;
  logout: () => void;
  activeWorkspace: WorkspaceType;
  setActiveWorkspace: (ws: WorkspaceType) => void;
  projects: Record<WorkspaceType, Project>;
  currentProject: Project;
  drafts: DraftRevision[];
  references: LiteratureReference[];
  gptNotes: GptNote[];
  supervisorLogs: SupervisorLog[];
  addDraft: (draft: Omit<DraftRevision, "id" | "projectId" | "createdAt">) => void;
  addReference: (ref: Omit<LiteratureReference, "id" | "projectId" | "createdAt">) => void;
  updateReferenceStatus: (id: string, status: ReferenceStatus) => void;
  addGptNote: (note: Omit<GptNote, "id" | "projectId" | "createdAt">) => void;
  addSupervisorLog: (log: Omit<SupervisorLog, "id" | "projectId" | "createdAt">) => void;
  toggleActionItem: (logId: string, itemId: string) => void;
  updateProjectDetails: (updated: Partial<Project>) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeWorkspace, setActiveWorkspaceState] = useState<WorkspaceType>("saya");
  const [projects, setProjects] = useState<Record<WorkspaceType, Project>>(initialProjects);
  const [drafts, setDrafts] = useState<DraftRevision[]>(initialDrafts);
  const [references, setReferences] = useState<LiteratureReference[]>(initialReferences);
  const [gptNotes, setGptNotes] = useState<GptNote[]>(initialGptNotes);
  const [supervisorLogs, setSupervisorLogs] = useState<SupervisorLog[]>(initialSupervisorLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage if present
  useEffect(() => {
    try {
      // Pastikan cache lama dibersihkan agar data contoh tidak muncul lagi
      const isCleaned = localStorage.getItem("cloudskripsi_cleaned_v3");
      if (!isCleaned) {
        localStorage.removeItem("cloudskripsi_projects");
        localStorage.removeItem("cloudskripsi_drafts");
        localStorage.removeItem("cloudskripsi_refs");
        localStorage.removeItem("cloudskripsi_gpt");
        localStorage.removeItem("cloudskripsi_logs");
        localStorage.removeItem("cloudskripsi_user");
        localStorage.setItem("cloudskripsi_cleaned_v3", "true");
        setProjects(initialProjects);
        setDrafts([]);
        setReferences([]);
        setGptNotes([]);
        setSupervisorLogs([]);
        setCurrentUser(null);
        return;
      }

      const savedUser = localStorage.getItem("cloudskripsi_user");
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch {}
      }

      const savedWs = localStorage.getItem("cloudskripsi_workspace");
      if (savedWs === "saya" || savedWs === "pasangan") {
        setActiveWorkspaceState(savedWs);
      }
      const savedProjects = localStorage.getItem("cloudskripsi_projects");
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedDrafts = localStorage.getItem("cloudskripsi_drafts");
      if (savedDrafts) setDrafts(JSON.parse(savedDrafts));

      const savedRefs = localStorage.getItem("cloudskripsi_refs");
      if (savedRefs) setReferences(JSON.parse(savedRefs));

      const savedGpt = localStorage.getItem("cloudskripsi_gpt");
      if (savedGpt) setGptNotes(JSON.parse(savedGpt));

      const savedLogs = localStorage.getItem("cloudskripsi_logs");
      if (savedLogs) setSupervisorLogs(JSON.parse(savedLogs));
    } catch {
      // LocalStorage not available or parse error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync state to localStorage on changes after initial load
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (currentUser) {
        localStorage.setItem("cloudskripsi_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("cloudskripsi_user");
      }
      localStorage.setItem("cloudskripsi_workspace", activeWorkspace);
      localStorage.setItem("cloudskripsi_projects", JSON.stringify(projects));
      localStorage.setItem("cloudskripsi_drafts", JSON.stringify(drafts));
      localStorage.setItem("cloudskripsi_refs", JSON.stringify(references));
      localStorage.setItem("cloudskripsi_gpt", JSON.stringify(gptNotes));
      localStorage.setItem("cloudskripsi_logs", JSON.stringify(supervisorLogs));
    } catch {
      // Ignore quota errors
    }
  }, [currentUser, activeWorkspace, projects, drafts, references, gptNotes, supervisorLogs, isLoaded]);

  const login = (username: string, _password: string): boolean => {
    // Authenticate user
    const userProfile: UserProfile = {
      fullName: username,
      username: username,
    };
    setCurrentUser(userProfile);
    return true;
  };

  const register = (
    fullName: string,
    username: string,
    _password: string,
    partnerName?: string
  ): boolean => {
    const userProfile: UserProfile = {
      fullName,
      username,
    };
    setCurrentUser(userProfile);

    // Set custom names on the projects
    setProjects((prev) => ({
      ...prev,
      saya: {
        ...prev.saya,
        studentName: fullName,
      },
      pasangan: {
        ...prev.pasangan,
        studentName: partnerName?.trim() || "Pasangan",
      },
    }));

    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("cloudskripsi_user");
  };

  const setActiveWorkspace = (ws: WorkspaceType) => {
    setActiveWorkspaceState(ws);
  };

  const currentProject = projects[activeWorkspace];

  // Filter items for current active project
  const currentDrafts = drafts.filter((d) => d.projectId === currentProject.id);
  const currentReferences = references.filter((r) => r.projectId === currentProject.id);
  const currentGptNotes = gptNotes.filter((g) => g.projectId === currentProject.id);
  const currentLogs = supervisorLogs.filter((l) => l.projectId === currentProject.id);

  const addDraft = (draft: Omit<DraftRevision, "id" | "projectId" | "createdAt">) => {
    const newDraft: DraftRevision = {
      ...draft,
      id: "draft-" + Date.now(),
      projectId: currentProject.id,
      createdAt: new Date().toISOString(),
    };
    setDrafts((prev) => [newDraft, ...prev]);
  };

  const addReference = (ref: Omit<LiteratureReference, "id" | "projectId" | "createdAt">) => {
    const newRef: LiteratureReference = {
      ...ref,
      id: "ref-" + Date.now(),
      projectId: currentProject.id,
      createdAt: new Date().toISOString(),
    };
    setReferences((prev) => [newRef, ...prev]);
  };

  const updateReferenceStatus = (id: string, status: ReferenceStatus) => {
    setReferences((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const addGptNote = (note: Omit<GptNote, "id" | "projectId" | "createdAt">) => {
    const newNote: GptNote = {
      ...note,
      id: "gpt-" + Date.now(),
      projectId: currentProject.id,
      createdAt: new Date().toISOString(),
    };
    setGptNotes((prev) => [newNote, ...prev]);
  };

  const addSupervisorLog = (log: Omit<SupervisorLog, "id" | "projectId" | "createdAt">) => {
    const newLog: SupervisorLog = {
      ...log,
      id: "log-" + Date.now(),
      projectId: currentProject.id,
      createdAt: new Date().toISOString(),
    };
    setSupervisorLogs((prev) => [newLog, ...prev]);
  };

  const toggleActionItem = (logId: string, itemId: string) => {
    setSupervisorLogs((prev) =>
      prev.map((log) => {
        if (log.id !== logId) return log;
        return {
          ...log,
          actionItems: log.actionItems.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item
          ),
        };
      })
    );
  };

  const updateProjectDetails = (updated: Partial<Project>) => {
    setProjects((prev) => ({
      ...prev,
      [activeWorkspace]: {
        ...prev[activeWorkspace],
        ...updated,
      },
    }));
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        activeWorkspace,
        setActiveWorkspace,
        projects,
        currentProject,
        drafts: currentDrafts,
        references: currentReferences,
        gptNotes: currentGptNotes,
        supervisorLogs: currentLogs,
        addDraft,
        addReference,
        updateReferenceStatus,
        addGptNote,
        addSupervisorLog,
        toggleActionItem,
        updateProjectDetails,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
