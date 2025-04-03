'use client'

import { GitHubAuth } from '@/components/github-auth';
import { RepositorySelector } from '@/components/repository-selector';
import { CanvasSpace } from '@/components/ui/canvas-space';
import { MessageThreadFull } from '@/components/ui/message-thread-full';
import { useAuthStore } from '@/store/auth-store';
import { useRepositoryStore } from '@/store/repository-store';

export default function Home() {
  const { selectedRepository } = useRepositoryStore();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-row gap-8 w-full max-w-[2000px] mx-auto">
        <div className="flex flex-col gap-4 w-[500px] flex-shrink-0">
          <GitHubAuth />
          {isAuthenticated && <RepositorySelector />}
          {isAuthenticated && selectedRepository && <MessageThreadFull />}
        </div>
        <div className="flex-1">
          <CanvasSpace />
        </div>
      </main>
    </div>
  );
}
