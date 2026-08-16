"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Spinner from "@/components/Spinner";
import { useAdmins } from "@/lib/useAdmins";
import { useNotifications } from "@/lib/useNotifications";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const { user } = useAuth();
  const { admins, loading, createAdmin } = useAdmins();
  const { notifications } = useNotifications(user?.name);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const admin = await createAdmin({ name, email, password });
      setSuccess(`${admin.name} was added as an admin.`);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex bg-[#F6F7F9] min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 px-10 py-8">
        <TopBar title="Settings" notificationCount={notifications.length} />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Create admin form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Create Admin
            </h2>
            <p className="text-sm text-gray-400 mb-5">
              New admins can view every ticket and mark any of them done.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-name"
                  className="block text-sm font-semibold text-gray-900 mb-1.5"
                >
                  Full name
                </label>
                <input
                  id="admin-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-sm font-semibold text-gray-900 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-semibold text-gray-900 mb-1.5"
                >
                  Temporary password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400"
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}
              {success && (
                <p className="text-xs text-emerald-600">{success}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
              >
                {submitting && <Spinner size={14} />}
                {submitting ? "Creating…" : "Create Admin"}
              </button>
            </form>
          </div>

          {/* Current admins */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Current Admins
            </h2>
            <p className="text-sm text-gray-400 mb-5">
              Everyone who can view and manage tickets.
            </p>

            <div className="space-y-2">
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Spinner size={16} />
                  Loading…
                </div>
              ) : (
                admins.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-gray-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-semibold shrink-0">
                      {a.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {a.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {a.email}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
