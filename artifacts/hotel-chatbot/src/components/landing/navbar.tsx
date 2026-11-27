import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/contexts/auth-context";
import { AnimatedLogo } from "@/components/ui/animated-logo";

const navLinks = [
  { label: "Chat", href: "/chat" },
  { label: "Wellness", href: "/fitness" },
  { label: "Features", href: "#features" },
  { label: "Reviews", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user, logout } = useAuthContext();
  const isHome = location === "/";

  return (
    <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/"><motion.div className="flex items-center gap-2.5 cursor-pointer" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}><AnimatedLogo size={32} animated={false} /><span className="font-display font-medium text-lg text-foreground">SEED Resort</span></motion.div></Link>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => <motion.a key={link.label} href={link.href} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }} className={cn("relative px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group", link.href.startsWith("#") && !isHome && "pointer-events-none opacity-50")}>
              {link.label}<motion.span className="absolute bottom-1 left-3 right-3 h-px bg-primary origin-left" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.25 }} />
            </motion.a>)}
          </div>
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2"><span className="text-sm text-muted-foreground">{user.firstName || user.email}</span><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={logout} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30 transition-all">Sign out</motion.button></motion.div> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3"><Link href="/login"><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sign in</motion.button></Link><Link href="/fitness"><motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }} className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm hover:shadow-md">Explore Wellness</motion.button></Link></motion.div>}
          </div>
          <motion.button whileTap={{ scale: 0.9 }} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} className="md:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            <AnimatePresence mode="wait">{mobileOpen ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X className="w-5 h-5" /></motion.div> : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu className="w-5 h-5" /></motion.div>}</AnimatePresence>
          </motion.button>
        </div>
      </div>
      <AnimatePresence>{mobileOpen && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="md:hidden bg-white/95 backdrop-blur-xl border-t border-border/40 overflow-hidden"><div className="px-4 py-4 space-y-1">
        {navLinks.map((link, i) => <motion.a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">{link.label}</motion.a>)}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="pt-2 border-t border-border/40 mt-2 flex flex-col gap-2">
          {isAuthenticated ? <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground border border-border transition-all text-left">Sign out</button> : <><Link href="/login" onClick={() => setMobileOpen(false)}><button className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left">Sign in</button></Link><Link href="/fitness" onClick={() => setMobileOpen(false)}><button className="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-left">Explore Wellness</button></Link></>}
        </motion.div>
      </div></motion.div>}</AnimatePresence>
    </motion.nav>
  );
}
