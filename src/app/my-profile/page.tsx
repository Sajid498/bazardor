
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } =
    authClient.useSession();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdate(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const updatedName = name.trim();

    if (!updatedName) {
      toast.error("Please enter your name.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: updatedName,
      });

      if (error) {
        toast.error(
          error.message || "Failed to update information."
        );
        return;
      }

      toast.success("Information updated successfully!");

      router.push("/my-profile");
      router.refresh();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center text-slate-600">
        Loading...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">
          Please sign in first
        </h1>

        <Link
          href="/signin"
          className="mt-5 inline-flex rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-9">
        <h1 className="text-2xl font-extrabold text-emerald-950">
          Update Information
        </h1>

        <p className="mt-2 text-slate-600">
          Update your BazarDor profile name.
        </p>

        <form
          onSubmit={handleUpdate}
          className="mt-7 space-y-5"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder={
                session.user.name || "Enter your name"
              }
              required
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Updating..."
              : "Update Information"}
          </button>
        </form>

        <Link
          href="/my-profile"
          className="mt-5 inline-block text-sm font-semibold text-emerald-800 hover:underline"
        >
          ← Back to Profile
        </Link>
      </div>
    </section>
  );
}
