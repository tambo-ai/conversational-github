'use client';

import { useAuthStore } from '@/store/auth-store';

export function GitHubAuth() {
  const { isAuthenticated, setAccessToken } = useAuthStore();

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = 'repo';

    localStorage.setItem('auth_redirect', window.location.pathname);

    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const handleLogout = () => {
    setAccessToken(null);
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Connected to GitHub</span>
        <button
          className="px-4 py-1 border rounded-md hover:opacity-80 text-muted-foreground cursor-pointer"
          onClick={handleLogout}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      <button
        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        onClick={handleLogin}
      >
        Connect with GitHub
      </button>
      <p className="text-md text-muted-foreground">Talk to your GitHub issues</p>
    </div>
  );
} 