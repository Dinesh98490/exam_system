"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          mfaCode: mfaRequired ? mfaCode : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.mfaRequired) {
        setMfaRequired(true);
        setLoading(false);
        return;
      }

      // Redirect based on role or default
      if (data.user?.role === "ADMIN") router.push("/dashboard/admin");
      else if (data.user?.role === "LECTURER")
        router.push("/dashboard/lecturer");
      else router.push("/dashboard/student");

      router.refresh(); // Refresh to update Header session
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 border border-border rounded-sm shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-primary">System Login</h1>
        <p className="text-sm text-gray-500 mt-1">
          University Secure Examination Portal
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!mfaRequired ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                University Email
              </label>
              <input
                type="email"
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full p-2 pr-10 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Authenticator Code (MFA)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                maxLength={6}
                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-center tracking-[1em] font-mono"
                placeholder="000000"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Enter the 6-digit code from your authenticator app.
            </p>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 px-4 rounded font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Verifying..." : mfaRequired ? "Verify Code" : "Sign In"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-xs text-gray-500 border-t pt-4">
        <p>Warning: This system is for authorized use only.</p>
        <Link
          href="/register"
          className="text-primary hover:underline mt-2 block"
        >
          Register New Account (Student)
        </Link>
      </div>
    </div>
  );
}
