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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { selectedRepository } = useRepositoryStore();

  useEffect(() => {
    setTitle(initialTitle);
    setBody(initialBody);
  }, [initialTitle, initialBody]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!selectedRepository) return;

      if (onSubmit) {
        await onSubmit(title, body);
      } else {
        await createIssue(
          selectedRepository,
          title,
          body
        );
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-6 text-center rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 ">created!</h2>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setTitle('');
            setBody('');
          }}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer"
        >
          Create Another
        </button>
      </div>
    );
  }

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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 cursor-pointer transition-colors ${isSubmitting ? 'opacity-70' : ''
          }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Issue...
          </span>
        ) : (
          'Create Issue'
        )}
      </button>
    </form>
  );
}; 