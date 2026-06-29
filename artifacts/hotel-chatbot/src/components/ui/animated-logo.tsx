import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function AnimatedLogo({ size = 32, className, animated = true }: AnimatedLogoProps) {
  return (
    <motion.div
      className={cn("relative inline-flex items-center justify-center shrink-0", className)}
      style={{ width: size, height: size }}
      whileHover={animated ? { scale: 1.08 } : undefined}
      whileTap={animated ? { scale: 0.95 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Background circle */}
        <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />

        {/* Seed / leaf shape */}
        <motion.path
          d="M16 6C16 6 22 10 22 16C22 22 16 26 16 26C16 26 10 22 10 16C10 10 16 6 16 6Z"
          fill="white"
          fillOpacity="0.95"
          initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
          animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
          transition={animated ? { duration: 1, ease: "easeInOut", delay: 0.2 } : undefined}
        />

        {/* Inner vein */}
        <motion.path
          d="M16 10V22"
          stroke="url(#logoGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
          animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
          transition={animated ? { duration: 0.8, ease: "easeInOut", delay: 0.6 } : undefined}
        />

        {/* Small dot at bottom */}
        <motion.circle
          cx="16"
          cy="24"
          r="1.5"
          fill="url(#logoGrad)"
          initial={animated ? { scale: 0, opacity: 0 } : undefined}
          animate={animated ? { scale: 1, opacity: 1 } : undefined}
          transition={animated ? { duration: 0.3, delay: 1.2, type: "spring" } : undefined}
        />

        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2d6a4f" />
            <stop offset="100%" stopColor="#52b788" />
          </linearGradient>
        </defs>
      </svg>

      {/* Subtle glow ring on hover */}
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(82,183,136,0.15) 0%, rgba(45,106,79,0.1) 100%)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1.2 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}

export function LogoBadge({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <div className={cn("relative inline-flex items-center justify-center shrink-0", className)}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="url(#badgeGrad)" />
        <path
          d="M16 6C16 6 22 10 22 16C22 22 16 26 16 26C16 26 10 22 10 16C10 10 16 6 16 6Z"
          fill="white"
          fillOpacity="0.95"
        />
        <path d="M16 10V22" stroke="url(#badgeGrad)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="24" r="1.5" fill="url(#badgeGrad)" />
        <defs>
          <linearGradient id="badgeGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2d6a4f" />
            <stop offset="100%" stopColor="#52b788" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
