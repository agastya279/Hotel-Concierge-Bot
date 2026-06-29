import { ReactNode } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "./sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const isLanding = location === "/";

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {!isLanding && <Sidebar />}
      <main className={isLanding ? "flex-1 h-full flex flex-col relative overflow-y-auto" : "flex-1 h-full flex flex-col relative pt-16 md:pt-0"}>
        {children}
      </main>
    </div>
  );
}
