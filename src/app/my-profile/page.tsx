
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function MyProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(
      "/signin?callbackUrl=%2Fmy-profile&reason=protected"
    );
  }

  const user = session.user;

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-6 text-3xl font-bold text-emerald-900">
          My Profile
        </h1>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">
              Full Name
            </p>
            <p className="font-semibold text-slate-900">
              {user.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Email Address
            </p>
            <p className="font-semibold text-slate-900">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Email Verification
            </p>
            <p className="font-semibold text-slate-900">
              {user.emailVerified
                ? "Verified"
                : "Not Verified"}
            </p>
          </div>
        </div>

        <Link
          href="/my-profile/update"
          className="mt-8 inline-flex rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800"
        >
          Update Information
        </Link>
      </div>
    </section>
  );
}
