"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Headphones,
  LayoutDashboard,
  Ticket,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function navItemsForRole(role) {
  if (role === "admin") {
    return [
      { label: "Dashboard", icon: LayoutDashboard, path: "/", exact: true },
      { label: "Tickets", icon: Ticket, path: "/tickets", exact: false },
      { label: "History", icon: History, path: "/history", exact: false },
    ];
  }
  return [
    { label: "Dashboard", icon: LayoutDashboard, path: "/portal", exact: true },
    { label: "Tickets", icon: Ticket, path: "/portal/tickets", exact: false },
    { label: "History", icon: History, path: "/portal/history", exact: false },
  ];
}

function settingsPathForRole(role) {
  return role === "admin" ? "/settings" : "/portal/settings";
}

function NavItem({ icon: Icon, label, path, isActive }) {
  return (
    <Link
      href={path}
      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors
        ${
          isActive
            ? "bg-red-500 text-white"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        }`}
    >
      <Icon size={18} strokeWidth={2} />
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Guarded layouts should prevent this from ever rendering without a user,
  // but bail out gracefully just in case.
  if (!user) return null;

  const navItems = navItemsForRole(user.role);
  const settingsPath = settingsPathForRole(user.role);
  const settingsActive = pathname === settingsPath;
  const initial = user.name?.charAt(0)?.toUpperCase() ?? "?";

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="w-64 shrink-0 h-screen bg-white border-r border-gray-100 flex flex-col justify-between">
      <div>
        {/* Brand */}
        <div className="px-6 pt-7 pb-6 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
            <Headphones size={17} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-[15px] font-bold text-gray-900 tracking-tight">
            IT Support
          </span>
        </div>

        {/* Nav */}
        <div className="px-4">
          <p className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
            Overview
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                {...item}
                isActive={
                  item.exact ? pathname === item.path : pathname.startsWith(item.path)
                }
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Footer: settings + profile */}
      <div className="px-4 pb-5">
        <Link
          href={settingsPath}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors mb-3
            ${
              settingsActive
                ? "bg-red-500 text-white"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
        >
          <Settings size={18} strokeWidth={2} />
          <span>Settings</span>
        </Link>
        <div className="border-t border-gray-100 pt-4 px-1 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-sm font-semibold">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-400 leading-tight truncate">
              {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Log out"
          >
            <LogOut size={17} strokeWidth={2} />
          </button>
        </div>
      </div>
    </aside>
  );
}
