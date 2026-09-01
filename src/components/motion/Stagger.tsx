"use client";

import type { ReactNode } from "react";
import { m, useReducedMotion, type Variants } from "motion/react";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
};

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
};

export function Stagger({
  children,
  className,
  stagger = 0.08,
  once = true,
}: StaggerProps) {
  const shouldReduceMotion = useReducedMotion();
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : stagger,
      },
    },
  };

  return (
    <m.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <m.div className={className} variants={variants}>
      {children}
    </m.div>
  );
}
