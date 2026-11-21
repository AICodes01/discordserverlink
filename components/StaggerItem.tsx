"use client";

import { useEffect, useRef, ReactNode, CSSProperties } from "react";

interface StaggerItemProps {
  children: ReactNode;
  index?: number;        // position in the list → determines delay
  className?: string;
  style?: CSSProperties;
}

/**
 * Wraps individual cards/items with a staggered fade-up entrance.
 * Each item delays by `index * 50ms` so they appear one after another.
 */
export default function StaggerItem({ children, index = 0, className = "", style }: StaggerItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const delay = Math.min(index * 55, 600); // cap at 600ms so long lists don't lag

    el.animate(
      [
        { opacity: 0, transform: "translateY(22px) scale(0.97)" },
        { opacity: 1, transform: "translateY(0px) scale(1)" },
      ],
      {
        duration: 450,
        delay,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "both",
      }
    );
  }, [index]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0, ...style }}>
      {children}
    </div>
  );
}
