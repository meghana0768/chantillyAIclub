import React from 'react';
import { motion } from 'framer-motion';

const officers = [
  { initials: 'MB', name: 'Mustafa Badshah', role: 'President' },
  { initials: 'RG', name: 'Roy Gutta', role: 'Vice President' },
  { initials: 'MN', name: 'Meghana Nannapaneni', role: 'Vice President' },
  { initials: 'AD', name: 'Achyut Dipukumar', role: 'Treasurer' },
  { initials: 'JY', name: 'Junseo Yoo', role: 'Outreach' },
  { initials: 'DS', name: 'Daniel Sadeghi-Lari', role: 'Marketing' },
];

const avatarColors = [
  'bg-violet-100 text-violet-700',
  'bg-fuchsia-100 text-fuchsia-700',
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-indigo-100 text-indigo-700',
  'bg-pink-100 text-pink-700',
];

export default function TeamSection() {
  return (
    <section id="team" className="py-28 px-6 bg-secondary/40">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-12"
        >
          <p className="font-mono text-xs text-primary mb-3">// the_team</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Officers & Members
          </h2>
          <p className="mt-3 text-muted-foreground">
            Meet the student leaders keeping the club running.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {officers.map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="border border-border/70 rounded-xl p-6 bg-white text-center hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-base mx-auto ${avatarColors[i % avatarColors.length]}`}>
                {person.initials}
              </div>
              <div className="font-bold text-foreground text-base mt-3.5">{person.name}</div>
              <div className="text-primary text-xs font-semibold mt-1 uppercase tracking-wide">{person.role}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA — no "get in touch", just show up */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="border border-primary/25 bg-primary/5 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-extrabold text-xl text-foreground">Want to join us?</h3>
            <p className="text-muted-foreground mt-1.5 text-sm max-w-sm">
              All skill levels welcome. You don't need to sign up or register — just come through on a meeting day and introduce yourself.
            </p>
          </div>
          <div className="shrink-0 bg-white border border-border rounded-xl p-4 text-sm min-w-[200px] space-y-3">
            <div>
              <div className="font-mono text-xs text-muted-foreground mb-2">// next meeting</div>
              <div className="font-bold text-foreground">Every other Wednesday</div>
              <div className="text-muted-foreground text-xs mt-1">Room 264 · 3:30 PM</div>
            </div>
            <div className="border-t border-border pt-3">
              <div className="font-mono text-xs text-muted-foreground mb-1">// schoology_code</div>
              <div className="font-mono font-bold text-primary tracking-widest text-sm">TT8B-JQ6G-38RGH</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
