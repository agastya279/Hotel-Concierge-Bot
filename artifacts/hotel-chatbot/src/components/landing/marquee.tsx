import { motion } from "framer-motion";
import { Bed, UtensilsCrossed, Waves, Plane, MapPin, Clock, Shirt, ConciergeBell, CloudSun, Baby, Sparkles, Shield, Zap, Heart } from "lucide-react";

const items = [
  { icon: Bed, label: "Smart Rooms" },
  { icon: UtensilsCrossed, label: "Fine Dining" },
  { icon: Waves, label: "Spa & Wellness" },
  { icon: Plane, label: "Airport Transfer" },
  { icon: MapPin, label: "Local Tours" },
  { icon: Clock, label: "24/7 Support" },
  { icon: Shirt, label: "Housekeeping" },
  { icon: ConciergeBell, label: "Room Service" },
  { icon: CloudSun, label: "Weather Guide" },
  { icon: Baby, label: "Family Fun" },
  { icon: Sparkles, label: "AI Powered" },
  { icon: Shield, label: "Secure" },
  { icon: Zap, label: "Instant" },
  { icon: Heart, label: "Loved by Guests" },
];

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const duplicated = [...items, ...items, ...items];

  return (
    <div className="flex overflow-hidden py-2">
      <motion.div
        className="flex shrink-0 gap-6"
        animate={{ x: reverse ? ["-33.33%", "0%"] : ["0%", "-33.33%"] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicated.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-white/80 whitespace-nowrap"
          >
            <item.icon className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function MarqueeBanner() {
  return (
    <section className="py-8 overflow-hidden bg-muted/20 border-y border-border/30">
      <MarqueeRow />
      <MarqueeRow reverse />
    </section>
  );
}
