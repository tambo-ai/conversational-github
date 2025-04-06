"use client";

import { cn } from "@/lib/utils";
import { useTamboThread } from "@tambo-ai/react";
import { useEffect, useRef, useState } from "react";
import { IssuesList } from "../issues-list";

interface CanvasSpaceProps {
  className?: string;
}

export function CanvasSpace({ className }: CanvasSpaceProps) {
  const { thread } = useTamboThread();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentComponent, setCurrentComponent] =
    useState<React.ReactNode | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const lastMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    const lastRenderedMessage = thread?.messages?.findLast(
      (msg) => msg.renderedComponent,
    );
    const lastRenderedComponent = lastRenderedMessage?.renderedComponent;
    const messageId = lastRenderedMessage?.id ?? null;

    // Only animate if this is a new message
    if (messageId !== lastMessageIdRef.current) {
      lastMessageIdRef.current = messageId;
      setIsExiting(true);
      setIsAnimating(true);
      // Start exit animation for current component
      setTimeout(() => {
        setCurrentComponent(lastRenderedComponent);
        setIsExiting(false);
        // Start entry animation for new component
        setTimeout(() => {
          setIsAnimating(false);
        }, 300); // Match this with the CSS animation duration
      }, 300); // Match this with the CSS animation duration
    } else {
      // If it's the same message, just update it without animation
      setCurrentComponent(lastRenderedComponent);
    }
  }, [thread?.messages]);

  return (
    <div
      className={cn(
        "rounded-lg p-4 h-[calc(100vh-4rem)] overflow-hidden",
        className,
      )}
    >
      <div className="w-full min-h-full flex items-center justify-center text-gray-500">
        <div
          className={cn(
            "w-full transition-all duration-300 ease-in-out",
            isAnimating
              ? isExiting
                ? "opacity-0 translate-x-full"
                : "opacity-0 -translate-x-full"
              : "opacity-100 translate-x-0",
          )}
        >
          {currentComponent || (
            <div className="text-center">
              <IssuesList />
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOutToRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
