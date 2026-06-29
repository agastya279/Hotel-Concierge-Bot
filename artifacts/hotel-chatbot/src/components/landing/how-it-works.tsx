import { motion } from "framer-motion";
import { MessageSquare, Sparkles, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Start a Chat",
    description: "Open Aria and tell her what you need — a room, a dinner reservation, or a spa treatment.",
  },
  {
    icon: Sparkles,
    title: "Get Recommendations",
    description: "Aria suggests the best options based on your preferences, the season, and real-time availability.",
  },
  {
    icon: CalendarCheck,
    title: "Book Instantly",
    description: "Confirm your choice and Aria handles the reservation. You’ll receive confirmation in seconds.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-mono-label text-primary/70"
          >
            HOW IT WORKS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-display font-medium text-foreground mt-3"
          >
            THREE SIMPLE STEPS
          </motion.h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[72px] left-[16.66%] right-[16.66%] h-px">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 origin-center"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="text-center relative"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                  className="w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-5 shadow-lg shadow-primary/20"
                >
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <step.icon className="w-7 h-7 text-primary-foreground" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
