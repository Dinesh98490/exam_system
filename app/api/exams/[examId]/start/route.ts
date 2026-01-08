import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import { Exam, Question } from "@/models/Exam";
import { ExamAttempt } from "@/models/ExamAttempt";

export async function POST(req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { examId } = await params;
  await dbConnect();

  const exam = await Exam.findById(examId);
  if (!exam) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

  // Check if already attempted/in-progress
  let attempt = await ExamAttempt.findOne({ userId: session.userId, examId: examId, completedAt: null });
  
  if (!attempt) {
      // Create new attempt
      attempt = await ExamAttempt.create({
          userId: session.userId,
          examId: examId,
          startTime: new Date()
      });
  }

  // Fetch questions (hide correct answers)
  const questions = await Question.find({ examId: examId }).select('-correctOptionIndex');

  const formattedQuestions = questions.map(q => ({
      id: q._id,
      text: q.text,
      options: q.options,
      points: q.points
  }));

  const expiresAt = new Date(attempt.startTime.getTime() + exam.durationMinutes * 60000);

  return NextResponse.json({
      attemptId: attempt._id,
      questions: formattedQuestions,
      expiresAt: expiresAt
  });
}
