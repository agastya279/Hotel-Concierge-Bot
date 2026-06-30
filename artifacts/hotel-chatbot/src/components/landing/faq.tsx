import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Do I need an account to use Aria?",
    a: "No. Guests can chat with Aria immediately without signing up. However, creating an account lets you save your conversation history, receive a Stay Highlights Recap on departure, and resume chats across devices.",
  },
  {
    q: "What can Aria help me with?",
    a: "Aria can handle room bookings, dining reservations, spa appointments, airport transfers, local activity recommendations, sports facility bookings, and general resort questions — all through natural conversation in over 20 languages.",
  },
  {
    q: "How does the facial recognition check-in work?",
    a: "At the grand entrance gates, AI Security Kiosks scan your face for frictionless check-in — no queues, no paperwork. The same system provides seamless handoff between services throughout your stay.",
  },
  {
    q: "Is my conversation data private?",
    a: "Absolutely. Guest conversations are not stored unless you create an account. For signed-in users, your data is encrypted and only accessible to you. We never share or sell guest data.",
  },
  {
    q: "Can Aria make real bookings?",
    a: "Aria guides you through the booking process and connects you to our reservation system. For complex requests, Aria can escalate to our human concierge team seamlessly.",
  },
  {
    q: "What languages does Aria support?",
    a: "Aria is fluent in over 20 languages including English, Spanish, French, German, Mandarin, Japanese, Arabic, Portuguese, Hindi, and Italian. It automatically detects your language preference.",
  },
  {
    q: "What is the AI Karting Track?",
    a: "Our winding karting track is governed by a reinforcement learning safety agent that predicts collision probabilities milliseconds in advance and wirelessly adjusts individual kart torque to prevent accidents — fun with total safety.",
  },
  {
    q: "How is the resort powered?",
    a: "SEED Resort operates as a self-sufficient energy island. Our Microgrid combines Solar Parking Canopies and on-site Wind Turbines to deliver 100% renewable energy, with AI Power Routing directing power dynamically based on real-time demand.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-mono-label text-primary/70"
          >
            FAQ
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-display font-medium text-foreground mt-3"
          >
            Frequently asked questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-muted-foreground"
          >
            Everything you need to know about Aria and SEED Resort.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="space-y-3"
        >
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
              className="rounded-xl bg-white border border-border/60 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors group"
              >
                <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, delay: 0.05 }}
                      className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed"
                    >
                      {faq.a}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
