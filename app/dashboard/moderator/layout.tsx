import { ModeratorSidebar } from "./components/ModeratorSidebar";

export default function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ModeratorSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
