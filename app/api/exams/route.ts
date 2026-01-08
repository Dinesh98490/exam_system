import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import dbConnect from "@/lib/mongoose";
import { Exam } from "@/models/Exam";
import { Role } from "@/lib/rbac-definitions";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== Role.LECTURER && session.role !== Role.ADMIN)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, durationMinutes, price } = body;

    if (!title || !durationMinutes) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const exam = await Exam.create({
      title,
      description,
      durationMinutes: Number(durationMinutes),
      price: Number(price) || 0,
      status: "PUBLISHED", // Auto-publish for simplicity in this demo
      questions: [] // Questions added separately or via update
    });

    return NextResponse.json({ message: "Exam created successfully", examId: exam._id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
