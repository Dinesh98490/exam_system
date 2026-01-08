import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import { Exam, Question } from "@/models/Exam";
import { ExamAttempt } from "@/models/ExamAttempt";

export async function POST(req: NextRequest, { params }: { params: Promise<{ attemptId: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { attemptId } = await params;
  const { answers, finish } = await req.json();

  await dbConnect();

  const attempt = await ExamAttempt.findOne({ _id: attemptId }); // Allow owner check?
  
  if (!attempt) return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  
  if (attempt.userId.toString() !== session.userId) {
      return NextResponse.json({ error: "Unauthorized Attempt" }, { status: 403 });
  }

  // Update answers
  attempt.answers = answers;
  await attempt.save();

  if (finish) {
      // Grading Logic
      const questions = await Question.find({ examId: attempt.examId });
      let score = 0;
      let totalPoints = 0;

      answers.forEach((ans: any) => {
          const question = questions.find(q => q._id.toString() === ans.questionId);
          if (question) {
              totalPoints += question.points || 0;
              if (question.correctOptionIndex === ans.selectedOptionIndex) {
                  score += question.points || 0;
              }
          }
      });

      attempt.score = score;
      attempt.completedAt = new Date();
      await attempt.save();
      
      return NextResponse.json({ message: "Exam submitted", score, totalPoints });
  }

  return NextResponse.json({ message: "Progress saved" });
}
