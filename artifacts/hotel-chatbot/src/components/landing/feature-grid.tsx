import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Bed, UtensilsCrossed, Waves, Plane, MapPin, Clock,
  Shirt, ConciergeBell, CloudSun, Baby
} from "lucide-react";

const features = [
  { icon: Bed, title: "Smart Room Booking", description: "Browse all 5 room types with real-time availability. Compare features, views, and pricing instantly." },
  { icon: UtensilsCrossed, title: "Dining Reservations", description: "Reserve tables at our 4 signature restaurants. Get menu recommendations based on your preferences." },
  { icon: Waves, title: "Spa & Wellness", description: "Book massages, yoga sessions, and wellness treatments with our AI-powered scheduling." },
  { icon: Plane, title: "Airport Transfers", description: "Arrange luxury transport to and from the airport with live tracking and driver details." },
  { icon: MapPin, title: "Local Experiences", description: "Discover curated activities around the resort — from hiking trails to hidden beaches and cultural tours." },
  { icon: Clock, title: "24/7 Guest Support", description: "Get instant answers about anything — room service, housekeeping, maintenance, or general inquiries." },
  { icon: Shirt, title: "Laundry & Housekeeping", description: "Schedule daily cleaning, fresh linens, or express laundry service with flexible pickup times." },
  { icon: ConciergeBell, title: "In-Room Dining", description: "Order breakfast in bed, midnight snacks, or a full dinner from any restaurant straight to your room." },
  { icon: CloudSun, title: "Weather & Packing Guide", description: "Get live weather forecasts and smart packing suggestions tailored to your planned activities." },
  { icon: Baby, title: "Kids & Family Activities", description: "Find childcare services, family-friendly excursions, game rooms, and kids' club schedules." },
];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(cx);
    y.set(cy);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function FeatureGrid() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-mono-label text-primary/70"
          >
            SERVICES
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-display font-medium text-foreground mt-3"
          >
            EVERYTHING YOU NEED FOR THE PERFECT STAY
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-muted-foreground max-w-xl mx-auto"
          >
            Aria connects every aspect of your resort experience into one seamless conversation.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item}>
              <TiltCard className="group p-6 rounded-2xl bg-white border border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full cursor-default">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2 tracking-wide">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
