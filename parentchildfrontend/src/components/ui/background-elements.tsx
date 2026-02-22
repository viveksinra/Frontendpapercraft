'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// GradientOrb — blurred circular gradient
interface GradientOrbProps {
  className?: string;
  size?: number;
  color?: string;
  delay?: number;
}

export function GradientOrb({
  className,
  size = 300,
  color = 'from-primary/30 to-accent/20',
  delay = 0,
}: GradientOrbProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'absolute rounded-full blur-3xl bg-gradient-to-br pointer-events-none',
        color,
        className
      )}
      style={{ width: size, height: size }}
    >
      <motion.div
        className="w-full h-full rounded-full"
        animate={{
          y: [0, -20, 0, 20, 0],
          x: [0, 10, 0, -10, 0],
        }}
        transition={{
          duration: 8 + delay * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}

// GridPattern — subtle dot grid overlay (SVG)
interface GridPatternProps {
  className?: string;
  size?: number;
  dotSize?: number;
}

export function GridPattern({ className, size = 32, dotSize = 1 }: GridPatternProps) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}>
      <svg className="w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="grid-dots"
            x="0"
            y="0"
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={size / 2} cy={size / 2} r={dotSize} fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-dots)" />
      </svg>
    </div>
  );
}

// FloatingShapes — animated geometric shapes
const shapes = [
  { type: 'circle', size: 40, x: '10%', y: '20%', delay: 0, duration: 7 },
  { type: 'circle', size: 24, x: '80%', y: '15%', delay: 1, duration: 9 },
  { type: 'hexagon', size: 32, x: '70%', y: '70%', delay: 0.5, duration: 8 },
  { type: 'circle', size: 20, x: '20%', y: '80%', delay: 1.5, duration: 10 },
  { type: 'hexagon', size: 28, x: '50%', y: '40%', delay: 2, duration: 7 },
  { type: 'circle', size: 16, x: '90%', y: '50%', delay: 0.8, duration: 11 },
];

interface FloatingShapesProps {
  className?: string;
}

export function FloatingShapes({ className }: FloatingShapesProps) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}>
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: shape.x, top: shape.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 0.8, delay: shape.delay + 0.5 }}
        >
          <motion.div
            animate={{
              y: [0, -15, 0, 15, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {shape.type === 'circle' ? (
              <div
                className="rounded-full border border-white/20 bg-white/5"
                style={{ width: shape.size, height: shape.size }}
              />
            ) : (
              <svg
                width={shape.size}
                height={shape.size}
                viewBox="0 0 28 28"
                fill="none"
                className="text-white/20"
              >
                <path
                  d="M14 2L25.66 8.5V21.5L14 28L2.34 21.5V8.5L14 2Z"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="rgba(255,255,255,0.05)"
                />
              </svg>
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
