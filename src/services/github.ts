import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

export interface Issue {
  number: number;
  title: string;
  body: string | null;
  state: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  comments: number;
}

export interface Comment {
  id: number;
  body: string;
  created_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

export interface Repository {
  owner: string;
  repo: string;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
}

export async function getIssues(repo: Repository): Promise<Issue[]> {
  const response = await octokit.issues.listForRepo({
    owner: repo.owner,
    repo: repo.repo,
    state: 'all',
    per_page: 100,
  });
  return response.data as Issue[];
}

export async function getIssue(repo: Repository, issueNumber: number): Promise<Issue> {
  const response = await octokit.issues.get({
    owner: repo.owner,
    repo: repo.repo,
    issue_number: issueNumber,
  });
  return response.data as Issue;
}

export async function createIssue(repo: Repository, title: string, body: string): Promise<Issue> {
  const response = await octokit.issues.create({
    owner: repo.owner,
    repo: repo.repo,
    title,
    body,
  });
  return response.data as Issue;
}

export async function updateIssue(repo: Repository, issueNumber: number, title: string, body: string): Promise<Issue> {
  const response = await octokit.issues.update({
    owner: repo.owner,
    repo: repo.repo,
    issue_number: issueNumber,
    title,
    body,
  });
  return response.data as Issue;
}

export async function closeIssue(repo: Repository, issueNumber: number): Promise<Issue> {
  const response = await octokit.issues.update({
    owner: repo.owner,
    repo: repo.repo,
    issue_number: issueNumber,
    state: 'closed',
  });
  return response.data as Issue;
}

export async function getRepositories(): Promise<Repository[]> {
  const response = await octokit.repos.listForAuthenticatedUser({
    sort: 'updated',
    per_page: 100,
  });
  return response.data.map(repo => ({
    owner: repo.owner.login,
    repo: repo.name,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    html_url: repo.html_url,
  }));
}

export async function getComments(repo: Repository, issueNumber: number): Promise<Comment[]> {
  const response = await octokit.issues.listComments({
    owner: repo.owner,
    repo: repo.repo,
    issue_number: issueNumber,
    per_page: 100,
  });
  return response.data as Comment[];
} 