import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function EnergyTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // The SVG line grows as the user scrolls
  const pathLength  = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="absolute left-6 lg:left-16 top-0 bottom-0 w-8 hidden lg:flex items-center justify-center pointer-events-none">
      <svg
        width="2"
        height="100%"
        viewBox="0 0 2 1000"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full"
      >
        {/* Background track */}
        <line x1="1" y1="0" x2="1" y2="1000" stroke="#1e293b" strokeWidth="2" />

        {/* Animated progress line */}
        <motion.line
          x1="1" y1="0" x2="1" y2="1000"
          stroke="url(#timelineGrad)"
          strokeWidth="2"
          pathLength="1"
          style={{ pathLength, opacity: glowOpacity }}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#6ee7b7" />
            <stop offset="50%"  stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>

      {/* Glowing dot at the progress tip */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-emerald-400 left-1/2 -translate-x-1/2"
        style={{
          top: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
          opacity: glowOpacity,
          boxShadow: "0 0 12px #10b981, 0 0 24px #10b981",
        }}
      />
    </div>
  );
}
