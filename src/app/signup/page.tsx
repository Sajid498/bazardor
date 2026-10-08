
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { getAuthPageHref } from "@/lib/auth-redirect";
import SocialLoginButtons from "@/components/SocialLoginButtons";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [signinHref, setSigninHref] = useState("/signin");

  useEffect(() => {
    setSigninHref(getAuthPageHref("/signin"));
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !password ||
      !confirmPassword
    ) {
      toast.error("সব তথ্য পূরণ করুন।");
      return;
    }

    if (trimmedName.length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে।");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
    ) {
      toast.error("সঠিক ইমেইল অ্যাড্রেস লিখুন।");
      return;
    }

    if (password.length < 8) {
      toast.error(
        "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না।");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      if (error) {
        toast.error(
          error.message ||
            "Account তৈরি করা যায়নি।"
        );
        return;
      }

      toast.success(
        "Account তৈরি হয়েছে! এখন সাইন ইন করুন।"
      );

      // Preserve the original callback destination.
      router.push(getAuthPageHref("/signin"));
    } catch (error) {
      console.error("Sign Up Error:", error);

      toast.error(
        "কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="mb-2 text-center text-3xl font-bold text-emerald-800">
          Create Account
        </h1>

        <p className="mb-8 text-center text-slate-500">
          Join BazarDor Today
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
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
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter your name"
              autoComplete="name"
              required
              minLength={2}
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-semibold"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="example@gmail.com"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block font-semibold"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          <div>
            <label
              htmlFor="confirm"
              className="mb-2 block font-semibold"
            >
              Confirm Password
            </label>

            <input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-lg bg-emerald-700 p-3 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Sign Up"}
          </button>
        </form>

        <SocialLoginButtons />

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link
            href={signinHref}
            className="font-bold text-emerald-700 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
