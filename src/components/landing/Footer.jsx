import React from 'react';
import { Link } from 'react-router-dom';

const links = [
  { label: 'About', to: '/About' },
  { label: 'Projects', to: '/Projects' },
  { label: 'Events', to: '/Events' },
  { label: 'Team', to: '/Team' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-8 px-6 bg-secondary/40">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-primary font-semibold text-sm">{'>'}_</span>
          <span className="font-bold text-sm text-foreground">Chantilly AI Club</span>
          <span className="text-muted-foreground text-xs ml-2">Chantilly High School, VA</span>
        </div>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
