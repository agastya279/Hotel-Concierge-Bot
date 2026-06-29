import { Hotel } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Hotel className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-display font-normal text-sm text-foreground">SEED Resort</span>
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
