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
        {/* Rounded-square background with forest gradient */}
        <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />

        {/* Seed body — organic teardrop/seed shape */}
        <motion.path
          d="M16 22C16 22 12 17 12 13C12 9.5 14 7 16 7C18 7 20 9.5 20 13C20 17 16 22 16 22Z"
          fill="white"
          fillOpacity="0.95"
          initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
          animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
          transition={animated ? { duration: 1, ease: "easeInOut", delay: 0.2 } : undefined}
        />

        {/* Sprout stem emerging from seed */}
        <motion.path
          d="M16 22V25"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
          animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
          transition={animated ? { duration: 0.6, ease: "easeInOut", delay: 0.8 } : undefined}
        />

        {/* Left leaf */}
        <motion.path
          d="M16 24C14 23 13 21 13 20"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
          animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
          transition={animated ? { duration: 0.5, ease: "easeInOut", delay: 1.0 } : undefined}
        />

        {/* Right leaf */}
        <motion.path
          d="M16 24C18 23 19 21 19 20"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
          animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
          transition={animated ? { duration: 0.5, ease: "easeInOut", delay: 1.1 } : undefined}
        />

        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2D5A3D" />
            <stop offset="100%" stopColor="#5A8F6E" />
          </linearGradient>
        </defs>
      </svg>

      {/* Subtle glow ring on hover */}
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(45,90,61,0.12) 0%, rgba(90,143,110,0.08) 100%)",
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
        <path d="M16 22C16 22 12 17 12 13C12 9.5 14 7 16 7C18 7 20 9.5 20 13C20 17 16 22 16 22Z" fill="white" fillOpacity="0.95" />
        <path d="M16 22V25" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 24C14 23 13 21 13 20" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M16 24C18 23 19 21 19 20" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
        <defs>
          <linearGradient id="badgeGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2D5A3D" />
            <stop offset="100%" stopColor="#5A8F6E" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
