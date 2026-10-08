
"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

type Provider = "google" | "github";
function getCallbackURL(): string {
  const params = new URLSearchParams(
    window.location.search
  );

  const callbackURL = params.get("callbackUrl");

  if (
    callbackURL &&
    callbackURL.startsWith("/") &&
    !callbackURL.startsWith("//") &&
    !callbackURL.startsWith("/\\")
  ) {
    return callbackURL;
  }

  return "/";
}
export default function SocialLoginButtons() {
  const [loading, setLoading] = useState<Provider | null>(null);

  async function handleSocialLogin(provider: Provider) {
    setLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider: provider,
        callbackURL: "/?signedIn=1",
      });

      if (error) {
        toast.error(
          error.message || "Social login failed!"
        );
      }
    } catch (error) {
      console.error("Social login error:", error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-6 space-y-3">

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200"></div>

        <span className="text-sm text-gray-500">
          Or continue with
        </span>

        <div className="h-px flex-1 bg-gray-200"></div>
      </div>

    
      <button
        type="button"
        onClick={() => handleSocialLogin("google")}
        disabled={loading !== null}
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="text-xl font-bold text-blue-600">
          G
        </span>

        {loading === "google"
          ? "Connecting..."
          : "Continue with Google"}
      </button>

      
      <button
        type="button"
        onClick={() => handleSocialLogin("github")}
        disabled={loading !== null}
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="text-xl">🐙</span>

        {loading === "github"
          ? "Connecting..."
          : "Continue with GitHub"}
      </button>
    </div>
  );
}
