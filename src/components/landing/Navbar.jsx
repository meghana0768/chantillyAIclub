import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useIntro } from '@/lib/IntroContext';

const navLinks = [
  { label: 'Home', to: '/Home' },
  { label: 'About', to: '/About' },
  { label: 'Projects', to: '/Projects' },
  { label: 'Events', to: '/Events' },
  { label: 'Team', to: '/Team' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { introVisible } = useIntro();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const linkBase =
    'px-3 py-1.5 text-sm rounded-xl transition-all font-medium';

  // Hide the navbar entirely while the full-screen intro splash is playing.
  if (introVisible) return null;

  return (
    <>
      {/* Floating pill navbar — desktop */}
      <div className="fixed top-4 left-0 right-0 z-50 hidden md:flex justify-center px-6">
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`flex items-center gap-1 px-4 py-2 rounded-2xl border w-full max-w-5xl transition-all duration-300 justify-between ${
            scrolled
              ? 'bg-white/80 backdrop-blur-xl border-border/60 shadow-lg shadow-black/[0.08]'
              : 'bg-white/60 backdrop-blur-md border-border/40 shadow-md shadow-black/[0.05]'
          }`}
        >
          {/* Logo */}
          <Link to="/Home" className="flex items-center gap-1.5 px-2 mr-2">
            <span className="font-mono text-primary font-semibold text-sm">{'>'}_</span>
            <span className="font-bold text-foreground text-base tracking-tight">Chantilly AI Club</span>
          </Link>

          {/* Right: nav links + CTA */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/Team"
              className="ml-3 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors px-5 py-2 rounded-xl whitespace-nowrap"
            >
              Come by Wednesday
            </Link>
          </div>
        </motion.nav>
      </div>

      {/* Mobile navbar — top bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md border-b border-border/40 shadow-sm' : 'bg-white/70 backdrop-blur-md'
        }`}
      >
        <div className="px-5 h-14 flex items-center justify-between">
          <Link to="/Home" className="flex items-center gap-2">
            <span className="font-mono text-primary font-semibold text-sm">{'>'}_</span>
            <span className="font-bold text-foreground text-sm tracking-tight">Chantilly AI</span>
          </Link>
          <button className="text-foreground p-1" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {open && (
          <div className="bg-white border-b border-border/50">
            <div className="px-5 py-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `block py-2.5 text-sm font-medium ${
                      isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-2">
                <Link
                  to="/Team"
                  className="block text-center text-sm font-semibold text-primary-foreground bg-primary px-4 py-2 rounded-xl"
                >
                  Come by Wednesday
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
