import { motion } from "framer-motion";
import { Car, Trophy, Dumbbell, Flag, Sailboat, Sparkles, Waves, Gamepad2 } from "lucide-react";

const activities = [
  {
    icon: Car,
    name: "AI Karting Track",
    tagline: "Reinforcement learning safety agent",
    detail: "Predicts collisions milliseconds in advance and wirelessly adjusts individual kart torque to prevent accidents — maximum fun, zero risk.",
    color: "from-rose-500/20 to-red-500/10",
    accent: "#B8415C",
  },
  {
    icon: Trophy,
    name: "Football Pitch",
    tagline: "Live pose estimation & ball tracking",
    detail: "Smart cameras track every player movement and ball trajectory. AI coaching feedback helps you refine technique in real time.",
    color: "from-emerald-500/20 to-green-500/10",
    accent: "#2D6A3D",
  },
  {
    icon: Dumbbell,
    name: "Tennis & Padel Courts",
    tagline: "Computer vision line calling",
    detail: "Automated line calls, swing analysis, and AI coaching feedback. Play like a pro with invisible tech guiding every shot.",
    color: "from-sky-500/20 to-blue-500/10",
    accent: "#2D5A8F",
  },
  {
    icon: Flag,
    name: "Equestrian Center",
    tagline: "Predictive health monitoring",
    detail: "Every horse has biometric health tracking. Guided trail rides through tropical forest and beachside gallops at sunrise.",
    color: "from-amber-500/20 to-yellow-500/10",
    accent: "#7A5A2D",
  },
  {
    icon: Sailboat,
    name: "Marina & Watersports",
    tagline: "Boats, jet skis & snorkeling",
    detail: "Full-service marina with rentals, guided snorkeling tours, and sunset cruises. AI weather routing ensures safe passages.",
    color: "from-cyan-500/20 to-teal-500/10",
    accent: "#2D7A7A",
  },
  {
    icon: Sparkles,
    name: "Circular Waterway Light Show",
    tagline: "Nightly AI projection spectacle",
    detail: "Every evening, the resort's circular waterway transforms into a canvas of light. AI-generated projections synchronize with music and fountain choreography.",
    color: "from-violet-500/20 to-purple-500/10",
    accent: "#5A3D8F",
  },
  {
    icon: Gamepad2,
    name: "STEM Kids Zone",
    tagline: "Interactive science & coding",
    detail: "Hands-on robotics, coding workshops, and nature science labs. Kids build their own AI projects while parents enjoy the spa.",
    color: "from-pink-500/20 to-rose-500/10",
    accent: "#8F3D5A",
  },
  {
    icon: Waves,
    name: "Infinity Pool & Beach",
    tagline: "Oceanfront relaxation",
    detail: "Infinity pools overlooking the ocean with AI-monitored water quality. Private cabanas, beach volleyball, and paddleboarding.",
    color: "from-blue-500/20 to-indigo-500/10",
    accent: "#3D5A8F",
  },
];

export function SportsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-mono-label text-primary/70"
          >
            SPORTS & ADVENTURE
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-display font-medium text-foreground mt-3"
          >
            PLAY SMARTER, PLAY SAFER
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-muted-foreground max-w-xl mx-auto"
          >
            From AI-powered karting safety to computer vision tennis coaching, every activity is enhanced by intelligent systems.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activities.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group flex gap-5 p-6 rounded-2xl bg-white border border-border/60 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <div className={`shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <a.icon className="w-6 h-6" style={{ color: a.accent }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-foreground">{a.name}</h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{a.tagline}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
