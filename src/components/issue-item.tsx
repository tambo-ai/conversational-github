"use client";
import { useRepositoryStore } from "@/store/repository-store";
import { ChevronDown, ChevronUp, MessageSquare, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  closeIssue,
  Comment,
  createComment,
  getComments,
  Issue,
} from "../services/github";

interface IssueItemProps {
  issue?: Issue;
  commentsOpen?: boolean;
  onCloseIssue?: (issueNumber: number) => Promise<void>;
  isDescriptionExpandedByDefault?: boolean;
}

const MAX_DESCRIPTION_LENGTH = 150;

export const IssueItem: React.FC<IssueItemProps> = ({
  issue = {
    number: 0,
    title: "",
    body: "",
    state: "",
    created_at: "",
    updated_at: "",
    html_url: "",
    comments: 0,
  },
  onCloseIssue,
  commentsOpen = false,
  isDescriptionExpandedByDefault = true,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(
    isDescriptionExpandedByDefault,
  );
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(commentsOpen);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { selectedRepository } = useRepositoryStore();

  useEffect(() => {
    setIsCommentsExpanded(commentsOpen);
  }, [commentsOpen]);

  useEffect(() => {
    const loadComments = async () => {
      if (commentsOpen && selectedRepository && !isLoadingComments) {
        setIsLoadingComments(true);
        try {
          const fetchedComments = await getComments(
            selectedRepository,
            issue.number,
          );
          setComments(fetchedComments);
        } catch (error) {
          console.error("Failed to load comments:", error);
        } finally {
          setIsLoadingComments(false);
        }
      }
    };
    loadComments();
  }, [commentsOpen, selectedRepository, issue.number, isLoadingComments]);

  const truncatedBody =
    issue.body && issue.body.length > MAX_DESCRIPTION_LENGTH
      ? issue.body.substring(0, MAX_DESCRIPTION_LENGTH) + "..."
      : issue.body;

  const handleToggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleToggleComments = async () => {
    if (!isCommentsExpanded && selectedRepository) {
      setIsLoadingComments(true);
      try {
        const fetchedComments = await getComments(
          selectedRepository,
          issue.number,
        );
        setComments(fetchedComments);
      } catch (error) {
        console.error("Failed to load comments:", error);
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
      issue.state = "closed";
    } catch (err) {
      console.error("Failed to close issue:", err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepository || !newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      await createComment(selectedRepository, issue.number, newComment);
      const updatedComments = await getComments(
        selectedRepository,
        issue.number,
      );
      setComments(updatedComments);
      const updatedIssue = { ...issue, comments: updatedComments.length };
      issue = updatedIssue;
      setNewComment("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-background text-foreground border-border max-w-xl">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-left">{issue.title}</h3>
          <span className="text-sm text-muted-foreground">#{issue.number}</span>
        </div>
        <span
          className={`px-2 py-1 rounded-md text-sm ${issue.state === "open"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
            }`}
        >
          {issue.state}
        </span>
      </div>

      <div className="mt-2">
        <p className="text-muted-foreground text-left">
          {isDescriptionExpanded ? issue.body : truncatedBody}
        </p>
        {issue.body && issue.body.length > MAX_DESCRIPTION_LENGTH && (
          <button
            onClick={handleToggleDescription}
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 mt-1 cursor-pointer"
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
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>
            Comments{" "}
            {issue.comments && issue.comments > 0 && `(${issue.comments})`}
          </span>
        </button>

        {issue.state === "open" && (
          <button
            onClick={() =>
              onCloseIssue
                ? onCloseIssue(issue.number)
                : handleCloseIssue(issue.number)
            }
            className="ml-auto flex items-center gap-1 text-sm text-red-500 hover:text-red-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>close issue</span>
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
                  <p className="text-sm text-left">{comment.body}</p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 rounded-lg border bg-background text-foreground border-border mb-2"
              rows={2}
              required
            />
            <button
              type="submit"
              disabled={isSubmittingComment}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
            >
              {isSubmittingComment ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
