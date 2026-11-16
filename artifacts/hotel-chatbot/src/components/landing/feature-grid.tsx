import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Bed, UtensilsCrossed, Waves, Plane, MapPin, Clock,
  Shirt, ConciergeBell, CloudSun, Baby, Car, Wind,
  Trophy, Dna, Bike, TreePine, Gauge, BrainCircuit
} from "lucide-react";

const features = [
  { icon: Bed, title: "Smart Room Booking", description: "Browse all 5 room types with real-time availability. Every room has Smart Glass, Biometric Entry, and AI Climate control." },
  { icon: UtensilsCrossed, title: "Dining Reservations", description: "Reserve tables at our 4 signature restaurants. The Farm-to-Table restaurant features an AI Menu Planner driven by live greenhouse harvest data." },
  { icon: Waves, title: "Spa & Wellness", description: "Book massages, yoga sessions, and wellness treatments. The Mood-Adaptive Concierge reads your expression and suggests spa services when you look tired." },
  { icon: Plane, title: "Airport Transfers", description: "Arrange luxury transport to and from the airport with live tracking, facial recognition handoff, and driver details sent to your phone." },
  { icon: MapPin, title: "Local Experiences", description: "Discover curated activities — the Circular Waterway with nightly AI Light Show, Marina Watersports, and hidden nature trails." },
  { icon: Clock, title: "24/7 Voice AI Concierge", description: "A multilingual voice assistant available around the clock to handle bookings, answer queries, manage upsells, and adapt to your context." },
  { icon: Shirt, title: "Laundry & Housekeeping", description: "Schedule daily cleaning, fresh linens, or express laundry with flexible pickup times tracked by the Guest Journey App." },
  { icon: ConciergeBell, title: "In-Room Dining", description: "Order from any restaurant straight to your room. AI predicts your preferences and pre-suggests favorites based on past orders." },
  { icon: CloudSun, title: "Weather & Packing Guide", description: "Get live forecasts and smart packing suggestions. The Dynamic Pricing Engine also adjusts activity rates based on local weather." },
  { icon: Baby, title: "STEM Kids Zone", description: "Find childcare, family excursions, and the on-site STEM learning center with interactive science and coding workshops." },
  { icon: Car, title: "AI Karting Track", description: "A winding kart track governed by a reinforcement learning safety agent that predicts collisions milliseconds in advance and wirelessly adjusts torque." },
  { icon: Wind, title: "Sports & Courts", description: "Football pitch and Tennis/Padel courts with live pose estimation, smart ball-tracking cameras, and AI coaching feedback." },
  { icon: Trophy, title: "Equestrian Center", description: "Horseback riding with stables featuring predictive health monitoring for every animal and guided trail experiences." },
  { icon: Dna, title: "Digital Twin Operations", description: "A real-time 3D replica of the entire resort used to balance energy loads, predict crowd buildup, and simulate emergency scenarios." },
  { icon: Bike, title: "Sustainable Microgrid", description: "100% renewable energy from Solar Parking Canopies and Wind Turbines. AI Power Routing directs energy dynamically based on real-time demand." },
  { icon: TreePine, title: "Greenhouse Farms", description: "On-site organic farming with Agritech Crop Yield Predictors. Rainwater harvesting and greywater recycling feed the entire irrigation system." },
  { icon: Gauge, title: "Dynamic Pricing", description: "Reinforcement learning adjusts hotel room and activity rates in real-time based on weather, demand curves, and event calendars." },
  { icon: BrainCircuit, title: "AI Security & Entry", description: "Facial recognition kiosks at the grand gates for frictionless check-in. Smart parking with computer vision tracks every vehicle movement." },
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
  show: { transition: { staggerChildren: 0.04 } },
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
            RESORT OPERATIONS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-display font-medium text-foreground mt-3"
          >
            18 AI-POWERED SYSTEMS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-muted-foreground max-w-xl mx-auto"
          >
            From facial recognition check-in to reinforcement learning kart safety — every aspect of SEED Resort is powered by intelligent systems.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item as any}>
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
