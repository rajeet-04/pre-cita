"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import type { IconType } from "react-icons";
import { FaInstagram, FaLinkedinIn, FaFacebookF } from "react-icons/fa";

type Layer = {
  text: string;
  className: string;
  depth: number;
};

const textLayers: Layer[] = [
    // { text: "NEON", className: "headline top", depth: 220 },
    // { text: "CITY", className: "headline middle", depth: 360 },
    // { text: "NIGHTS", className: "headline bottom", depth: 500 },
    // { text: "PARALLAX POSTER BOILERPLATE", className: "subline", depth: 180 },
];

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
      <div className="poster-wrapper">
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

            <nav className="poster-social-links" aria-label="Social links">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    className="poster-social-link"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    <Icon aria-hidden="true" size={16} />
                  </a>
                );
              })}
            </nav>
          </section>
        </div>
      </div>
    </main>
  );
}
