import { redirect } from "next/navigation";

export default function ManageExamsPage() {
  // Redirect to overview for now as it lists exams
  redirect("/dashboard/lecturer");
}
