import { useRepositoryStore } from '@/store/repository-store';
import React, { useEffect, useState } from 'react';
import { Issue, closeIssue, createIssue, getIssues } from '../services/github';
import { CreateIssueForm } from './create-issue-form';
import { IssueItem } from './issue-item';

export const GitHubIssues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      const fetchedIssues = await getIssues();
      setIssues(fetchedIssues);
    } catch (err) {
      setError('Failed to load issues');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIssue = async (title: string, body: string) => {
    if (!selectedRepository) return;

    try {
      const newIssue = await createIssue(
        selectedRepository,
        title,
        body
      );
      setIssues([newIssue, ...issues]);
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

      <div className="space-y-4">
        {issues.map((issue) => (
          <IssueItem
            key={issue.number}
            issue={issue}
            onCloseIssue={handleCloseIssue}
          />
        ))}
      </div>
      <CreateIssueForm onSubmit={handleCreateIssue} />
    </div>
  );
}; 