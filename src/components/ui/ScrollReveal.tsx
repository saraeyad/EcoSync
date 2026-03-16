import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
  blur?: boolean;
}

export function ScrollReveal({ children, delay = 0, className = "", once = false, blur = true }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.88, y: 32, filter: blur ? "blur(12px)" : "blur(0px)" }}
      animate={isInView
        ? { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
        : { opacity: 0, scale: 0.88, y: 32, filter: blur ? "blur(12px)" : "blur(0px)" }
      }
      transition={{
        duration: 0.75,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
