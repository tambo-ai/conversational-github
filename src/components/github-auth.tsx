'use client';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';

export function GitHubAuth() {
  const { isAuthenticated, setAccessToken } = useAuthStore();

  const handleLogin = () => {
    // GitHub OAuth app client ID - you'll need to create this in GitHub
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = 'repo';

    // Store the current URL to redirect back after auth
    localStorage.setItem('auth_redirect', window.location.pathname);

    // Redirect to GitHub OAuth
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const handleLogout = () => {
    setAccessToken(null);
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Connected to GitHub</span>
        <Button variant="outline" onClick={handleLogout}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleLogin}>
        Connect with GitHub
      </Button>
      <p className="text-sm text-muted-foreground">Talk to your GitHub issues</p>
    </div>
  );
} 