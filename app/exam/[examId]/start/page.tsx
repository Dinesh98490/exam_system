import dbConnect from "@/lib/mongoose";
import { Exam } from "@/models/Exam";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Clock, AlertTriangle } from "lucide-react";
import StartExamButton from "./StartExamButton";

export default async function ExamStartPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  await dbConnect();
  const exam = await Exam.findById(examId).lean();

  if (!exam) return <div>Exam not found</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 border border-gray-200 shadow-sm rounded-sm mt-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.title}</h1>
      <p className="text-gray-600 mb-6">
        {exam.description || "No description provided."}
      </p>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
        <h3 className="font-bold text-yellow-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Important Instructions
        </h3>
        <ul className="list-disc list-inside mt-2 text-sm text-yellow-900 space-y-1">
          <li>
            You have <strong>{exam.durationMinutes} minutes</strong> to complete
            this exam.
          </li>
          <li>The timer begins immediately when you click Start.</li>
          <li>Do not refresh the page or use the back button.</li>
          <li>
            <strong>Full Screen Mode</strong> is recommended.
          </li>
          <li>
            Switching tabs will be recorded and may lead to disqualification.
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="h-5 w-5" />
          <span className="font-semibold">{exam.durationMinutes} Minutes</span>
        </div>

        <StartExamButton examId={examId} />
      </div>
    </div>
  );
}
