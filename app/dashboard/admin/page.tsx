import { redirect } from "next/navigation";

export default function AdminDashboard() {
  // Admin usually has access to everything.
  // Let's redirect to Moderator view as it contains the logs, or specific admin tools.
  // Or just render the Moderator view.
  redirect("/dashboard/moderator");
}
