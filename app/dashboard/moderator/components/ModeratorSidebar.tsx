"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, AlertTriangle, Users, LogOut } from "lucide-react";

export function ModeratorSidebar() {
  const pathname = usePathname();

  const STATUS_ACTIVE = "bg-red-50 text-red-700 font-medium";
  const STATUS_INACTIVE = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-[calc(100vh-64px)] sticky top-16">
      <div className="p-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Moderator Console
        </h2>
        <nav className="space-y-1">
          <Link
            href="/dashboard/moderator"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === "/dashboard/moderator"
                ? STATUS_ACTIVE
                : STATUS_INACTIVE
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Activity Logs
          </Link>
          <Link
            href="/dashboard/moderator/alerts"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === "/dashboard/moderator/alerts"
                ? STATUS_ACTIVE
                : STATUS_INACTIVE
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
            Security Alerts
          </Link>
          <Link
            href="/dashboard/moderator/users"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === "/dashboard/moderator/users"
                ? STATUS_ACTIVE
                : STATUS_INACTIVE
            }`}
          >
            <Users className="h-5 w-5" />
            User Management
          </Link>
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100">
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-3 text-red-600 hover:bg-red-50 w-full px-3 py-2 rounded-md transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
