"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { IconType } from "react-icons";
import { FaInstagram, FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import Loader to keep initial bundle small
const Loader = dynamic(() => import("./components/Loader"), { ssr: false });
const PreSaveForm = dynamic(() => import("./components/PreSaveForm"), { ssr: false });

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/citadel_hackathon1.0?igsh=MTVsMTZiZWFuYW9kNA==",
    icon: FaInstagram,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/citadel-hackathon/",
    icon: FaLinkedinIn,
  },
  {
    name: "Facebook",
    href: "#",
    icon: FaFacebookF,
  },
] satisfies Array<{ name: string; href: string; icon: IconType }>;

const springFactor = 0.09;
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export default function Home() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [loaderDone, setLoaderDone] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
    // Extra buffer so exit animation finishes
    setTimeout(() => setShowLoader(false), 800);
  }, []);

  // Parallax tilt
  useEffect(() => {
    if (!loaderDone) return;
    const scene = sceneRef.current;
    if (!scene) return;

    let rafId = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const updateTarget = (clientX: number, clientY: number) => {
      const rect = scene.getBoundingClientRect();
      const nx = (clientX - rect.left) / rect.width;
      const ny = (clientY - rect.top) / rect.height;
      targetX = clamp((nx - 0.5) * 2, -1, 1);
      targetY = clamp((ny - 0.5) * 2, -1, 1);
    };

    const onPointerMove = (e: PointerEvent) => updateTarget(e.clientX, e.clientY);
    const onPointerLeave = () => { targetX = 0; targetY = 0; };

    const animate = () => {
      currentX += (targetX - currentX) * springFactor;
      currentY += (targetY - currentY) * springFactor;
      scene.style.setProperty("--rotate-x", `${(-currentY * 11).toFixed(2)}deg`);
      scene.style.setProperty("--rotate-y", `${(currentX * 14).toFixed(2)}deg`);
      scene.style.setProperty("--drift-x", `${(currentX * 30).toFixed(2)}px`);
      scene.style.setProperty("--drift-y", `${(currentY * 30).toFixed(2)}px`);
      rafId = requestAnimationFrame(animate);
    };

    scene.addEventListener("pointermove", onPointerMove);
    scene.addEventListener("pointerleave", onPointerLeave);
    rafId = requestAnimationFrame(animate);
    return () => {
      scene.removeEventListener("pointermove", onPointerMove);
      scene.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, [loaderDone]);

  const posterVariants = {
    hidden: { opacity: 0, y: 32, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <>
      {/* Loading screen */}
      <AnimatePresence>
        {!loaderDone && showLoader && (
          <Loader key="loader" onComplete={handleLoaderComplete} />
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="poster-root">
        <div className="poster-wrapper">
          {/* ── Poster card ── */}
          <motion.div
            variants={posterVariants}
            initial="hidden"
            animate={loaderDone ? "visible" : "hidden"}
          >
            <div className="poster-scene" ref={sceneRef}>
              <section className="poster-card" aria-label="Citadel 1.0 poster">
                <div className="poster-background" />
                <div className="poster-vignette" />
                <div className="poster-grain" />

                {/* Social icons (floating inside card) */}
                <nav className="poster-social-links" aria-label="Social links">
                  {socialLinks.map((social, i) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        className="poster-social-link"
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        initial={{ opacity: 0, y: 12 }}
                        animate={loaderDone ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.18, y: -3 }}
                        whileTap={{ scale: 0.93 }}
                      >
                        <Icon aria-hidden="true" size={16} />
                      </motion.a>
                    );
                  })}
                </nav>
              </section>
            </div>
          </motion.div>

          {/* ── Pre-save form (below poster) ── */}
          {loaderDone && <PreSaveForm />}
        </div>
      </main>
    </>
  );
}
