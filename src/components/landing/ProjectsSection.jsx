import React from 'react';
import { motion } from 'framer-motion';

const projects = [
  {
    emoji: '🎵',
    title: 'Mood-Based Music Recommender',
    desc: 'Analyzes facial expressions via webcam and recommends Spotify songs based on detected mood.',
    tags: ['Python', 'OpenCV', 'Spotify API'],
  },
  {
    emoji: '📰',
    title: 'Fake News Detector',
    desc: 'Browser extension using NLP to evaluate article credibility and flag misleading content.',
    tags: ['JavaScript', 'Hugging Face', 'NLP'],
  },
  {
    emoji: '🤖',
    title: 'CHS Study Assistant Bot',
    desc: 'Chatbot trained on Chantilly course materials to help students prep for exams.',
    tags: ['LangChain', 'RAG', 'GPT API'],
  },
  {
    emoji: '🌿',
    title: 'Plant Disease Classifier',
    desc: 'CNN model identifying plant diseases from photos at 92% accuracy.',
    tags: ['TensorFlow', 'CNN', 'Keras'],
  },
  {
    emoji: '🏃',
    title: 'Sports Performance Analyzer',
    desc: 'Computer vision tool analyzing running form from video with coaching feedback.',
    tags: ['MediaPipe', 'Python', 'React'],
  },
  {
    emoji: '✍️',
    title: 'AI Writing Coach',
    desc: 'Essay feedback aligned with AP and SAT rubrics to help students improve their writing.',
    tags: ['OpenAI API', 'Next.js', 'Tailwind'],
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-16 md:py-28 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-12"
        >
          <p className="font-mono text-xs text-primary mb-3">// student_projects</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            What we've built
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md">
            Real things made by our members — ML experiments, deployed apps, and more.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="border border-border/70 rounded-xl p-5 bg-card hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 group"
            >
              <span className="text-2xl">{p.emoji}</span>
              <h3 className="font-bold text-foreground mt-3 mb-2 leading-snug text-sm">{p.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map(tag => (
                  <span key={tag} className="font-mono text-[10px] px-2 py-0.5 bg-secondary text-secondary-foreground rounded border border-border/60">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
