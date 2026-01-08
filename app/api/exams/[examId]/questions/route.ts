import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import { Question } from "@/models/Exam";
import { Role } from "@/lib/rbac-definitions";

export async function POST(req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  const session = await getSession();
  if (!session || session.role !== Role.LECTURER) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { text, options, correctOptionIndex, points } = body;

    // Validation
    if (!text || !options || options.length < 2 || correctOptionIndex === undefined) {
         return NextResponse.json({ error: "Invalid question data" }, { status: 400 });
    }

    await dbConnect();

    const question = await Question.create({
        examId: examId,
        text,
        options,
        correctOptionIndex,
        points: points || 1
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
