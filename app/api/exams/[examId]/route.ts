import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import { Exam, Question } from "@/models/Exam";
import { Role } from "@/lib/rbac-definitions";

// GET /api/exams/[examId] - Fetch single exam details + questions
export async function GET(req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  
  try {
      const exam = await Exam.findById(examId).lean();
      if (!exam) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

      const questions = await Question.find({ examId: examId }).lean();

      return NextResponse.json({ exam, questions });
  } catch (e) {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/exams/[examId] - Update exam details
export async function PUT(req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
    const { examId } = await params;
    const session = await getSession();
    if (!session || session.role !== Role.LECTURER) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    await dbConnect();

    try {
        const body = await req.json();
        const { title, description, durationMinutes, price } = body;

        const exam = await Exam.findByIdAndUpdate(examId, {
            title, description, durationMinutes, price
        }, { new: true });

        if (!exam) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

        return NextResponse.json({ exam });
    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
