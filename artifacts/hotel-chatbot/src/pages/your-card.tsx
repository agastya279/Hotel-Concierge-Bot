import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  LogOut,
  MessageCircle,
  Mail,
  Calendar,
  Shield,
  ChevronRight,
} from "lucide-react";
import { AnimatedLogo } from "@/components/ui/animated-logo";
import { useAuthContext } from "@/contexts/auth-context";

export default function YourCardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuthContext();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <AnimatedLogo size={40} animated />
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const initials = user?.firstName?.[0] || user?.email?.[0] || "?";

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
          <Link href="/chat">
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Chat
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
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-lg overflow-hidden">
            {/* Card header with gradient */}
            <div
              className="h-32 relative"
              style={{
                background: "linear-gradient(135deg, #2D5A3D 0%, #5A8F6E 50%, #7EB89A 100%)",
              }}
            >
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            {/* Avatar */}
            <div className="px-8 -mt-12 relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden"
              >
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.firstName || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-display font-bold text-primary">
                    {initials.toUpperCase()}
                  </span>
                )}
              </motion.div>
            </div>

            {/* User info */}
            <div className="px-8 pt-4 pb-6">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-xl font-display font-medium text-foreground">
                  {user?.firstName || "Guest"}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">{user?.email || "No email provided"}</p>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3 mt-5"
              >
                <div className="flex-1 p-3 rounded-xl bg-muted/50 border border-border/40 text-center">
                  <p className="text-lg font-semibold text-foreground">0</p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Conversations</p>
                </div>
                <div className="flex-1 p-3 rounded-xl bg-muted/50 border border-border/40 text-center">
                  <p className="text-lg font-semibold text-foreground">New</p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Member</p>
                </div>
              </motion.div>

              {/* Action list */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 space-y-2"
              >
                <Link href="/chat">
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Start a Conversation</p>
                      <p className="text-xs text-muted-foreground">Chat with Aria, your AI concierge</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </Link>

                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-xs text-muted-foreground">{user?.email || "Not set"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Member Since</p>
                    <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Account Status</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">
                    Verified
                  </span>
                </div>
              </motion.div>

              {/* Sign out */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 pt-4 border-t border-border/40"
              >
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
