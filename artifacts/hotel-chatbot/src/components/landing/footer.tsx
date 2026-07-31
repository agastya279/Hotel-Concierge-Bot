import { LogoBadge } from "@/components/ui/animated-logo";
import { Link } from "wouter";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5"
          >
            <LogoBadge size={20} />
            <span className="font-display font-medium text-sm text-foreground">SEED Resort</span>
          </motion.div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SEED Resort. AI concierge powered by frontier language models.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/chat" className="hover:text-foreground transition-colors relative group">
              Chat
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors relative group">
              Privacy
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors relative group">
              Terms
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
