import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, LogIn, MessageCircle, Sparkles, Globe } from "lucide-react";
import { AnimatedLogo } from "@/components/ui/animated-logo";
import { useAuthContext } from "@/contexts/auth-context";

export default function LoginPage() {
  const { login, isAuthenticated, user, logout } = useAuthContext();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-border/40"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <AnimatedLogo size={28} animated={false} />
              <span className="font-display font-medium text-sm text-foreground">SEED Resort</span>
            </div>
          </Link>
          <Link href="/">
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </Link>
        </div>
      </motion.header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-lg p-8 sm:p-10">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex flex-col items-center mb-8"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-md shadow-primary/20">
                <AnimatedLogo size={32} animated />
              </div>
              <h1 className="text-xl font-display font-medium text-foreground">
                {isAuthenticated ? "Welcome back" : "Sign in to SEED Resort"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground text-center">
                {isAuthenticated
                  ? `Signed in as ${user?.firstName || user?.email || "Guest"}`
                  : "Access your saved conversations and personalized concierge experience."}
              </p>
            </motion.div>

            {isAuthenticated ? (
              /* Signed in state */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <Link href="/chat">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Continue to Chat
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Sign out
                </motion.button>
              </motion.div>
            ) : (
              /* Sign in options */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                {/* Primary: Replit Sign In */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={login}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "linear-gradient(135deg, #5A8F6E 0%, #2D5A3D 100%)",
                    color: "white",
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Sign in with Replit
                </motion.button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/60" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs text-muted-foreground/60">or continue as</span>
                  </div>
                </div>

                {/* Guest option */}
                <Link href="/chat">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    Guest (no sign-in required)
                  </motion.button>
                </Link>
              </motion.div>
            )}

            {/* Info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-6 text-center text-xs text-muted-foreground/60 leading-relaxed"
            >
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              Guest chats are not saved.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
