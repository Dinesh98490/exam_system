import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth/session";


// logout handler request
export async function POST(req: Request) {
  await deleteSession();
  return NextResponse.redirect(new URL("/login", req.url));
}
