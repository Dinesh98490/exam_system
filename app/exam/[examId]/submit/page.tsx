import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function SubmitSuccessPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="bg-green-50 p-4 rounded-full mb-6">
        <CheckCircle className="h-16 w-16 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Examination Submitted
      </h1>
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        Your answers have been securely recorded. You may now close this window
        or return to the dashboard.
      </p>

      <Link
        href="/dashboard/student"
        className="flex items-center gap-2 text-primary font-bold hover:underline"
      >
        Return to Dashboard <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
