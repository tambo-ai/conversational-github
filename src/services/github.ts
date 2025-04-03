import { useRepositoryStore } from '@/store/repository-store';
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

export interface IssueFilters {
  state?: 'open' | 'closed' | 'all';
  title?: string;
  body?: string;
  created_after?: string;
  created_before?: string;
  updated_after?: string;
  updated_before?: string;
  comments?: number;
}

export async function getIssues(filters?: IssueFilters): Promise<Issue[]> {
  const { selectedRepository } = useRepositoryStore.getState();
  if (!selectedRepository?.owner || !selectedRepository?.repo) {
    throw new Error("Repository owner and repo are required");
  }
  const response = await octokit.issues.listForRepo({
    owner: selectedRepository.owner,
    repo: selectedRepository.repo,
    state: filters?.state || 'all',
    per_page: 100,
  });

  let filteredIssues = response.data as Issue[];

  // Apply additional filters
  if (filters) {
    filteredIssues = filteredIssues.filter(issue => {
      if (filters.title && !issue.title.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
      }
      if (filters.body && issue.body && !issue.body.toLowerCase().includes(filters.body.toLowerCase())) {
        return false;
      }
      if (filters.created_after && new Date(issue.created_at) < new Date(filters.created_after)) {
        return false;
      }
      if (filters.created_before && new Date(issue.created_at) > new Date(filters.created_before)) {
        return false;
      }
      if (filters.updated_after && new Date(issue.updated_at) < new Date(filters.updated_after)) {
        return false;
      }
      if (filters.updated_before && new Date(issue.updated_at) > new Date(filters.updated_before)) {
        return false;
      }
      if (filters.comments !== undefined && issue.comments !== filters.comments) {
        return false;
      }
      return true;
    });
  }

  return filteredIssues;
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