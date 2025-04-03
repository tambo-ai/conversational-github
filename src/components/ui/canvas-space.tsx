"use client";

import { useTamboThread } from "@tambo-ai/react";
import { useEffect } from "react";

interface CanvasSpaceProps {
  className?: string;
}

export function CanvasSpace({ className }: CanvasSpaceProps) {
  const { thread } = useTamboThread();
  useEffect(() => {
    console.log("thread", thread);
  }, [thread]);

  return (
    <div className={`bg-white rounded-lg p-4 h-[calc(100vh-4rem)] overflow-auto ${className}`}>
      <div className="w-full min-h-full flex items-center justify-center text-gray-500">
        {thread?.messages?.findLast(msg => msg.renderedComponent) ? (
          thread.messages.findLast(msg => msg.renderedComponent)?.renderedComponent
        ) : (
          <div className="text-center">
            <p className="text-lg font-medium">No rendered component to display</p>
            <p className="text-sm text-gray-400 mt-2">The latest message's rendered component will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
} 