"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  const { setAccessToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      router.push("/");
      return;
    }

    const exchangeCode = async () => {
      try {
        const response = await fetch("/api/auth/github", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error("Failed to exchange code");
        }

        const { access_token } = await response.json();
        setAccessToken(access_token);

        // Redirect back to the original page
        const redirectPath = localStorage.getItem("auth_redirect") || "/";
        localStorage.removeItem("auth_redirect");
        router.push(redirectPath);
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/");
      }
    };

    exchangeCode();
  }, [router, setAccessToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Connecting to GitHub...</h1>
        <p className="text-muted-foreground">
          Please wait while we complete the authentication.
        </p>
      </div>
    </div>
  );
}
