"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, AlertCircle, Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

function VerifyOtpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Focus the first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    // Cooldown timer logic
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        // Take only the last character entered
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Backspace logic: focus previous input
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").trim();
        if (!/^\d{6}$/.test(pasteData)) return;

        const newOtp = pasteData.split("");
        setOtp(newOtp);

        // Focus last input
        inputRefs.current[5]?.focus();
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const otpCode = otp.join("");
        if (otpCode.length !== 6) return;

        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otpCode }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Verification failed");
            }

            // Successful verification
            // Redirect based on role
            const role = data.user?.role;
            if (role === "ADMIN") router.push("/dashboard/admin");
            else if (role === "LECTURER") router.push("/dashboard/lecturer");
            else router.push("/dashboard/student");

            router.refresh();
        } catch (err: any) {
            setError(err.message);
            // Reset OTP fields on error? Or just let them fix it
        } finally {
            setLoading(false);
        }
    };

    // Auto-submit when all 6 digits are entered
    useEffect(() => {
        if (otp.every(digit => digit !== "")) {
            handleSubmit();
        }
    }, [otp]);

    const handleResend = async () => {
        if (cooldown > 0 || resending) return;

        setResending(true);
        setError("");

        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to resend code");
            }

            setCooldown(60); // 1 minute cooldown
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setResending(false);
        }
    };

    if (!email) {
        return (
            <div className="text-center p-8">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Missing Session</h2>
                <p className="text-gray-500 mb-4">Verification email not found. Please try logging in again.</p>
                <Link href="/login" className="text-primary hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-12 bg-white p-8 border border-border rounded-sm shadow-sm">
            <div className="mb-6 text-center">
                <div className="bg-blue-50 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    <Mail className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-primary">Verify Your Identity</h1>
                <p className="text-sm text-gray-500 mt-2">
                    We&apos;ve sent a 6-digit verification code to
                </p>
                <p className="font-medium text-gray-800">{email}</p>
            </div>

            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            className="w-12 h-14 text-center text-2xl font-bold border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            disabled={loading}
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={loading || otp.some(digit => !digit)}
                    className="w-full bg-primary text-white py-3 px-4 rounded font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-colors"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        "Verify & Continue"
                    )}
                </button>
            </form>

            <div className="mt-8 text-center border-t pt-6">
                <p className="text-sm text-gray-500 mb-2">Didn&apos;t receive the code?</p>
                <button
                    onClick={handleResend}
                    disabled={cooldown > 0 || resending}
                    className="text-primary font-medium hover:underline flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:no-underline"
                >
                    {resending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className={`h-4 w-4 ${cooldown > 0 ? '' : 'group-hover:rotate-180 transition-transform'}`} />
                    )}
                    {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend Code"}
                </button>

                <div className="mt-4">
                    <Link href="/login" className="text-gray-500 text-sm hover:underline flex items-center justify-center gap-1">
                        <ArrowLeft className="h-3 w-3" /> Use a different email
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <VerifyOtpForm />
        </Suspense>
    );
}
