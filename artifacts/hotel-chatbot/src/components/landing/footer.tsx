import { LogoBadge } from "@/components/ui/animated-logo";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <LogoBadge size={20} />
            <span className="font-display font-medium text-sm text-foreground">SEED Resort</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SEED Resort. AI concierge powered by frontier language models.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="/chat" className="hover:text-foreground transition-colors">Chat</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
