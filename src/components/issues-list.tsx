import { useRepositoryStore } from '@/store/repository-store';
import React, { useEffect, useState } from 'react';
import { Issue, closeIssue, createIssue, getIssues } from '../services/github';
import { IssueItem } from './issue-item';

export const GitHubIssues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueBody, setNewIssueBody] = useState('');
  const { selectedRepository } = useRepositoryStore();

  useEffect(() => {
    if (selectedRepository) {
      loadIssues();
    }
  }, [selectedRepository]);

  const loadIssues = async () => {
    if (!selectedRepository) return;

    try {
      setLoading(true);
      const fetchedIssues = await getIssues(selectedRepository);
      setIssues(fetchedIssues);
    } catch (err) {
      setError('Failed to load issues');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepository) return;

    try {
      const newIssue = await createIssue(
        selectedRepository,
        newIssueTitle,
        newIssueBody
      );
      setIssues([newIssue, ...issues]);
      setNewIssueTitle('');
      setNewIssueBody('');
    } catch (err) {
      setError('Failed to create issue');
      console.error(err);
    }
  };

  const handleCloseIssue = async (issueNumber: number) => {
    if (!selectedRepository) return;

    try {
      await closeIssue(selectedRepository, issueNumber);
      setIssues(issues.map(issue =>
        issue.number === issueNumber
          ? { ...issue, state: 'closed' }
          : issue
      ));
    } catch (err) {
      setError('Failed to close issue');
      console.error(err);
    }
  };

  if (!selectedRepository) return null;
  if (loading) return <div>Loading issues...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <form onSubmit={handleCreateIssue} className="space-y-4">
        <div>
          <input
            type="text"
            value={newIssueTitle}
            onChange={(e) => setNewIssueTitle(e.target.value)}
            placeholder="Issue title"
            className="w-full p-2 rounded-lg border bg-background text-foreground border-border"
            required
          />
        </div>
        <div>
          <textarea
            value={newIssueBody}
            onChange={(e) => setNewIssueBody(e.target.value)}
            placeholder="Issue description"
            className="w-full p-2 rounded-lg border bg-background text-foreground border-border"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Create Issue
        </button>
      </form>

      <div className="space-y-4">
        {issues.map((issue) => (
          <IssueItem
            key={issue.number}
            issue={issue}
            onCloseIssue={handleCloseIssue}
          />
        ))}
      </div>
    </div>
  );
}; 