import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Guest from London",
    quote: "Aria booked our entire itinerary — spa, dinner reservations, and a sunset boat tour. It felt like having a personal assistant who never sleeps.",
    rating: 5,
  },
  {
    name: "James & Olivia",
    role: "Honeymoon couple",
    quote: "We mentioned we loved Italian food and Aria immediately reserved us a table at the waterfront restaurant with the best view. Incredible attention to detail.",
    rating: 5,
  },
  {
    name: "Michael T.",
    role: "Business traveler",
    quote: "I needed an airport transfer at 5 AM. Aria arranged it in under 30 seconds and sent me the driver's contact. Seamless experience every time.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Loved by guests
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Real stories from real stays. See what our guests say about Aria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-border/60 hover:border-primary/20 hover:shadow-md transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-5">"{t.quote}"</p>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
