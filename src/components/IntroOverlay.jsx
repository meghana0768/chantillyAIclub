import React from 'react';
import NeuralNetAnimation from './landing/NeuralNetAnimation';
import { useIntro } from '@/lib/IntroContext';

/**
 * The neural-net intro splash. Rendered at the app root (NOT inside the
 * page-transition wrapper) so its position:fixed elements are relative to
 * the viewport — otherwise a transformed ancestor would offset them.
 *
 * It is purely the intro: shown only while introVisible is true, and fully
 * unmounted the moment the user clicks "Enter Site" (hideIntro).
 */
export default function IntroOverlay() {
  const { introVisible, hideIntro } = useIntro();
  if (!introVisible) return null;
  return (
    <div className="fixed inset-0 z-[100]">
      <NeuralNetAnimation onReveal={hideIntro} />
    </div>
  );
}
