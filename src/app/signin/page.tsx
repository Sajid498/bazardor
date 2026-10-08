
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import SocialLoginButtons from "@/components/SocialLoginButtons";

function getSafeCallbackUrl(): string {
  const params = new URLSearchParams(
    window.location.search
  );

  const callbackUrl = params.get("callbackUrl");

  if (!callbackUrl) {
    return "/";
  }

  // Only allow internal paths.
  if (
    !callbackUrl.startsWith("/") ||
    callbackUrl.startsWith("//") ||
    callbackUrl.startsWith("/\\")
  ) {
    return "/";
  }

  try {
    const target = new URL(
      callbackUrl,
      window.location.origin
    );

    if (target.origin !== window.location.origin) {
      return "/";
    }

    return (
      target.pathname +
      target.search +
      target.hash
    );
  } catch {
    return "/";
  }
}

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    if (params.get("reason") === "protected") {
      toast("পণ্যের বিস্তারিত দেখতে প্রথমে সাইন ইন করুন।", {
        id: "protected-route-notice",
        icon: "🔐",
      });
    }
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("ইমেইল এবং পাসওয়ার্ড লিখুন।");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(
          error.message ||
            "ইমেইল অথবা পাসওয়ার্ড ভুল।"
        );
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে!");

      const destination = getSafeCallbackUrl();

      router.replace(destination);
      router.refresh();
    } catch (error) {
      console.error("Sign In Error:", error);

      toast.error(
        "লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg sm:p-9">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4 text-5xl">🛒</div>

          <h1 className="text-3xl font-extrabold text-emerald-900">
            Welcome Back!
          </h1>

          <p className="mt-2 text-slate-500">
            Sign in to your BazarDor account
          </p>
        </div>

        {/* Email Login */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="signin-email"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Email Address
            </label>

            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="example@gmail.com"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="signin-password"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Password
            </label>

            <input
              id="signin-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Social Login */}
        <SocialLoginButtons />

        {/* Signup Link */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-bold text-emerald-700 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
}
