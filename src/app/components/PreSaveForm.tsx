"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Status = "idle" | "loading" | "success" | "error";

const GAS_URL = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL ?? "";

export default function PreSaveForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setMessage("Email is required to pre-save.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const payload = {
        email: email.trim(),
        phone: phone.trim() || "Not provided",
        timestamp: new Date().toISOString(),
      };

      if (!GAS_URL) {
        // Dev fallback — log and pretend success
        console.warn("[PreSave] NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL not set. Simulating success.");
        console.log("[PreSave] payload:", payload);
        await new Promise((r) => setTimeout(r, 900));
        setStatus("success");
        setMessage("You're on the list! We'll be in touch.");
        setEmail("");
        setPhone("");
        return;
      }

      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        mode: "no-cors",
      });

      // no-cors always returns opaque response — treat as success
      void res;
      setStatus("success");
      setMessage("You're on the list! We'll keep you posted.");
      setEmail("");
      setPhone("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const inputVariants = {
    focus: { scale: 1.015, boxShadow: "0 0 0 2px rgba(212,160,23,0.45), 0 4px 20px rgba(0,0,0,0.5)" },
    blur: { scale: 1, boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.4)" },
  };

  return (
    <motion.section
      className="presave-section"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glow accent bar */}
      <motion.div
        className="presave-accent-bar"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0.5 }}
      />

      <motion.h2
        className="presave-heading"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        Get Early Access
      </motion.h2>

      <motion.p
        className="presave-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.6 }}
      >
        Stay ahead. Be the first to know when Citadel 1.0 goes live.
      </motion.p>

      <form ref={formRef} onSubmit={handleSubmit} className="presave-form" noValidate>
        {/* Email field */}
        <motion.div
          className="presave-field"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.85, duration: 0.6, ease: "easeOut" }}
        >
          <label htmlFor="presave-email" className="presave-label">
            Email Address <span className="required-dot">*</span>
          </label>
          <motion.input
            id="presave-email"
            type="email"
            className="presave-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            variants={inputVariants}
            whileFocus="focus"
            animate="blur"
          />
        </motion.div>

        {/* Phone field */}
        <motion.div
          className="presave-field"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.95, duration: 0.6, ease: "easeOut" }}
        >
          <label htmlFor="presave-phone" className="presave-label">
            Phone Number{" "}
            <span className="optional-tag">optional</span>
          </label>
          <motion.input
            id="presave-phone"
            type="tel"
            className="presave-input"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            variants={inputVariants}
            whileFocus="focus"
            animate="blur"
          />
        </motion.div>

        {/* Submit button */}
        <motion.button
          type="submit"
          className="presave-btn"
          disabled={status === "loading" || status === "success"}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.6 }}
          whileHover={status === "idle" ? { scale: 1.03, y: -2 } : {}}
          whileTap={status === "idle" ? { scale: 0.97 } : {}}
        >
          <AnimatePresence mode="wait">
            {status === "loading" && (
              <motion.span
                key="loading"
                className="presave-btn-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="presave-spinner" />
                Processing…
              </motion.span>
            )}
            {status === "success" && (
              <motion.span
                key="success"
                className="presave-btn-content"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                ✓ Saved!
              </motion.span>
            )}
            {(status === "idle" || status === "error") && (
              <motion.span
                key="idle"
                className="presave-btn-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Pre-Save My Spot →
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Feedback message */}
        <AnimatePresence>
          {message && (
            <motion.p
              className={`presave-message ${status}`}
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      {/* Privacy note */}
      <motion.p
        className="presave-privacy"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        🔒 Your info stays private. No spam, ever.
      </motion.p>
    </motion.section>
  );
}
