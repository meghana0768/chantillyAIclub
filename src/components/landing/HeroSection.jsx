import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const topics = ['Machine Learning', 'Neural Networks', 'Python & TensorFlow', 'Computer Vision', 'NLP', 'Hackathons', 'AI Ethics', 'Student Projects'];

export default function HeroSection() {
  return (
    <>
      {/* Main HeroSection content */}
      <section id="hero-content" className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden bg-secondary/50">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(270 85% 50% / 0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />
      
      {/* Soft purple wash bottom-right */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-[1fr_auto] gap-12 items-center">
          {/* Left: text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}>
              
              <span className="inline-flex items-center gap-2 font-mono text-xs text-primary bg-primary/8 border border-primary/20 px-3 py-1 rounded-md mb-5">
                <span className="text-muted-foreground select-none">></span>
                <span>print(<span className="text-orange-400">"welcome to chantilly AI club"</span>)</span>
                <span className="inline-block w-px h-[13px] bg-primary/60 ml-0.5" style={{ animation: 'blink 1s step-start infinite' }} />
                <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="text-4xl sm:text-5xl md:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight text-foreground">
              
              Where students learn<br />
              <span className="text-primary">to build intelligent</span><br />
              things.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="mt-5 text-base text-muted-foreground max-w-md leading-relaxed">
              
              A welcoming community at Chantilly High School for anyone curious about AI —
              from complete beginners to experienced coders. No sign-up needed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22 }}
              className="mt-7 flex flex-col sm:flex-row gap-3">
              
              <Link
                to="/Events"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors">

                See what's coming up <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/Projects"
                className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-muted transition-colors">

                Browse projects
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-10 flex gap-5 sm:gap-8 flex-wrap border-t border-border/50 pt-8">
              
              {[
                { value: '30+', label: 'Active Members' },
                { value: '8', label: 'Student Projects' },
                { value: '3+', label: 'Hackathons Entered' }].
              map((stat, i) =>
                <div key={stat.label} className={`${i > 0 ? 'pl-5 sm:pl-8 border-l border-border/50' : ''}`}>
                  <div className="text-2xl font-extrabold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-medium">{stat.label}</div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: code snippet card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden md:block">
            
            <div className="bg-[#0a1628] rounded-xl overflow-hidden shadow-2xl shadow-primary/20 w-[300px]">
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                <span className="ml-3 font-mono text-xs text-white/30">mission.py</span>
              </div>
              <div className="p-5 font-mono text-xs leading-relaxed">
                <p className="text-white/30"># Who we are</p>
                <p className="mt-2">
                  <span className="text-blue-300">club</span>
                  <span className="text-white/60"> = </span>
                  <span className="text-white">{'{'}</span>
                </p>
                <p className="pl-4"><span className="text-green-300">"goal"</span><span className="text-white/60">: </span><span className="text-orange-300">"empower students"</span><span className="text-white/60">,</span></p>
                <p className="pl-4"><span className="text-green-300">"focus"</span><span className="text-white/60">: </span><span className="text-orange-300">"build with AI"</span><span className="text-white/60">,</span></p>
                <p className="pl-4"><span className="text-green-300">"open_to"</span><span className="text-white/60">: </span><span className="text-orange-300">"everyone"</span><span className="text-white/60">,</span></p>
                <p className="pl-4"><span className="text-green-300">"school"</span><span className="text-white/60">: </span><span className="text-orange-300">"Chantilly High School"</span><span className="text-white/60">,</span></p>
                <p className="pl-4"><span className="text-green-300">"room"</span><span className="text-white/60">: </span><span className="text-orange-300">"264"</span></p>
                <p><span className="text-white">{'}'}</span></p>
                <p className="mt-4 text-white/30"># No experience required</p>
                <p className="mt-1"><span className="text-blue-300">required_skills</span><span className="text-white/60"> = </span><span className="text-orange-300">[]</span></p>
                <p className="mt-1 text-white/40 font-mono">{'> '}curiosity preferred</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Topic ticker */}
      <div className="mt-16 border-t border-border/50 py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...topics, ...topics].map((t, i) =>
            <span key={i} className="inline-flex items-center gap-2 mx-5 text-xs font-medium text-muted-foreground">
              <span className="text-primary">·</span> {t}
            </span>
          )}
        </div>
      </div>
    </section>
    </>
  );
}
