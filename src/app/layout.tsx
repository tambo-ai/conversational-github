'use client'
import { GitHubIssues } from "@/components/issues-list";
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
  toolSchema: z.function().returns(z.array(z.object({
    number: z.number(),
    title: z.string(),
    body: z.string().nullable(),
    state: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    html_url: z.string(),
    comments: z.number(),
  })))
}

const tamboComponents: TamboComponent[] = [
  {
    name: "github-issues-list",
    description: "A list of issues from a GitHub repository. Do not try and generate props.",
    component: GitHubIssues,
    propsDefinition: {
    },
    associatedTools: [githubTool]
  },
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
