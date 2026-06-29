import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Do I need an account to use Aria?",
    a: "No. Guests can chat with Aria immediately without signing up. However, creating an account lets you save your conversation history and resume chats across devices.",
  },
  {
    q: "What can Aria help me with?",
    a: "Aria can handle room bookings, dining reservations, spa appointments, airport transfers, local activity recommendations, and general resort questions — all through natural conversation.",
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
    a: "Aria is fluent in over 20 languages including English, Spanish, French, German, Mandarin, Japanese, Arabic, and Portuguese. It automatically detects your language preference.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono-label text-primary/70">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-foreground mt-3">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to know about Aria.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl bg-white border border-border/60 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
              >
                <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
