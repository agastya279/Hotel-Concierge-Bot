import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

export function CTABanner() {
  const [, setLocation] = useLocation();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto text-center relative"
      >
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20"
        >
          <MessageCircle className="w-8 h-8 text-primary-foreground" />
        </motion.div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-foreground leading-tight">
          READY TO MEET YOUR
          <br />
          <span className="text-gradient-brand">AI CONCIERGE?</span>
        </h2>

        <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
          Start chatting with Aria now. No sign-up required — just ask for what you need.
        </p>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setLocation("/chat")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Start Chatting Now
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
