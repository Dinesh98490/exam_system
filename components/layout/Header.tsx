import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { Role } from "@/lib/rbac-definitions";
import { LogOut, Shield, LayoutDashboard } from "lucide-react";
// Actually, Server Components CAN touch DB. But `getSession` already handles session retrieval.
// We just need session.

export async function Header() {
  const session = await getSession();

  return (
    <header className="bg-primary text-primary-foreground border-b border-primary/20 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Shield className="h-6 w-6" />
          <span className="font-bold text-lg tracking-wide">
            SECURE<span className="font-normal text-gray-300">EXAM</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {session ? (
            <>
              {/* Role Based Links */}
              {session.role === Role.STUDENT && (
                <Link
                  href="/dashboard/student"
                  className="flex items-center gap-2 text-sm font-medium hover:text-gray-200"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              {session.role === Role.LECTURER && (
                <Link
                  href="/dashboard/lecturer"
                  className="flex items-center gap-2 text-sm font-medium hover:text-gray-200"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Lecturer Portal
                </Link>
              )}
              {session.role === Role.MODERATOR && (
                <Link
                  href="/dashboard/moderator"
                  className="flex items-center gap-2 text-sm font-medium hover:text-gray-200"
                >
                  <Shield className="h-4 w-4" />
                  Moderation
                </Link>
              )}
              {session.role === Role.ADMIN && (
                <Link
                  href="/dashboard/admin"
                  className="flex items-center gap-2 text-sm font-medium hover:text-gray-200"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-6 border-l border-primary-foreground/20">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold leading-none">
                    {session.userId.substring(0, 8)}...
                  </span>
                  <span className="text-xs text-gray-300 capitalize">
                    {session.role.toLowerCase()}
                  </span>
                </div>
                <form action="/api/auth/logout" method="POST">
                  {/* We need a logout mechanism. For now just a button that hits an endpoint or client action? 
                      We don't have a logout route handler yet. We should create one or just cookie delete. 
                      Let's stick to a simple form post to API for now or Client Component for interactivity.
                      "No UI libraries" implies standard HTML forms are good.
                      But for logout, we usually want client side redirect.
                      Let's make a logout button wrapper or just link to /logout (which clears cookie).
                  */}
                  <button
                    type="submit"
                    className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium hover:text-gray-200"
              >
                Student Login
              </Link>
              <Link
                href="/login?role=staff"
                className="text-sm font-medium hover:text-gray-200"
              >
                Staff Login
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
