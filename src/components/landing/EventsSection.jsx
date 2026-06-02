import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const events = [
  {
    month: 'Mar', day: '19',
    title: 'Intro to Neural Networks Workshop',
    location: 'Room 264',
    time: null,
    desc: 'Build and train your first neural network using Python & TensorFlow.',
    type: 'Workshop',
  },
  {
    month: 'Apr', day: '02',
    title: 'Guest Speaker: AI in Healthcare',
    location: 'Auditorium',
    time: null,
    desc: 'A George Mason researcher discusses AI-driven diagnostics and the future of medical AI.',
    type: 'Speaker',
  },
  {
    month: 'Apr', day: '16',
    title: 'Spring Hackathon — Build Something Cool',
    location: 'Library & Commons',
    time: '9 AM–5 PM',
    desc: 'Form teams, build an AI project in one day. All skill levels welcome.',
    type: 'Hackathon',
    featured: true,
  },
  {
    month: 'Apr', day: '30',
    title: 'AI Ethics Roundtable',
    location: 'Room 264',
    time: null,
    desc: 'Open discussion on bias, fairness, and the future of AI in society.',
    type: 'Discussion',
  },
];

const typeStyle = {
  Workshop:   'bg-violet-50 text-violet-700 border-violet-200',
  Speaker:    'bg-blue-50 text-blue-700 border-blue-200',
  Hackathon:  'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
  Discussion: 'bg-orange-50 text-orange-700 border-orange-200',
};

export default function EventsSection() {
  return (
    <section id="events" className="py-16 md:py-28 px-6 bg-secondary/40">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-12"
        >
          <p className="font-mono text-xs text-primary mb-3">// upcoming_events</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            What's coming up
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md">
            Workshops, speakers, hackathons — there's always something on the calendar.
          </p>
        </motion.div>

        <div className="space-y-3">
          {events.map((ev, i) => (
            <motion.div
              key={ev.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className={`flex gap-5 p-5 rounded-xl border bg-white transition-all hover:shadow-md hover:border-primary/30 border-border/70`}
            >
              {/* Date */}
              <div className="shrink-0 w-14 text-center">
                <div className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">{ev.month}</div>
                <div className="text-3xl font-extrabold text-foreground leading-none mt-0.5">{ev.day}</div>
              </div>

              {/* Divider */}
              <div className="w-px bg-border self-stretch" />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded border ${typeStyle[ev.type]}`}>
                    {ev.type}
                  </span>
                  {ev.featured && (
                    <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded border bg-primary/10 text-primary border-primary/20">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-foreground text-base leading-snug">{ev.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{ev.desc}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {ev.location}
                  </span>
                  {ev.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {ev.time}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
