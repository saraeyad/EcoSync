import { useEffect, useRef, useState, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface FlipNumberProps {
  value: string | number;
  className?: string;
}

export const FlipNumber = memo(function FlipNumber({ value, className = "" }: FlipNumberProps) {
  const chars = String(value).split("");
  return (
    <span className={`inline-flex ${className}`} aria-label={String(value)}>
      {chars.map((ch, i) => (
        <AnimatePresence mode="popLayout" key={i}>
          <motion.span
            key={`${i}-${ch}`}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%",    opacity: 1 }}
            exit={{    y: "100%",  opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block overflow-hidden tabular-nums"
            style={{ lineHeight: "inherit" }}
          >
            {ch}
          </motion.span>
        </AnimatePresence>
      ))}
    </span>
  );
});

// Animated counter that counts up to a target
interface CountUpProps {
  target: number;
  duration?: number;
  suffix?: string;
  className?: string;
  start?: boolean;
  decimals?: number;
}

export function CountUp({ target, duration = 2000, suffix = "", className = "", start = true, decimals = 0 }: CountUpProps) {
  const [display, setDisplay] = useState("0");
  const startRef = useRef<number | null>(null);
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    if (!start) return;
    startRef.current = null;

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const val      = eased * target;
      setDisplay(decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString());
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, start, decimals]);

  return (
    <span className={className}>
      <FlipNumber value={display} />
      {suffix}
    </span>
  );
}
