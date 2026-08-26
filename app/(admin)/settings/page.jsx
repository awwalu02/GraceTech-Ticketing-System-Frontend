"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Spinner from "@/components/Spinner";
import { useAdmins } from "@/lib/useAdmins";
import { useNotifications } from "@/lib/useNotifications";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const { user } = useAuth();
  const { admins, loading, createAdmin, deleteAdmin } = useAdmins();
  const { notifications } = useNotifications(user?.name);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  async function handleDelete(admin) {
    if (confirmingId !== admin.id) {
      setConfirmingId(admin.id);
      setDeleteError(null);
      return;
    }
    setDeletingId(admin.id);
    setDeleteError(null);
    try {
      await deleteAdmin(admin.id);
      setConfirmingId(null);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

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
    <div className="flex flex-col md:flex-row bg-[#F6F7F9] min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 px-4 py-5 md:px-10 md:py-8 max-w-5xl mx-auto w-full">
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
                admins.map((a) => {
                  const isSelf = user?.id != null && String(a.id) === String(user.id);
                  const isConfirming = confirmingId === a.id;
                  const isDeleting = deletingId === a.id;

                  return (
                    <div key={a.id}>
                      <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-gray-50">
                        <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-semibold shrink-0">
                          {a.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {a.name}
                            {isSelf && (
                              <span className="text-gray-400 font-normal"> (you)</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {a.email}
                          </p>
                        </div>
                        {!isSelf && (
                          <button
                            onClick={() => handleDelete(a)}
                            disabled={isDeleting}
                            className={`shrink-0 transition-colors ${
                              isConfirming
                                ? "text-red-600 hover:text-red-700"
                                : "text-gray-300 hover:text-red-600"
                            }`}
                            aria-label={
                              isConfirming ? "Confirm delete" : `Delete ${a.name}`
                            }
                            title={isConfirming ? "Click again to confirm" : "Delete admin"}
                          >
                            {isDeleting ? (
                              <Spinner size={16} />
                            ) : (
                              <Trash2 size={16} strokeWidth={2} />
                            )}
                          </button>
                        )}
                      </div>
                      {isConfirming && (
                        <div className="mt-1.5 flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-red-50 border border-red-100">
                          <p className="text-xs text-red-700">
                            Remove {a.name} as an admin?
                          </p>
                          <button
                            onClick={() => setConfirmingId(null)}
                            className="text-xs font-semibold text-gray-500 hover:text-gray-700 shrink-0"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              {deleteError && (
                <p className="text-xs text-red-500 pt-1">{deleteError}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}