'use client'

import { RepositorySelector } from '@/components/repository-selector';
import { MessageThreadFull } from '@/components/ui/message-thread-full';
import { getIssues } from '@/services/github';
import { useRepositoryStore } from '@/store/repository-store';
export default function Home() {
  const { selectedRepository } = useRepositoryStore();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-4xl">
        <RepositorySelector />
        {selectedRepository && <MessageThreadFull />}
        {selectedRepository && (
          <button onClick={async () => {
            const issues = await getIssues(selectedRepository);
            console.log(issues);
          }}>Get Issues</button>
        )}
      </main>
    </div>
  );
}
