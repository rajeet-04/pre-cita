"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  onComplete: () => void;
}

const PARTICLE_COUNT = 28;

// Stable particle data — computed once outside component to avoid hydration mismatch
const particleData = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  // Deterministic pseudo-random from index
  const seed = (i * 2654435761) >>> 0;
  const r1 = (seed % 1000) / 1000;
  const r2 = ((seed * 1664525 + 1013904223) >>> 0) % 1000 / 1000;
  const r3 = ((seed * 22695477 + 1) >>> 0) % 1000 / 1000;
  const r4 = ((seed * 1103515245 + 12345) >>> 0) % 1000 / 1000;
  const r5 = ((seed * 214013 + 2531011) >>> 0) % 1000 / 1000;

  return {
    left: 30 + r1 * 40,
    delay: r2 * 1.6,
    size: 1.5 + r3 * 3,
    duration: 1.2 + r4 * 1.4,
    drift: (r5 - 0.5) * 60,
    hue: 36 + r1 * 18,
    lightness: 55 + r2 * 20,
    repeatDelay: r3 * 0.8,
  };
});

function SandParticle({ data }: { data: typeof particleData[0] }) {
  return (
    <motion.div
      className="particle"
      style={{
        left: `${data.left}%`,
        width: data.size,
        height: data.size,
        borderRadius: "50%",
        position: "absolute",
        bottom: "38%",
        background: `hsl(${data.hue}deg 90% ${data.lightness}%)`,
        pointerEvents: "none",
      }}
      initial={{ y: 0, opacity: 0, x: 0 }}
      animate={{
        y: [0, -(80 + data.size * 20)],
        x: [0, data.drift],
        opacity: [0, 0.9, 0],
        scale: [1, 0.6, 0],
      }}
      transition={{
        duration: data.duration,
        delay: data.delay,
        repeat: Infinity,
        repeatDelay: data.repeatDelay,
        ease: "easeOut",
      }}
    />
  );
}

export default function Loader({ onComplete }: LoaderProps) {
  const hasCompleted = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        onComplete();
      }
    }, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const letterVariants = {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: 0.6 + i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const title = "CITADEL 1.0";

  return (
    <motion.div
      className="loader-root"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Background radial glow */}
      <motion.div
        className="loader-glow"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Sand particles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {particleData.map((data, i) => (
          <SandParticle key={i} data={data} />
        ))}
      </div>

      {/* Logo */}
      <motion.div
        className="loader-logo-wrap"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="loader-halo"
          animate={{
            boxShadow: [
              "0 0 24px 6px rgba(212,160,23,0.25)",
              "0 0 60px 20px rgba(212,160,23,0.55)",
              "0 0 24px 6px rgba(212,160,23,0.25)",
            ],
            scale: [1, 1.03, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="Citadel Logo" className="loader-logo-img" />
        </motion.div>
      </motion.div>

      {/* Title letter reveal */}
      <motion.div className="loader-title-wrap" aria-label={title}>
        {title.split("").map((char, i) => (
          <motion.span
            key={i}
            className="loader-letter"
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            custom={i}
            style={{
              display: "inline-block",
              width: char === " " ? "0.45em" : undefined,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>

      {/* Sub-label */}
      <motion.p
        className="loader-sub"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.55, duration: 0.6, ease: "easeOut" }}
      >
        Hackathon · Soft Launch
      </motion.p>

      {/* Progress bar */}
      <motion.div className="loader-bar-track">
        <motion.div
          className="loader-bar-fill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
        />
      </motion.div>
    </motion.div>
  );
}
