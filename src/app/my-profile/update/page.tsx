
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } =
    authClient.useSession();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace(
        "/signin?callbackUrl=%2Fmy-profile%2Fupdate&reason=protected"
      );
    }
  }, [isPending, session?.user, router]);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (name.trim().length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে।");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
      });

      if (error) {
        toast.error(error.message || "Update failed");
        return;
      }

      toast.success("Profile updated successfully!");
      router.replace("/my-profile");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (isPending || !session?.user) {
    return (
      <p className="py-20 text-center">
        Loading...
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-emerald-900">
          Update Information
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block font-semibold"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-emerald-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-700 p-3 font-bold text-white disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Information"}
          </button>
        </form>

        <Link
          href="/my-profile"
          className="mt-5 block text-center text-emerald-700"
        >
          ← Back to Profile
        </Link>
      </div>
    </section>
  );
}
