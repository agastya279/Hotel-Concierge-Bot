import { ReactNode } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "./sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

const LANDING_PATHS = ["/", "/login", "/sign-in", "/sign-up", "/terms", "/privacy"];

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const isLanding = LANDING_PATHS.includes(location);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {!isLanding && <Sidebar />}
      <main className={isLanding ? "flex-1 h-full flex flex-col relative overflow-y-auto" : "flex-1 h-full flex flex-col relative pt-16 md:pt-0"}>
        {children}
      </main>
    </div>
  );
}
