"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import type { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

type Layer = {
  text: string;
  className: string;
  depth: number;
};

const textLayers: Layer[] = [
  { text: "NEON", className: "headline top", depth: 220 },
  { text: "CITY", className: "headline middle", depth: 360 },
  { text: "NIGHTS", className: "headline bottom", depth: 500 },
  { text: "PARALLAX POSTER BOILERPLATE", className: "subline", depth: 180 },
];

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: FaLinkedinIn,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com",
    icon: FaInstagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com",
    icon: FaFacebookF,
  },
] satisfies Array<{ name: string; href: string; icon: IconType }>;

const springFactor = 0.09;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function Home() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) {
      return;
    }

    let rafId = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const updateTarget = (clientX: number, clientY: number) => {
      const rect = scene.getBoundingClientRect();
      const normalizedX = (clientX - rect.left) / rect.width;
      const normalizedY = (clientY - rect.top) / rect.height;

      targetX = clamp((normalizedX - 0.5) * 2, -1, 1);
      targetY = clamp((normalizedY - 0.5) * 2, -1, 1);
    };

    const onPointerMove = (event: PointerEvent) => {
      updateTarget(event.clientX, event.clientY);
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

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
  }, []);

  return (
    <main className="poster-root">
      <div className="poster-scene" ref={sceneRef}>
        <section className="poster-card" aria-label="Parallax poster preview">
          <div className="poster-background" />
          <div className="poster-vignette" />
          <div className="poster-grain" />

          <div className="text-stack" aria-hidden="true">
            {textLayers.map((layer) => (
              <p
                key={layer.text}
                className={`text-layer ${layer.className}`}
                style={{
                  "--layer-depth": `${layer.depth}px`,
                } as CSSProperties}
              >
                {layer.text}
              </p>
            ))}
          </div>

          <aside className="setup-note">
            <p>Drop your assets here:</p>
            <p>/public/assets/poster/poster-portrait.png</p>
            <p>/public/assets/fonts/custom-display.otf</p>
          </aside>

          <nav className="social-links" aria-label="Follow links">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.name}
                  className="social-link"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow on ${social.name}`}
                >
                  <Icon aria-hidden="true" size={16} />
                  <span>{social.name}</span>
                </a>
              );
            })}
          </nav>
        </section>
      </div>
    </main>
  );
}
