import React from 'react';
import PageTransition from './PageTransition';
import Footer from './landing/Footer';

/**
 * Standard wrapper for a routed page: animated transition, full-height
 * column so short pages still fill the viewport, and a shared footer.
 */
export default function PageShell({ children }) {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </PageTransition>
  );
}
