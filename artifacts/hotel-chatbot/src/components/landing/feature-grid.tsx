import { motion } from "framer-motion";
import { Bed, UtensilsCrossed, Waves, Plane, MapPin, Clock } from "lucide-react";

const features = [
  {
    icon: Bed,
    title: "Smart Room Booking",
    description: "Browse all 5 room types with real-time availability. Compare features, views, and pricing instantly.",
    span: "col-span-1 md:col-span-2 lg:col-span-1",
  },
  {
    icon: UtensilsCrossed,
    title: "Dining Reservations",
    description: "Reserve tables at our 4 signature restaurants. Get menu recommendations based on your preferences.",
    span: "col-span-1",
  },
  {
    icon: Waves,
    title: "Spa & Wellness",
    description: "Book massages, yoga sessions, and wellness treatments with our AI-powered scheduling.",
    span: "col-span-1",
  },
  {
    icon: Plane,
    title: "Airport Transfers",
    description: "Arrange luxury transport to and from the airport with live tracking and driver details.",
    span: "col-span-1",
  },
  {
    icon: MapPin,
    title: "Local Experiences",
    description: "Discover curated activities around the resort — from hiking trails to hidden beaches and cultural tours.",
    span: "col-span-1 md:col-span-2 lg:col-span-1",
  },
  {
    icon: Clock,
    title: "24/7 Guest Support",
    description: "Get instant answers about anything — room service, housekeeping, maintenance, or general inquiries.",
    span: "col-span-1",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export function FeatureGrid() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Everything you need for the perfect stay
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Aria connects every aspect of your resort experience into one seamless conversation.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className={`${f.span} group p-6 rounded-2xl bg-white border border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300`}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
