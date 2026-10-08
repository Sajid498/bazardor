
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function AuthNav() {
  const router = useRouter();

  const { data: session, isPending } =
    authClient.useSession();

  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(
          error.message || "Sign out failed."
        );
        return;
      }

      toast.success("Successfully signed out!");

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Something went wrong.");
    } finally {
      setSigningOut(false);
    }
  }

  // Session loading
  if (isPending) {
    return (
      <div
        className="h-10 w-32 animate-pulse rounded-lg bg-slate-200"
        aria-label="Loading session"
      />
    );
  }

  // Logged-in User
  if (session?.user) {
    const user = session.user;

    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/my-profile"
          className="flex items-center gap-2 rounded-lg bg-emerald-50 px-2 py-2 font-semibold text-emerald-800 transition hover:bg-emerald-100 sm:px-3"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </span>

          <span className="hidden max-w-28 truncate sm:inline">
            {user.name || "Profile"}
          </span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="cursor-pointer rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {signingOut ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    );
  }

  // Guest User
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href="/signin"
        className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
      >
        Sign In
      </Link>

      <Link
        href="/signup"
        className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        Sign Up
      </Link>
    </div>
  );
}
