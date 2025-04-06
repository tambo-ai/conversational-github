"use client";

import { Repository, getRepositories } from "@/services/github";
import { useRepositoryStore } from "@/store/repository-store";
import { useEffect, useState } from "react";

export function RepositorySelector() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedRepository, setSelectedRepository } = useRepositoryStore();

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const repos = await getRepositories();
        setRepositories(repos);
      } catch (err) {
        setError("Failed to load repositories");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  if (loading)
    return <div className="text-muted-foreground">Loading repositories...</div>;
  if (error) return <div className="text-destructive">{error}</div>;

  return (
    <div className="w-full">
      <select
        value={selectedRepository?.full_name || ""}
        onChange={(e) => {
          const repo = repositories.find((r) => r.full_name === e.target.value);
          setSelectedRepository(repo || null);
        }}
        className="w-full p-2 rounded-lg border bg-background text-foreground border-border"
      >
        <option value="">Select a repository</option>
        {repositories.map((repo) => (
          <option key={repo.full_name} value={repo.full_name}>
            {repo.full_name}
          </option>
        ))}
      </select>
    </div>
  );
}
