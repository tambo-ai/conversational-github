'use client'

import { getIssues } from "@/services/github";
import { TamboProvider, TamboTool, type TamboComponent } from "@tambo-ai/react";

import { CreateIssueForm } from "@/components/create-issue-form";
import { IssueItem } from "@/components/issue-item";
import { IssuesList } from "@/components/issues-list";
import { Geist, Geist_Mono } from "next/font/google";
import { z } from "zod";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const githubIssueSchema = z.object({
  number: z.number(),
  title: z.string(),
  body: z.string().nullable(),
  state: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  html_url: z.string(),
  comments: z.number()
});

const githubFiltersSchema = z.object({
  state: z.enum(['open', 'closed', 'all']).optional(),
  title: z.string().describe("The title of the issue contains this string").optional(),
  body: z.string().describe("The body of the issue contains this string").optional(),
  created_after: z.string().describe("The issue was created after this date").optional(),
  created_before: z.string().describe("The issue was created before this date").optional(),
  updated_after: z.string().describe("The issue was updated after this date").optional(),
  updated_before: z.string().describe("The issue was updated before this date").optional(),
  comments: z.number().describe("The issue has this many comments").optional()
});

const githubTool: TamboTool = {
  name: "github",
  description: "A tool to get issues from a GitHub repository",
  tool: getIssues,
  toolSchema: z.function()
    .args(z.object({
      filters: githubFiltersSchema.optional()
    }))
    .returns(z.array(githubIssueSchema))
};

const tamboComponents: TamboComponent[] = [
  {
    name: "github-issues-list",
    description: "A list of issues from a GitHub repository. Use this when the user wants to view a list of issues.",
    component: IssuesList,
    propsSchema: z.object({
      filters: githubFiltersSchema
    }),
    associatedTools: [githubTool]
  },
  {
    name: "github-issue-item",
    description: "Details of a single issue from a GitHub repository. Use this when the user wants to view the details of a single issue.",
    component: IssueItem,
    propsSchema: z.object({
      issue: githubIssueSchema
    }),
    associatedTools: [githubTool]
  },
  {
    name: "github-create-issue-form",
    description: "A form to create a new issue in a GitHub repository. Use this when the user wants to create a new issue.",
    component: CreateIssueForm,
    propsSchema: z.object({
      initialTitle: z.string().describe("The initial title of the issue to create").optional(),
      initialBody: z.string().describe("The initial body of the issue to create").optional()
    }),
    associatedTools: [githubTool]
  }
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-zinc-900">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen bg-zinc-900 text-foreground`}>
        <TamboProvider
          apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
          components={tamboComponents}
        >
          {children}
        </TamboProvider>
      </body>
    </html>
  );
}
