import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { value: '30+', label: 'Active Members', sub: 'Students from every grade and experience background' },
  { value: '8', label: 'Student Projects', sub: 'Real deployed apps and ML models built by members' },
  { value: 'Bi-weekly', label: 'Wednesday Meetings', sub: 'Every other Wednesday in Room 264 — all welcome' },
  { value: '3+', label: 'Hackathons Entered', sub: 'Competing locally and regionally in AI challenges' },
  { value: '5+', label: 'Guest Speakers', sub: 'Industry professionals sharing their work with us' },
  { value: '0', label: 'Experience Required', sub: 'We teach from the ground up — just bring curiosity' }
];

export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-28 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="grid md:grid-cols-2 gap-14 items-start">
          
          {/* Left text */}
          <div>
            <p className="font-mono text-xs text-primary mb-3">// about_us</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              Built by students,<br />for students.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Chantilly AI Club is open to <strong className="text-foreground font-semibold">everyone</strong> regardless of experience.
              Whether you've never written a line of code or you've already trained a model — you belong here.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We run hands-on workshops, bring in guest speakers from the industry,
              collaborate on real projects, and compete in hackathons — all while keeping it genuinely fun.
            </p>
            <div className="mt-6 inline-flex items-start gap-2.5 bg-secondary border border-border rounded-lg px-4 py-3">
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground">
                We meet <span className="font-semibold">every other Wednesday</span> in <span className="font-semibold">Room 264</span>.{' '}
                <span className="text-muted-foreground"></span>
              </p>
            </div>
          </div>

          {/* Right: stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) =>
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="border border-border/70 rounded-xl p-4 bg-white hover:border-primary/30 hover:shadow-sm transition-all duration-200">
                <div className="text-2xl font-extrabold text-primary">{s.value}</div>
                <div className="font-semibold text-sm text-foreground mt-1">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-snug">{s.sub}</div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>);
}
