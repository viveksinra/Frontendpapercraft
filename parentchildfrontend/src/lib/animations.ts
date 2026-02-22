import type { Variants, Transition } from 'framer-motion';

// Easing curves
export const easeOutExpo = [0.22, 1, 0.36, 1] as const;
export const easeOutCubic = [0.33, 1, 0.68, 1] as const;

// Durations
export const duration = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
};

// Entrance variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.normal, ease: easeOutExpo as unknown as number[] },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easeOutExpo as unknown as number[] },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easeOutExpo as unknown as number[] },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.slow, ease: easeOutExpo as unknown as number[] },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.slow, ease: easeOutExpo as unknown as number[] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.slow, ease: easeOutExpo as unknown as number[] },
  },
};

// Stagger variants
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.15,
    },
  },
};

// Stagger item (child)
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easeOutExpo as unknown as number[] },
  },
};

// Interaction variants
export const hoverScale = {
  scale: 1.02,
  transition: { duration: duration.fast },
};

export const hoverLift = {
  y: -4,
  transition: { duration: duration.fast },
};

export const tapScale = {
  scale: 0.98,
};

// Page transition
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easeOutExpo as unknown as number[] },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: duration.normal },
  },
};

// Spring transition presets
export const springBounce: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 20,
};

export const springSmooth: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
};
