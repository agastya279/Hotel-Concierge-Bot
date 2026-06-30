import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, MessageCircle, Sparkles, Hotel, Clock, Shield, ChevronRight } from "lucide-react";
import { AnimatedLogo } from "@/components/ui/animated-logo";
import { useAuthContext } from "@/contexts/auth-context";

const features = [
  {
    icon: MessageCircle,
    title: "AI Concierge Chat",
    description: "Ask Aria anything about your stay, bookings, or local recommendations.",
  },
  {
    icon: Hotel,
    title: "Room & Service Booking",
    description: "Book rooms, spa appointments, and dining reservations seamlessly.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Aria is always here to help, day or night, wherever you are.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your conversations and data are protected with enterprise-grade security.",
  },
];

export default function GetStartedPage() {
  const { user } = useAuthContext();

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
        </div>
      </motion.header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl"
        >
          {/* Welcome card */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-lg p-8 sm:p-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex flex-col items-center mb-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-md shadow-primary/20">
                <AnimatedLogo size={40} animated />
              </div>
              <h1 className="text-2xl font-display font-medium text-foreground text-center">
                Welcome to SEED Resort{user?.firstName ? `, ${user.firstName}` : ""}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
                Your account is ready. Here is everything you can do with your personal AI concierge.
              </p>
            </motion.div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                  className="p-4 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-3"
            >
              <Link href="/chat">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Start Chatting with Aria
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/your-card">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  View Your Profile Card
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
