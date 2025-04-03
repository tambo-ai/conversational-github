import { useRepositoryStore } from '@/store/repository-store';
import { GenerationStage, useTamboThread } from '@tambo-ai/react';
import React, { useEffect, useState } from 'react';
import { closeIssue, createIssue, getIssues, Issue, IssueFilters } from '../services/github';
import { CreateIssueForm } from './create-issue-form';
import { IssueItem } from './issue-item';

interface IssuesListProps {
  filters?: IssueFilters;
}

export const IssuesList: React.FC<IssuesListProps> = ({ filters }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { selectedRepository } = useRepositoryStore();
  const { generationStage } = useTamboThread();
  useEffect(() => {
    if (selectedRepository && generationStage === GenerationStage.COMPLETE) {
      loadIssues();
    }
  }, [selectedRepository, filters]);

  const loadIssues = async () => {
    if (!selectedRepository) return;

    try {
      setLoading(true);
      const fetchedIssues = await getIssues(filters);
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
      setShowCreateForm(false);
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
  if (loading) {
    const activeFilters = [];
    if (filters?.state) activeFilters.push(`State: ${filters.state}`);
    if (filters?.title) activeFilters.push(`Title contains: "${filters.title}"`);
    if (filters?.body) activeFilters.push(`Body contains: "${filters.body}"`);
    if (filters?.created_after) activeFilters.push(`Created after: ${filters.created_after}`);
    if (filters?.created_before) activeFilters.push(`Created before: ${filters.created_before}`);
    if (filters?.updated_after) activeFilters.push(`Updated after: ${filters.updated_after}`);
    if (filters?.updated_before) activeFilters.push(`Updated before: ${filters.updated_before}`);
    if (filters?.comments !== undefined) activeFilters.push(`Comments: ${filters.comments}`);

    return (
      <div className="space-y-2">
        <div>Loading issues...</div>
        {activeFilters.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <div>Applying filters:</div>
            <ul className="list-disc pl-5 mt-1">
              {activeFilters.map((filter, index) => (
                <li key={index}>{filter}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
        >
          {showCreateForm ? '× Cancel' : '+ Add Issue'}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-4">
          <CreateIssueForm onSubmit={handleCreateIssue} />
        </div>
      )}

      <div className="space-y-4">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <IssueItem
              key={issue.number}
              issue={issue}
              onCloseIssue={handleCloseIssue}
            />
          ))
        ) : (
          <div className="text-center p-6 rounded-lg bg-muted/20">
            <p className="text-lg font-medium">No issues found</p>
            {filters && Object.keys(filters).length > 0 && (
              <div className="mt-2 text-sm text-muted-foreground">
                <p>using filters:</p>
                <ul className="list-disc pl-5 mt-1 inline-block text-left">
                  {Object.entries(filters).map(([key, value]) => (
                    <li key={key}>
                      {key.replace(/_/g, ' ')}: {typeof value === 'string' ? `"${value}"` : value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 