import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/contexts/auth-context";
import { AnimatedLogo } from "@/components/ui/animated-logo";

const navLinks = [
  { label: "Chat", href: "/chat" },
  { label: "Wellness", href: "/wellness-studio" },
  { label: "Features", href: "#features" },
  { label: "Reviews", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user, logout } = useAuthContext();
  const isHome = location === "/";
  return <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .6, ease: "easeOut" }} className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-white/70 backdrop-blur-xl">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="flex h-16 items-center justify-between">
      <Link href="/"><motion.div className="flex cursor-pointer items-center gap-2.5" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}><AnimatedLogo size={32} animated={false}/><span className="font-display text-lg font-medium text-foreground">SEED Resort</span></motion.div></Link>
      <div className="hidden items-center gap-1 md:flex">{navLinks.map((link, index) => <motion.a key={link.label} href={link.href} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4, delay: .1 + index * .05 }} className={cn("group relative rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground", link.href.startsWith("#") && !isHome && "pointer-events-none opacity-50")}>{link.label}<motion.span className="absolute bottom-1 left-3 right-3 h-px origin-left bg-primary" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: .25 }}/></motion.a>)}</div>
      <div className="hidden items-center gap-3 md:flex">{isAuthenticated && user ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2"><span className="text-sm text-muted-foreground">{user.firstName || user.email}</span><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }} onClick={logout} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground">Sign out</motion.button></motion.div> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3"><Link href="/login"><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }} className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Sign in</motion.button></Link><Link href="/wellness-studio"><motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: .96 }} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md">Explore Wellness</motion.button></Link></motion.div>}</div>
      <motion.button whileTap={{ scale: .9 }} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} className="p-2 text-muted-foreground hover:text-foreground md:hidden" onClick={() => setMobileOpen(!mobileOpen)}><AnimatePresence mode="wait">{mobileOpen ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: .2 }}><X className="h-5 w-5"/></motion.div> : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: .2 }}><Menu className="h-5 w-5"/></motion.div>}</AnimatePresence></motion.button>
    </div></div>
    <AnimatePresence>{mobileOpen && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: .3, ease: [.22, 1, .36, 1] }} className="overflow-hidden border-t border-border/40 bg-white/95 backdrop-blur-xl md:hidden"><div className="space-y-1 px-4 py-4">{navLinks.map((link, index) => <motion.a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .05, duration: .3 }} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{link.label}</motion.a>)}<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }} className="mt-2 flex flex-col gap-2 border-t border-border/40 pt-2">{isAuthenticated ? <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full rounded-lg border border-border px-4 py-2.5 text-left text-sm font-medium text-muted-foreground">Sign out</button> : <><Link href="/login" onClick={() => setMobileOpen(false)}><button className="w-full px-4 py-2.5 text-left text-sm font-medium text-muted-foreground">Sign in</button></Link><Link href="/wellness-studio" onClick={() => setMobileOpen(false)}><button className="w-full rounded-lg bg-primary px-4 py-2.5 text-left text-sm font-medium text-primary-foreground">Explore Wellness</button></Link></>}</motion.div></div></motion.div>}</AnimatePresence>
  </motion.nav>;
}
