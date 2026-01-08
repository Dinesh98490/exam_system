import PublicNavbar from "@/components/navigation/PublicNavbar";
// import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  Shield,
  Lock,
  FileCheck,
  Users,
  Server,
  Eye,
  UserCheck,
  KeyRound,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <PublicNavbar />

      <main className="flex-grow">
        {/* Section 1: Intro / Purpose */}
        <section id="about" className="bg-white py-20 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-slate-100 inline-block px-3 py-1 rounded-full mb-6">
              <span className="text-sm font-medium text-slate-700">
                Official Examination Portal
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
              Secure Online Examination & Proctoring System
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              A secure platform for conducting online examinations with
              integrity and accountability. Designed for university assessments
              requiring verified identity and monitored environments.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
              >
                Log In to Portal
              </Link>
              <Link
                href="/about"
                className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: Key Principles */}
        <section
          id="principles"
          className="py-20 bg-gray-50 border-b border-gray-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Core Principles
              </h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Our system is built on fundamental academic standards to ensure
                fair and valid assessment outcomes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Principle 1 */}
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center mb-4 text-slate-700">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Exam Integrity
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Rigorous measures to prevent unauthorized assistance and
                  ensure student work is authentic.
                </p>
              </div>

              {/* Principle 2 */}
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center mb-4 text-slate-700">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Secure Access
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Multi-factor authentication and strict access controls limit
                  entry to verified individuals only.
                </p>
              </div>

              {/* Principle 3 */}
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center mb-4 text-slate-700">
                  <FileCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Auditability
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Comprehensive logging of all interactions within the system
                  for post-exam review and verification.
                </p>
              </div>

              {/* Principle 4 */}
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center mb-4 text-slate-700">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Fair Assessment
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Standardized environments and consistent delivery mechanisms
                  to ensure equity for all candidates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: How It Works */}
        <section
          id="process"
          className="py-20 bg-white border-b border-gray-100"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12 tracking-tight">
              Examination Workflow
            </h2>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-900 text-slate-900 font-bold text-sm">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Login with Identity Verification
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                    Students log in using institutional credentials. Identity is
                    verified via MFA or biometric checks before proceeding.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-900 text-slate-900 font-bold text-sm">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Pre-Exam Checks
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                    System environment checks (camera, microphone, browser lock)
                    and adherence to exam rules are confirmed.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-900 text-slate-900 font-bold text-sm">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Secure Exam Access
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                    Access to exam content is granted only at the scheduled
                    time. Browser locking mechanisms prevent external
                    navigation.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-900 text-slate-900 font-bold text-sm">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Monitored Attempt
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                    The session is monitored (proctored) automatically or by
                    human supervisors to flag anomalies.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-900 text-slate-900 font-bold text-sm">
                    5
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Verified Submission
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                    Responses are encrypted and securely uploaded. A digital
                    receipt is generated upon successful submission.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Security & Trust */}
        <section
          id="security"
          className="py-20 bg-slate-50 border-b border-gray-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Security Standards
              </h2>
              <p className="mt-4 text-gray-600 max-w-3xl">
                We adhere to strict data protection protocols and security best
                practices to safeguard assessment data and user privacy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <UserCheck className="h-6 w-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Secure Authentication
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    Utilizes robust identity management including multi-factor
                    authentication (MFA) to prevent unauthorized account usage.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <KeyRound className="h-6 w-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Role-Based Access Control
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    Strict permissions ensure users (Students, Lecturers,
                    Moderators) can only access data relevant to their specific
                    role.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Server className="h-6 w-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Data Protection
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    All exam data is encrypted at rest and in transit. Regular
                    backups ensure data durability and availability.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Eye className="h-6 w-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Activity Logging
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    Detailed audit logs track all significant system actions,
                    providing a transparent record for security reviews.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Call to Action */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
              Access the System
            </h2>
            <p className="text-gray-600 mb-10 max-w-xl mx-auto">
              Please log in with your university credentials. If you are a new
              staff member and require access, please contact the IT Helpdesk.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth/login"
                className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
              >
                Log In
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex justify-center items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
              >
                Register
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
