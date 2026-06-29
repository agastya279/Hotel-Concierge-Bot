import { useLocation } from "wouter";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useAuthContext } from "@/contexts/auth-context";
import { AmbientBackground } from "./ambient-background";

function AnimatedHeadline({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 40, rotateX: -40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

function MagneticButton({ children, className, onClick, variant = "primary" }: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline";
  onClick?: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.25);
    y.set((e.clientY - cy) * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

export function Hero() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuthContext();

  const handleChat = () => {
    setLocation(isAuthenticated ? "/chat" : "/chat");
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <AmbientBackground />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-5xl mx-auto text-center relative">
        {/* Badge pill with shimmer */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-flex"
        >
          <a
            href="/chat"
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all group overflow-hidden"
          >
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            />
            <span className="relative flex items-center gap-1.5 text-xs font-medium text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              New
            </span>
            <span className="relative w-px h-3 bg-border" />
            <span className="relative">AI Concierge now available</span>
            <ArrowRight className="relative w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* Animated headline */}
        <h1 className="mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-medium tracking-tight text-foreground leading-[1.05] perspective-[1000px]">
          <AnimatedHeadline text="Your personal AI" delay={0.1} />
          <br />
          <span className="text-gradient-brand inline-block">
            <AnimatedHeadline text="concierge." delay={0.4} />
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Aria handles everything about your stay — room bookings, dining reservations,
          spa appointments, local recommendations, and 24/7 guest support.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <MagneticButton
            variant="primary"
            onClick={handleChat}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm active:scale-[0.98]"
          >
            Start a Conversation
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
          <a
            href="https://legendary-manatee-c69f26.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MagneticButton
              variant="outline"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors active:scale-[0.98]"
            >
              Reserve Your Stay
            </MagneticButton>
          </a>
        </motion.div>

        {/* Trust badges */}
        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground"
        >
          {[
            "No credit card required",
            "Guest mode available",
            "24/7 availability",
          ].map((text, i) => (
            <motion.span
              key={text}
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 + i * 0.15, duration: 0.4, type: "spring" }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
              {text}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
