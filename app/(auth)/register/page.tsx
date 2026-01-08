"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, AlertCircle, Loader2 } from "lucide-react";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Auto login or redirect to login
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 border border-border rounded-sm shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-primary">
          Student Registration
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create your secure examination account
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            University Email
          </label>
          <input
            type="email"
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
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
              minLength={8}
              className="w-full p-2 pr-10 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <PasswordStrengthMeter password={formData.password} />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 px-4 rounded font-medium hover:bg-primary/90 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Creating Account..." : "Register"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-xs text-gray-500 border-t pt-4">
        <Link href="/login" className="text-primary hover:underline">
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  );
}
