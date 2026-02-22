'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  pageTransition,
  easeOutExpo,
  duration,
} from '@/lib/animations';

// MotionDiv — animated div with preset entrance variants
export const MotionDiv = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<'div'>
>(({ variants = fadeInUp, initial = 'hidden', animate = 'visible', ...props }, ref) => (
  <motion.div
    ref={ref}
    variants={variants}
    initial={initial}
    animate={animate}
    {...props}
  />
));
MotionDiv.displayName = 'MotionDiv';

// MotionSpan — inline animated text
export const MotionSpan = forwardRef<
  HTMLSpanElement,
  HTMLMotionProps<'span'>
>(({ variants = fadeInUp, initial = 'hidden', animate = 'visible', ...props }, ref) => (
  <motion.span
    ref={ref}
    variants={variants}
    initial={initial}
    animate={animate}
    {...props}
  />
));
MotionSpan.displayName = 'MotionSpan';

// StaggerContainer — parent that staggers children animations
export const StaggerContainer = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<'div'>
>(({ variants = staggerContainer, initial = 'hidden', animate = 'visible', ...props }, ref) => (
  <motion.div
    ref={ref}
    variants={variants}
    initial={initial}
    animate={animate}
    {...props}
  />
));
StaggerContainer.displayName = 'StaggerContainer';

// StaggerItem — child that animates in sequence
export const StaggerItem = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<'div'>
>(({ variants = staggerItem, ...props }, ref) => (
  <motion.div
    ref={ref}
    variants={variants}
    {...props}
  />
));
StaggerItem.displayName = 'StaggerItem';

// PageTransition — wraps page content with enter/exit transitions
export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}
