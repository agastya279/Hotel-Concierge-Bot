import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function ParallaxDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <section ref={ref} className="relative h-[50vh] min-h-[400px] overflow-hidden">
      {/* Background layer */}
      <motion.div
        className="absolute inset-0"
        style={{ y, scale }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </motion.div>

      {/* Content overlay */}
      <motion.div
        className="relative z-10 h-full flex items-center justify-center text-center px-4"
        style={{ opacity }}
      >
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono-label text-white/70 mb-4"
          >
            EXPERIENCE SEED RESORT
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-white leading-tight"
          >
            WHERE LUXURY MEETS
            <br />
            <span className="text-white/80">NATURE</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-white/60 max-w-lg mx-auto"
          >
            Nestled between pristine beaches and lush tropical gardens, SEED Resort offers an unforgettable escape where every detail is curated for your perfect stay.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
