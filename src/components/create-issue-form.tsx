'use client';
import { createIssue } from '@/services/github';
import { useRepositoryStore } from '@/store/repository-store';
import React, { useEffect, useState } from 'react';

interface CreateIssueFormProps {
  onSubmit?: (title: string, body: string) => Promise<void>;
  initialTitle?: string;
  initialBody?: string;
}

export const CreateIssueForm: React.FC<CreateIssueFormProps> = ({ onSubmit, initialTitle = '', initialBody = '' }) => {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const { selectedRepository } = useRepositoryStore();

  useEffect(() => {
    setTitle(initialTitle);
    setBody(initialBody);
  }, [initialTitle, initialBody]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      return await onSubmit(title, body);
    }

    try {
      if (!selectedRepository) return;

      const newIssue = await createIssue(
        selectedRepository,
        title,
        body
      );
    } catch (err) {
      console.error(err);
    }
    setTitle('');
    setBody('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Create Issue</h2>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Issue title"
          className="w-full p-2 rounded-lg border bg-background text-foreground border-border"
          required
        />
      </div>
      <div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
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
  );
}; 