import { motion } from "framer-motion";
import { Zap, Droplets, Recycle, Sprout, Sun, Wind, TreePine, Leaf } from "lucide-react";

const pillars = [
  {
    icon: Sun,
    title: "Solar Parking Canopies",
    description: "Every parking spot sits under a solar canopy that generates clean energy while shielding vehicles from the sun.",
  },
  {
    icon: Wind,
    title: "On-Site Wind Turbines",
    description: "Vertical-axis turbines capture coastal breezes to supplement the solar array, ensuring 24/7 renewable coverage.",
  },
  {
    icon: Zap,
    title: "AI Power Routing",
    description: "An intelligent grid directs energy dynamically to high-traffic zones — pools, restaurants, and event spaces — based on real-time demand.",
  },
  {
    icon: Droplets,
    title: "Rainwater Harvesting",
    description: "Extensive catchment systems collect tropical rainfall to feed greenhouse irrigation and resort landscaping.",
  },
  {
    icon: Recycle,
    title: "Greywater Recycling",
    description: "Water from sinks and showers is treated and reused, cutting fresh water consumption by over 60%.",
  },
  {
    icon: Sprout,
    title: "Agritech Greenhouse Farms",
    description: "On-site organic produce grown with AI-driven Crop Yield Predictors. The harvest directly supplies our restaurants.",
  },
];

export function SustainabilitySection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary/[0.02] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.03] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/[0.02] blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-5"
          >
            <Leaf className="w-3.5 h-3.5" />
            100% RENEWABLE ENERGY
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-display font-medium text-foreground"
          >
            A SELF-SUFFICIENT ISLAND
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-muted-foreground max-w-xl mx-auto"
          >
            SEED Resort operates as an energy-independent microgrid. Zero grid dependency. Zero fossil fuels. Every watt comes from the sun, wind, and rain.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group p-6 rounded-2xl bg-white border border-border/60 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-500/15 transition-all duration-300">
                <p.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: "100%", label: "Renewable Energy" },
            { value: "60%", label: "Water Recycled" },
            { value: "0", label: "Grid Dependency" },
            { value: "Zero", label: "Waste to Landfill" },
          ].map((s) => (
            <div key={s.label} className="text-center p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">
              <p className="text-2xl font-display font-medium text-emerald-700">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
