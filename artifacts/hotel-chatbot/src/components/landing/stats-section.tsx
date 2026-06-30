import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Bed, UtensilsCrossed, Globe, Clock, Zap, Cpu } from "lucide-react";

const stats = [
  { icon: Bed, value: 5, suffix: "", label: "Room Types", color: "from-primary/20 to-primary/5" },
  { icon: UtensilsCrossed, value: 4, suffix: "", label: "Restaurants", color: "from-primary/15 to-primary/5" },
  { icon: Globe, value: 20, suffix: "+", label: "Languages", color: "from-primary/20 to-primary/5" },
  { icon: Clock, value: 24, suffix: "/7", label: "Concierge", color: "from-primary/15 to-primary/5" },
  { icon: Zap, value: 100, suffix: "%", label: "Renewable Energy", color: "from-amber-500/20 to-amber-500/5" },
  { icon: Cpu, value: 0, suffix: "ms", label: "Safety Response", display: "<50ms", color: "from-emerald-500/20 to-emerald-500/5" },
];

function Counter({ value, suffix, display }: { value: number; suffix: string; display?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (display) { setCount(value); return; }
    let start = 0;
    const duration = 2000;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value, display]);

  return (
    <span ref={ref}>
      {display || <>{count}{suffix}</>}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/[0.03] blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-mono-label text-primary/70">BY THE NUMBERS</span>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-foreground mt-3">
            TECHNOLOGY AT YOUR FINGERTIPS
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative group p-6 rounded-2xl bg-white border border-border/60 hover:border-primary/20 transition-all duration-300"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-4xl sm:text-5xl font-display font-medium text-foreground tracking-tight">
                  <Counter value={stat.value} suffix={stat.suffix} display={stat.display} />
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
