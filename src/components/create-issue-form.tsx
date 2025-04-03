import React, { useState } from 'react';

interface CreateIssueFormProps {
  onSubmit: (title: string, body: string) => Promise<void>;
}

export const CreateIssueForm: React.FC<CreateIssueFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(title, body);
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