import { Repository } from "@/services/github";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RepositoryStore {
  selectedRepository: Repository | null;
  setSelectedRepository: (repository: Repository | null) => void;
}

export const useRepositoryStore = create<RepositoryStore>()(
  persist(
    (set) => ({
      selectedRepository: null,
      setSelectedRepository: (repository) =>
        set({ selectedRepository: repository }),
    }),
    {
      name: "repository-store",
    },
  ),
);
