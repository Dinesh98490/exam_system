"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  LogOut,
} from "lucide-react";

export function LecturerSidebar() {
  const pathname = usePathname();

  const STATUS_ACTIVE = "bg-primary/10 text-primary font-medium";
  const STATUS_INACTIVE = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-[calc(100vh-64px)] sticky top-16">
      <div className="p-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Lecturer Portal
        </h2>
        <nav className="space-y-1">
          <Link
            href="/dashboard/lecturer"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === "/dashboard/lecturer"
                ? STATUS_ACTIVE
                : STATUS_INACTIVE
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Overview
          </Link>
          <Link
            href="/dashboard/lecturer/create"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === "/dashboard/lecturer/create"
                ? STATUS_ACTIVE
                : STATUS_INACTIVE
            }`}
          >
            <PlusCircle className="h-5 w-5" />
            Create Exam
          </Link>
          <Link
            href="/dashboard/lecturer/exams"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === "/dashboard/lecturer/exams"
                ? STATUS_ACTIVE
                : STATUS_INACTIVE
            }`}
          >
            <FileText className="h-5 w-5" />
            Manage Exams
          </Link>
          <Link
            href="/dashboard/lecturer/students"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              pathname === "/dashboard/lecturer/students"
                ? STATUS_ACTIVE
                : STATUS_INACTIVE
            }`}
          >
            <Users className="h-5 w-5" />
            Students
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
