import { LecturerSidebar } from "./components/LecturerSidebar";

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <LecturerSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
