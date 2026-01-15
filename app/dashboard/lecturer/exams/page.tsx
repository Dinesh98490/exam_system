import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import { Exam } from "@/models/Exam";
import { redirect } from "next/navigation";
import { Role } from "@/lib/rbac-definitions";
import { Plus, GraduationCap } from "lucide-react";
import Link from "next/link";
import ExamTable from "./ExamTable";

export const metadata = {
  title: "Manage Examinations | Lecturer Portal",
};

export default async function ManageExamsPage() {
  const session = await getSession();
  if (!session || session.role !== Role.LECTURER) redirect("/login");

  await dbConnect();

  // Fetch all exams
  const exams = await Exam.find({}).sort({ createdAt: -1 }).lean();

  // Convert _id to string for the client component
  const formattedExams = exams.map((exam: any) => ({
    ...exam,
    _id: exam._id.toString(),
    createdAt: exam.createdAt?.toISOString(),
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Manage Examinations
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Create, update and oversee your academic assessments.
            </p>
          </div>
        </div>
        <Link href="/dashboard/lecturer/create">
          <button className="w-full md:w-auto bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5" />
            Create Assessment
          </button>
        </Link>
      </div>

      {/* Main Table Content */}
      <ExamTable initialExams={formattedExams} />

      {/* Footer Info */}
      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
        <div className="bg-blue-100 p-1 rounded-full mt-0.5">
          <Plus className="h-3 w-3 text-blue-600" />
        </div>
        <p className="text-sm text-blue-700 leading-relaxed">
          Tip: <strong>Published</strong> exams are immediately visible to students on their dashboard. Use <strong>Draft</strong> status for assessments that are still in progress.
        </p>
      </div>
    </div>
  );
}
