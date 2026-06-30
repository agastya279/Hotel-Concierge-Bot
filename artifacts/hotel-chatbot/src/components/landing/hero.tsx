import React from "react";
import { useLocation } from "wouter";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useAuthContext } from "@/contexts/auth-context";
import mountainBg from "@assets/kalen-emsley-Bkci_8qcdvQ-unsplash_1782823355979.jpg";

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
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const handleChat = () => {
    setLocation(isAuthenticated ? "/chat" : "/chat");
  };

  return (
    <section
      ref={ref}
      className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[85vh] flex items-center"
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 -top-20 -bottom-20"
        style={{
          y,
          backgroundImage: `url(${mountainBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />

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
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-sm text-white/80 hover:text-white hover:border-white/40 transition-all group overflow-hidden"
          >
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            />
            <span className="relative flex items-center gap-1.5 text-xs font-medium text-white">
              <Sparkles className="w-3.5 h-3.5" />
              New
            </span>
            <span className="relative w-px h-3 bg-white/30" />
            <span className="relative">AI Concierge now available</span>
            <ArrowRight className="relative w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* Animated headline */}
        <h1 className="mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-medium tracking-tight text-white leading-[1.05] perspective-[1000px]">
          <AnimatedHeadline text="Your personal AI" delay={0.1} />
          <br />
          <span className="text-white/80 inline-block">
            <AnimatedHeadline text="concierge." delay={0.4} />
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
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
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/30 text-sm font-semibold text-white hover:bg-white/15 backdrop-blur-sm transition-colors active:scale-[0.98]"
            >
              Reserve Your Stay
            </MagneticButton>
          </a>
        </motion.div>

        {/* Trust badges */}
        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-white/70"
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
                className="w-1.5 h-1.5 rounded-full bg-white"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
              {text}
            </motion.span>
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex justify-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <a href="#features" className="text-white/60 hover:text-white transition-colors">
            <ChevronDown className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
