import { motion } from "framer-motion";
import { Users, Wifi, Waves, Mountain } from "lucide-react";

const rooms = [
  {
    name: "Ocean Suite",
    tagline: "Wake to the sound of waves",
    guests: 2,
    perks: ["Ocean View", "King Bed", "Private Balcony"],
    icon: Waves,
    color: "from-emerald-500/20 to-teal-500/10",
    accent: "#2D5A3D",
  },
  {
    name: "Garden Villa",
    tagline: "Surrounded by tropical serenity",
    guests: 4,
    perks: ["Garden Access", "Two Bedrooms", "Outdoor Shower"],
    icon: Mountain,
    color: "from-green-500/20 to-emerald-500/10",
    accent: "#3D6B4D",
  },
  {
    name: "Sunset Penthouse",
    tagline: "Panoramic views from above",
    guests: 2,
    perks: ["Rooftop Terrace", "Jacuzzi", "Butler Service"],
    icon: Wifi,
    color: "from-amber-500/20 to-orange-500/10",
    accent: "#5A4A3D",
  },
];

export function RoomShowcase() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-mono-label text-primary/70"
          >
            ACCOMMODATIONS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-display font-medium text-foreground mt-3"
          >
            CURATED SPACES FOR EVERY STAY
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {rooms.map((room, i) => (
            <motion.div
              key={room.name}
              initial={{ opacity: 0, y: 40, rotateX: -8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative rounded-2xl overflow-hidden border border-border/60 bg-white hover:border-primary/20 hover:shadow-xl transition-all duration-500"
              style={{ perspective: 1000 }}
            >
              {/* Top gradient area */}
              <div className={`h-40 bg-gradient-to-br ${room.color} relative overflow-hidden`}>
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-30">
                  <svg width="100%" height="100%">
                    <pattern id={`pattern-${i}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="1" fill={room.accent} opacity="0.3" />
                    </pattern>
                    <rect width="100%" height="100%" fill={`url(#pattern-${i})`} />
                  </svg>
                </div>
                <div className="absolute bottom-4 left-5">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 rounded-xl bg-white/90 flex items-center justify-center shadow-sm"
                  >
                    <room.icon className="w-6 h-6" style={{ color: room.accent }} />
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold text-foreground">{room.name}</h3>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    {room.guests}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{room.tagline}</p>
                <div className="flex flex-wrap gap-2">
                  {room.perks.map((perk) => (
                    <span
                      key={perk}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/5 text-primary/80 border border-primary/10"
                    >
                      {perk}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
