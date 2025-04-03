import { Repository } from '@/services/github';
import { create } from 'zustand';

interface RepositoryStore {
  selectedRepository: Repository | null;
  setSelectedRepository: (repository: Repository | null) => void;
}

export const useRepositoryStore = create<RepositoryStore>((set) => ({
  selectedRepository: null,
  setSelectedRepository: (repository) => set({ selectedRepository: repository }),
})); 