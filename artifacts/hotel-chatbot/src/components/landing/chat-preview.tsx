import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Send, Check } from "lucide-react";

const demoMessages = [
  { from: "user", text: "I’d like to book a spa appointment for tomorrow at 3pm.", delay: 800 },
  { from: "bot", text: "Absolutely! I’ve checked our spa schedule and the Tranquility Suite is available tomorrow at 3pm. Would you prefer a 60-minute deep tissue massage or a 90-minute hot stone treatment?", delay: 2200 },
  { from: "user", text: "The 90-minute hot stone sounds perfect.", delay: 1800 },
  { from: "bot", text: "Wonderful choice! I’ve reserved the Tranquility Suite for you tomorrow at 3:00 PM — 90-minute hot stone massage. You’ll receive a confirmation text shortly. Anything else I can help with?", delay: 2500 },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export function ChatPreview() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    if (visibleCount >= demoMessages.length) return;

    const msg = demoMessages[visibleCount];
    setIsTyping(true);

    const timer = setTimeout(() => {
      setIsTyping(false);
      setVisibleCount((c) => c + 1);
    }, msg.delay);

    return () => clearTimeout(timer);
  }, [visibleCount, hasStarted]);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-mono-label text-primary/70"
          >
            LIVE PREVIEW
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-display font-medium text-foreground mt-3"
          >
            SEE ARIA IN ACTION
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-border/60 bg-white shadow-xl overflow-hidden max-w-xl mx-auto"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/40 flex items-center gap-3 bg-muted/20">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Aria</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="px-4 py-4 space-y-3 min-h-[280px] max-h-[360px] overflow-y-auto">
            <AnimatePresence>
              {demoMessages.slice(0, visibleCount).map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={`flex gap-2 ${msg.from === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center ${msg.from === "user" ? "bg-muted" : "bg-primary"}`}>
                    {msg.from === "user" ? (
                      <User className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <Bot className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                  <div
                    className={`px-3 py-2 rounded-xl text-sm max-w-[80%] leading-relaxed ${
                      msg.from === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.text}
                    {msg.from === "bot" && i === 3 && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="inline-flex items-center gap-1 ml-2 text-emerald-500"
                      >
                        <Check className="w-3 h-3" />
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <div className="px-3 py-2.5 rounded-xl bg-muted">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input + replay button */}
          <div className="px-4 py-3 border-t border-border/40 bg-muted/10">
            {!hasStarted || visibleCount >= demoMessages.length ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setVisibleCount(0); setHasStarted(true); }}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {hasStarted ? "Replay Demo" : "Start Demo"}
              </motion.button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-white">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary/40 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
