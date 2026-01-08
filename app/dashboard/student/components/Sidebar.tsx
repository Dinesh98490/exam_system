"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, User, LogOut, BookOpen } from "lucide-react";

export function StudentSidebar() {
  const pathname = usePathname();

  const STATUS_ACTIVE = "bg-blue-100 text-blue-900 font-medium";
  const STATUS_INACTIVE = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-[calc(100vh-64px)] sticky top-16">
      <div className="p-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Student Menu
        </h2>
        <nav className="space-y-1">
          <Link
            href="/dashboard/student"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === "/dashboard/student"
                ? STATUS_ACTIVE
                : STATUS_INACTIVE
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Overview
          </Link>
          <Link
            href="/dashboard/student/exams"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === "/dashboard/student/exams"
                ? STATUS_ACTIVE
                : STATUS_INACTIVE
            }`}
          >
            <BookOpen className="h-5 w-5" />
            My Exams
          </Link>
          <Link
            href="/dashboard/student/history"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === "/dashboard/student/history"
                ? STATUS_ACTIVE
                : STATUS_INACTIVE
            }`}
          >
            <History className="h-5 w-5" />
            Attempt History
          </Link>
          <Link
            href="/dashboard/student/profile"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === "/dashboard/student/profile"
                ? STATUS_ACTIVE
                : STATUS_INACTIVE
            }`}
          >
            <User className="h-5 w-5" />
            My Profile
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
