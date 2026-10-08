
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import SocialLoginButtons from "@/components/SocialLoginButtons";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password: password,
      });

      if (error) {
        toast.error(
          error.message || "Invalid email or password"
        );
        return;
      }

      toast.success("Login successful!");

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign In Error:", error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg sm:p-9">

        {/* Heading */}
        <div className="text-center">
          <div className="mb-4 text-5xl">🛒</div>

          <h1 className="text-3xl font-extrabold text-emerald-900">
            Welcome Back!
          </h1>

          <p className="mt-2 text-slate-500">
            Sign in to your BazarDor account
          </p>
        </div>

        {/* Sign In Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          {/* Email */}
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Password */}
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Submit Button */}
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

        {/* Sign Up Link */}
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
