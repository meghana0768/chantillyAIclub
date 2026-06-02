import React from 'react';
import { motion } from 'framer-motion';

/**
 * Wraps a routed page so it animates in/out as the route changes.
 * Pairs with <AnimatePresence mode="wait"> in App.jsx.
 *
 * The effect: the outgoing page lifts away while a thin accent panel sweeps
 * across, then the incoming page settles in from below. Uses only opacity +
 * transform (no blur filter) so the transition stays GPU-cheap and smooth.
 */
const ease = [0.22, 1, 0.36, 1];

export default function PageTransition({ children }) {
  return (
    <>
      {/* Accent wipe that sweeps across on every route change */}
      <motion.div
        className="fixed inset-0 z-[60] pointer-events-none origin-left bg-gradient-to-r from-primary via-accent to-primary"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease }}
        style={{ transformOrigin: 'left' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease, delay: 0.08 }}
      >
        {children}
      </motion.div>
    </>
  );
}
