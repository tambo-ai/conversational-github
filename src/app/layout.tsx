'use client'
import { IssueItem } from "@/components/issue-item";
import { IssuesList } from "@/components/issues-list";
import { getIssues } from "@/services/github";
import { TamboProvider, TamboTool, type TamboComponent } from "@tambo-ai/react";
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

const githubTool: TamboTool = {
  name: "github",
  description: "A tool to get issues from a GitHub repository",
  tool: getIssues,
  toolSchema: z.function()
    .args(z.object({
      filters: z.object({
        state: z.enum(['open', 'closed', 'all']).optional(),
        title: z.string().optional(),
        body: z.string().optional(),
        created_after: z.string().optional(),
        created_before: z.string().optional(),
        updated_after: z.string().optional(),
        updated_before: z.string().optional(),
        comments: z.number().optional()
      }).optional()
    }))
    .returns(z.array(z.object({
      number: z.number(),
      title: z.string(),
      body: z.string().nullable(),
      state: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
      html_url: z.string(),
      comments: z.number()
    })))
};

const githubIssueSchemaString = `
  {
    number: number,
    title: string,
    body: string | null,
    state: string,
    created_at: string,
    updated_at: string,
    html_url: string,
    comments: number
  }
`;

const githubFiltersSchemaString = `
  {
    state?: 'open' | 'closed' | 'all',
    title?: string,
    body?: string,
    created_after?: string,
    created_before?: string,
    updated_after?: string,
    updated_before?: string,
    comments?: number
  }
`;

const tamboComponents: TamboComponent[] = [
  {
    name: "github-issues-list",
    description: "A list of issues from a GitHub repository. Use this when the user wants to view a list of issues.",
    component: IssuesList,
    propsDefinition: {
      filters: githubFiltersSchemaString
    },
    associatedTools: [githubTool]
  },
  {
    name: "github-issue-item",
    description: "Details of a single issue from a GitHub repository. Use this when the user wants to view the details of a single issue.",
    component: IssueItem,
    propsDefinition: {
      issue: githubIssueSchemaString
    },
    associatedTools: [githubTool]
  }
];
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
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
