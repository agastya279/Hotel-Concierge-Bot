import { motion } from "framer-motion";
import {
  Bed, UtensilsCrossed, Waves, Plane, MapPin, Clock,
  Shirt, ConciergeBell, CloudSun, Baby, Car, Wind,
  Trophy, Dna, Bike, TreePine, Gauge, BrainCircuit,
  Zap, Droplets
} from "lucide-react";

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
  { icon: Baby, label: "Kids Zone" },
  { icon: Car, label: "AI Karting" },
  { icon: Wind, label: "Tennis & Padel" },
  { icon: Trophy, label: "Football Pitch" },
  { icon: Dna, label: "Digital Twin" },
  { icon: Bike, label: "Microgrid" },
  { icon: TreePine, label: "Greenhouse" },
  { icon: Gauge, label: "Dynamic Pricing" },
  { icon: BrainCircuit, label: "Face Recognition" },
  { icon: Zap, label: "EV Charging" },
  { icon: Droplets, label: "Water Recycling" },
];

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const duplicated = [...items, ...items, ...items];

  return (
    <div className="flex overflow-hidden py-2">
      <motion.div
        className="flex shrink-0 gap-4"
        animate={{ x: reverse ? ["-33.33%", "0%"] : ["0%", "-33.33%"] }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicated.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-white/80 whitespace-nowrap hover:border-primary/30 transition-colors"
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
