import { useLocation } from "wouter";
import { Sparkles, ArrowRight, MapPin, Coffee, Car, Clock, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateOpenaiConversation, getListOpenaiConversationsQueryKey } from "@workspace/api-client-react";
import { useAuthContext } from "@/contexts/auth-context";

const suggestions = [
  { label: "Recommend local restaurants", icon: MapPin },
  { label: "Book a wellness session", icon: Coffee },
  { label: "Arrange airport transfer", icon: Car },
  { label: "What are tonight's dining hours?", icon: Clock },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function WelcomePage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthContext();
  const { mutate: createConv, isPending } = useCreateOpenaiConversation();

  const handleStart = (suggestion?: string) => {
    if (isAuthenticated) {
      createConv(
        { data: { title: suggestion || "New Request" } },
        {
          onSuccess: (newConv) => {
            queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
            const path = suggestion
              ? `/c/${newConv.id}?init=${encodeURIComponent(suggestion)}`
              : `/c/${newConv.id}`;
            setLocation(path);
          },
        }
      );
    } else {
      const path = suggestion
        ? `/chat?init=${encodeURIComponent(suggestion)}`
        : "/chat";
      setLocation(path);
    }
  };

  return (
    <div className="flex-1 w-full h-full relative flex items-center overflow-hidden">
      {/* Ken Burns background */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.04 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
      >
        <img
          src={`${import.meta.env.BASE_URL}images/seed-resort-bg.png`}
          alt="Seed Resort"
          className="w-full h-full object-cover"
          style={{ objectPosition: "65% 50%" }}
        />
      </motion.div>

      {/* Layered overlays */}
      <div className="absolute inset-0 z-[1] bg-black/45" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      {/* Vignette pulse */}
      <motion.div
        className="absolute inset-0 z-[3] rounded-none pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Shimmer line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px z-[4]"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(82,183,136,0.6) 50%, transparent 100%)" }}
        animate={{ opacity: [0.2, 1, 0.2], scaleX: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-[5] w-full max-w-2xl px-8 md:px-12 flex flex-col items-start"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-7">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/8 backdrop-blur-md text-white/70 text-[11px] font-semibold tracking-[0.15em] uppercase">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            AI Concierge · Available 24 / 7
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemVariants} className="mb-5">
          <h1
            className="text-5xl md:text-[4.5rem] font-bold leading-[1.04] tracking-[-0.02em] text-white"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            Welcome to
          </h1>
          <h1
            className="text-5xl md:text-[4.5rem] font-bold leading-[1.04] tracking-[-0.02em]"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              background: "linear-gradient(135deg, #a7f3d0 0%, #52b788 45%, #95d5b2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            SEED Resort
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-white/55 font-light max-w-sm mb-10 leading-relaxed"
        >
          Where luxury meets innovation in the heart of paradise. Ask Aria anything about your stay.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="mb-12 flex flex-wrap items-center gap-3">
          {/* Primary — Start a Conversation */}
          <motion.button
            onClick={() => handleStart()}
            disabled={isPending}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden transition-shadow duration-300 disabled:opacity-60 disabled:pointer-events-none"
            style={{
              background: "linear-gradient(135deg, #52b788 0%, #2d6a4f 100%)",
              boxShadow: "0 0 0 0 rgba(82,183,136,0)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(82,183,136,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 rgba(82,183,136,0)";
            }}
          >
            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 rounded-2xl" />
            <Sparkles className="w-4 h-4 relative z-10" />
            <span className="relative z-10 tracking-wide">
              {isPending ? "Starting…" : "Start a Conversation"}
            </span>
            <motion.span
              className="relative z-10"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </motion.button>

          {/* Secondary — Reserve Your Stay */}
          <motion.a
            href="https://legendary-manatee-c69f26.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden cursor-pointer select-none"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 0 0 rgba(255,255,255,0)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255,255,255,0.12)";
              el.style.borderColor = "rgba(167,243,208,0.45)";
              el.style.boxShadow = "0 8px 30px rgba(82,183,136,0.2), inset 0 1px 0 rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255,255,255,0.06)";
              el.style.borderColor = "rgba(255,255,255,0.18)";
              el.style.boxShadow = "0 0 0 0 rgba(255,255,255,0)";
            }}
          >
            {/* Animated shimmer sweep */}
            <motion.span
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 35%, rgba(167,243,208,0.12) 50%, transparent 65%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
            />
            <ExternalLink className="w-4 h-4 relative z-10 text-emerald-300/80" />
            <span className="relative z-10 tracking-wide text-white/90">Reserve Your Stay</span>
            <motion.span
              className="relative z-10"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            >
              <ArrowRight className="w-4 h-4 text-emerald-300/70" />
            </motion.span>
          </motion.a>
        </motion.div>

        {/* Quick suggestion chips */}
        <motion.div variants={itemVariants}>
          <p className="text-[10px] text-white/35 uppercase tracking-[0.18em] mb-3 font-medium">
            Quick requests
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(({ label, icon: Icon }, i) => (
              <motion.button
                key={i}
                onClick={() => handleStart(label)}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.07, duration: 0.4, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.07] backdrop-blur-md border border-white/[0.12] text-white/65 text-xs font-medium hover:bg-white/[0.14] hover:border-white/25 hover:text-white transition-all duration-200 cursor-pointer"
              >
                <Icon className="w-3 h-3 text-emerald-400/80" />
                {label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
