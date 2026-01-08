import Link from "next/link";
import { Menu, Shield } from "lucide-react";

export default function PublicNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-slate-900 p-1.5 rounded-sm">
                <Shield className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900 leading-tight tracking-tight">
                  UNIVERSITY
                </span>
                <span className="text-xs font-medium text-slate-600 uppercase tracking-widest">
                  Examination System
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-900 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-800 transition-colors py-1"
            >
              Home
            </Link>
            <a
              href="#about"
              className="text-sm font-medium text-gray-600 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-sm px-1"
            >
              About System
            </a>
            <a
              href="#security"
              className="text-sm font-medium text-gray-600 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-sm px-1"
            >
              Security & Privacy
            </a>
            <a
              href="#process"
              className="text-sm font-medium text-gray-600 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-sm px-1"
            >
              How it Works
            </a>
          </div>

          {/* Desktop CTA - Right */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors shadow-sm"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Hidden by default, standard pattern needs state for full interactivity, keeping it simple/semantic for now) */}
      <div className="md:hidden hidden" id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6">
          <Link
            href="/"
            className="block px-3 py-2 text-base font-medium text-gray-900 bg-gray-50 rounded-md"
          >
            Home
          </Link>
          <a
            href="#about"
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
          >
            About System
          </a>
          <a
            href="#security"
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
          >
            Security & Privacy
          </a>
          <a
            href="#help"
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
          >
            Help / FAQ
          </a>
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
            <Link
              href="/auth/login"
              className="block w-full text-center px-4 py-2 text-base font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
