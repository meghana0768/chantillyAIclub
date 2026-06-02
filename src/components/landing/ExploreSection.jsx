import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Info, Code2, CalendarDays, Users, ArrowUpRight } from 'lucide-react';

const cards = [
  {
    to: '/About',
    icon: Info,
    title: 'About',
    desc: 'Who we are, what we do, and why anyone is welcome — no experience needed.',
    accent: 'from-violet-500/10 to-violet-500/0',
  },
  {
    to: '/Projects',
    icon: Code2,
    title: 'Projects',
    desc: 'Real apps and ML models built by our members — from mood music to plant disease classifiers.',
    accent: 'from-fuchsia-500/10 to-fuchsia-500/0',
  },
  {
    to: '/Events',
    icon: CalendarDays,
    title: 'Events',
    desc: 'Workshops, guest speakers, and hackathons. See what is coming up next.',
    accent: 'from-blue-500/10 to-blue-500/0',
  },
  {
    to: '/Team',
    icon: Users,
    title: 'Team',
    desc: 'Meet the student officers keeping the club running this year.',
    accent: 'from-purple-500/10 to-purple-500/0',
  },
];

export default function ExploreSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <p className="font-mono text-xs text-primary mb-3">// explore</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Take a look around
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md">
            Everything about the club, split into its own space. Tap in.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.to}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <Link
                  to={c.to}
                  className={`group relative block overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br ${c.accent} p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <h3 className="mt-4 font-bold text-lg text-foreground">{c.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
