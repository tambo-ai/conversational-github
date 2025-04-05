"use client";

import { useTamboThread } from "@tambo-ai/react";
import { IssuesList } from "../issues-list";

interface CanvasSpaceProps {
  className?: string;
}

export function CanvasSpace({ className }: CanvasSpaceProps) {
  const { thread } = useTamboThread();

  return (
    <div className={` rounded-lg p-4 h-[calc(100vh-4rem)] overflow-auto ${className}`}>
      <div className="w-full min-h-full flex items-center justify-center text-gray-500">
        {thread?.messages?.findLast(msg => msg.renderedComponent) ? (
          thread.messages.findLast(msg => msg.renderedComponent)?.renderedComponent
        ) : (
          <div className="text-center">
            <IssuesList />
          </div>
        )}
      </div>
    </div>
  );
} 