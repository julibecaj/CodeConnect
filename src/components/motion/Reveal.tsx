"use client";

import type { ReactNode } from "react";
import { m, useReducedMotion } from "motion/react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  once?: boolean;
  amount?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
  once = true,
  amount = 0.2,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
