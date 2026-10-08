
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth";

export default async function MyProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const user = session.user;

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-9">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-3xl font-extrabold text-emerald-800">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-emerald-950">
              My Profile
            </h1>

            <p className="mt-1 text-slate-500">
              Your BazarDor account information
            </p>
          </div>
        </div>

        {/* User Details */}
        <div className="mt-8 space-y-5">
          <div className="rounded-xl bg-emerald-50 p-5">
            <p className="text-sm text-slate-500">
              Full Name
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {user.name}
            </p>
          </div>

          <div className="rounded-xl bg-emerald-50 p-5">
            <p className="text-sm text-slate-500">
              Email Address
            </p>

            <p className="mt-1 break-all text-lg font-bold text-slate-900">
              {user.email}
            </p>
          </div>

          <div className="rounded-xl bg-emerald-50 p-5">
            <p className="text-sm text-slate-500">
              Account Status
            </p>

            <p className="mt-1 font-semibold text-emerald-800">
              Active
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-7 inline-flex rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
