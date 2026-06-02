import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NeuralNetAnimation from './landing/NeuralNetAnimation';
import { useIntro } from '@/lib/IntroContext';

/**
 * The neural-net intro splash. Rendered at the app root (NOT inside the
 * page-transition wrapper) so its position:fixed elements are relative to
 * the viewport.
 *
 * On "Enter Site", introVisible flips to false. AnimatePresence keeps the
 * overlay mounted long enough to play a smooth exit — the whole intro
 * zooms in slightly, blurs and fades, revealing the site underneath — then
 * it fully unmounts (the canvas loop is cancelled in NeuralNetAnimation).
 */
export default function IntroOverlay() {
  const { introVisible, hideIntro } = useIntro();

  return (
    <AnimatePresence>
      {introVisible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          style={{ transformOrigin: '50% 45%' }}
        >
          <NeuralNetAnimation onReveal={hideIntro} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
