'use client';
import { useRepositoryStore } from '@/store/repository-store';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import { closeIssue, Comment, getComments, Issue } from '../services/github';

interface IssueItemProps {
  issue?: Issue;
  onCloseIssue?: (issueNumber: number) => Promise<void>;
}

const MAX_DESCRIPTION_LENGTH = 150;

export const IssueItem: React.FC<IssueItemProps> = ({ issue = {
  number: 0,
  title: '',
  body: '',
  state: '',
  created_at: '',
  updated_at: '',
  html_url: '',
}, onCloseIssue }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const { selectedRepository } = useRepositoryStore();

  const truncatedBody = issue.body && issue.body.length > MAX_DESCRIPTION_LENGTH
    ? issue.body.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
    : issue.body;

  const handleToggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleToggleComments = async () => {
    if (!isCommentsExpanded && selectedRepository) {
      setIsLoadingComments(true);
      try {
        const fetchedComments = await getComments(selectedRepository, issue.number);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        setIsLoadingComments(false);
      }
    }
    setIsCommentsExpanded(!isCommentsExpanded);
  };

  const handleCloseIssue = async (issueNumber: number) => {
    if (!selectedRepository) return;

    try {
      await closeIssue(selectedRepository, issueNumber);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-background text-foreground border-border">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{issue.title}</h3>
        <span className={`px-2 py-1 rounded-md text-sm ${issue.state === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
          {issue.state}
        </span>
      </div>

      <div className="mt-2">
        <p className="text-muted-foreground">
          {isDescriptionExpanded ? issue.body : truncatedBody}
        </p>
        {issue.body && issue.body.length > MAX_DESCRIPTION_LENGTH && (
          <button
            onClick={handleToggleDescription}
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 mt-1"
          >
            {isDescriptionExpanded ? (
              <>
                Show less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show more <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleToggleComments}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comments {issue.comments > 0 && `(${issue.comments})`}</span>
        </button>

        {issue.state === 'open' && (
          <button
            onClick={() => onCloseIssue ? onCloseIssue(issue.number) : handleCloseIssue(issue.number)}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
          >
            Close Issue
          </button>
        )}
      </div>

      {isCommentsExpanded && (
        <div className="mt-4 border-t pt-4">
          {isLoadingComments ? (
            <div className="text-muted-foreground">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-muted-foreground">No comments yet</div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={comment.user.avatar_url}
                      alt={comment.user.login}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-medium">{comment.user.login}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 