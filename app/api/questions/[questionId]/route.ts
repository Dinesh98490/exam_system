import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import { Question } from "@/models/Exam";
import { Role } from "@/lib/rbac-definitions";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ questionId: string }> }) {
  const { questionId } = await params;
  const session = await getSession();
  if (!session || session.role !== Role.LECTURER) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
      const q = await Question.findByIdAndDelete(questionId);
      if (!q) return NextResponse.json({ error: "Question not found" }, { status: 404 });
      
      return NextResponse.json({ message: "Deleted" });
  } catch (error) {
      return NextResponse.json({ error: "Error deleting" }, { status: 500 });
  }
}
