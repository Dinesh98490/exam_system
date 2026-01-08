"use client";

import { usePathname } from "next/navigation";

export function HeaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide global header on landing page
  if (pathname === "/") {
    return null;
  }

  return <>{children}</>;
}
