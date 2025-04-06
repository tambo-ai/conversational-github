"use client";

import { Message } from "@/components/ui/message";
import { cn } from "@/lib/utils";
import { useTambo } from "@tambo-ai/react";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { useEffect } from "react";

const threadContentVariants = cva("flex flex-col gap-4", {
  variants: {
    variant: {
      default: "",
      solid: [
        "shadow shadow-zinc-900/10 dark:shadow-zinc-900/20",
        "bg-muted dark:bg-muted",
      ].join(" "),
      bordered: ["border-2", "border-border"].join(" "),
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Represents a thread content component
 * @property {string} className - Optional className for custom styling
 * @property {VariantProps<typeof threadContentVariants>["variant"]} variant - Optional variant for custom styling
 */

export interface ThreadContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof threadContentVariants>["variant"];
}

const ThreadContent = React.forwardRef<HTMLDivElement, ThreadContentProps>(
  ({ className, variant, ...props }, ref) => {
    const { thread, generationStage } = useTambo();
    useEffect(() => {
      console.log("thread", thread);
    }, [thread]);
    const messages = thread?.messages ?? [];
    const isGenerating = generationStage === "STREAMING_RESPONSE";

    // Find latest messages for each role
    const latestUserMessage = [...messages].reverse().find(m => m.role === "user");
    const latestAssistantMessage = [...messages].reverse().find(m =>
      m.role === "assistant" || m.role === "hydra"
    );

    // Determine which messages to show
    const messagesToShow = [];
    if (latestUserMessage) {
      messagesToShow.push(latestUserMessage);
      // Show assistant message if it came AFTER the latest user message
      if (latestAssistantMessage &&
        latestAssistantMessage.createdAt &&
        latestUserMessage.createdAt &&
        latestAssistantMessage.createdAt > latestUserMessage.createdAt) {
        messagesToShow.push(latestAssistantMessage);
      }
    }

    return (
      <div
        ref={ref}
        className={cn(threadContentVariants({ variant }), className)}
        {...props}
      >
        {messagesToShow.map((message, index) => {
          const showLoading = isGenerating && index === messagesToShow.length - 1;
          const messageContent = Array.isArray(message.content)
            ? (message.content[0]?.text ?? "Empty message")
            : typeof message.content === "string"
              ? message.content
              : "Empty message";

          return (
            <div
              key={message.id ?? `${message.role}-${message.createdAt}`}
              className={cn(
                "animate-in fade-in-0 slide-in-from-bottom-2",
                "duration-500 ease-in-out",
                "opacity-0 animate-fade-in"
              )}
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "forwards",
                animation: "fadeIn 500ms ease-in-out forwards"
              }}
            >
              <style jsx>{`
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
              <div
                className={cn(
                  "flex flex-col gap-1.5",
                  message.role === "user" ? "ml-auto mr-0" : "ml-0 mr-auto",
                  "max-w-[85%]",
                )}
              >
                <Message
                  role={
                    message.role === "hydra" || message.role === "assistant"
                      ? "assistant"
                      : "user"
                  }
                  content={messageContent}
                  variant={variant}
                  message={message}
                  isLoading={showLoading}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);
ThreadContent.displayName = "ThreadContent";

export { ThreadContent, threadContentVariants };
