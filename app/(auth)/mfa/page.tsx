"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, AlertTriangle, Lock } from "lucide-react";

export default function MfaPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(3);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    setSessionId(`SEC-${Math.floor(Math.random() * 10000)}`);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // UI Simulation of verification
    setTimeout(() => {
      if (code === "123456") {
        router.push("/dashboard/student"); // or previous intent
      } else {
        setAttempts((p) => p - 1);
        setLoading(false);
        if (attempts <= 1) {
          alert("Account locked due to multiple failed MFA attempts.");
        }
      }
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 border border-border rounded-sm shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-600"></div>

      <div className="mb-6 flex items-start gap-4">
        <div className="bg-yellow-50 p-2 rounded-full text-yellow-700">
          <Shield className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Multi-Factor Authentication Required
          </h1>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            To protect the integrity of the examination system, we require a
            second factor of verification. Please enter the code sent to your
            registered institutional device.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-3 mb-6 border border-gray-200 rounded text-sm text-gray-700 flex items-center gap-2">
        <Lock className="h-4 w-4 text-gray-500" />
        <span>
          Session ID: <span className="font-mono text-xs">{sessionId}</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            required
            maxLength={6}
            pattern="\d{6}"
            className="w-full text-center text-2xl tracking-[0.5em] font-mono p-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || attempts === 0}
            className="w-full bg-primary text-white py-2 px-4 rounded font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Identity"}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs mt-4">
          <span
            className={`flex items-center gap-1 ${
              attempts < 3 ? "text-red-600 font-bold" : "text-gray-500"
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            Attempts Remaining: {attempts}
          </span>
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => alert("Resending code...")}
          >
            Resend Code
          </button>
        </div>
      </form>
    </div>
  );
}
