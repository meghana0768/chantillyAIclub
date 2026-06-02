import { useEffect, useRef } from 'react';

const NeuralNetAnimation = ({ onReveal }) => {
  const canvasRef = useRef(null);
  const clockRef = useRef({ last: performance.now(), t: 0 });
  const revealedRef = useRef(false);
  const stateRef = useRef({
    nodes: [],
    edges: [],
    W: 0,
    H: 0,
    DPR: 1,
  });

  const CONFIG = {
    layers: [3, 5, 6, 5, 3],
    layerDelay: 0.82,
    revealAt: 4.4,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const state = stateRef.current;
    let rafId = 0;

    const resize = () => {
      state.DPR = Math.min(devicePixelRatio || 1, 2);
      state.W = innerWidth;
      state.H = innerHeight;
      canvas.width = state.W * state.DPR;
      canvas.height = state.H * state.DPR;
      canvas.style.width = state.W + 'px';
      canvas.style.height = state.H + 'px';
      ctx.setTransform(state.DPR, 0, 0, state.DPR, 0, 0);
      layout();
    };

    const build = () => {
      state.nodes = [];
      state.edges = [];
      CONFIG.layers.forEach((c, li) => {
        for (let i = 0; i < c; i++) {
          state.nodes.push({
            layer: li,
            x: 0,
            y: 0,
            base: Math.random() * 6.28,
          });
        }
      });
      for (let li = 0; li < CONFIG.layers.length - 1; li++) {
        const a = state.nodes.filter((n) => n.layer === li);
        const b = state.nodes.filter((n) => n.layer === li + 1);
        a.forEach((na) => b.forEach((nb) => state.edges.push({ a: na, b: nb, layer: li })));
      }
    };

    const layout = () => {
      const padX = state.W * 0.1;
      const padY = state.H * 0.08;
      const usableW = state.W - padX * 2;
      const L = CONFIG.layers.length;
      CONFIG.layers.forEach((c, li) => {
        const x = L === 1 ? state.W / 2 : padX + (usableW * li) / (L - 1);
        const sp = (state.H - padY * 2) / Math.max(c, 1);
        const startY = padY + sp / 2;
        let k = 0;
        state.nodes
          .filter((n) => n.layer === li)
          .forEach((n) => {
            n.x = x;
            n.y = startY + sp * k;
            k++;
          });
      });
    };

    const smooth = (a, b, x) => {
      const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    const frame = (now) => {
      const dt = Math.min((now - clockRef.current.last) / 1000, 0.05);
      clockRef.current.last = now;
      clockRef.current.t += dt;
      const t = clockRef.current.t;

      if (!revealedRef.current && t > CONFIG.revealAt) {
        revealedRef.current = true;
        document.body.classList.add('revealed');
        // Reveal the title + Enter button and let them stay on screen.
        // Advancing to the main site happens only when the user clicks
        // "Enter Site" (or "Skip"), matching the standalone HTML behavior.
      }

      ctx.clearRect(0, 0, state.W, state.H);
      ctx.lineCap = 'round';

      // EDGES
      state.edges.forEach((e) => {
        const start = e.layer * CONFIG.layerDelay;
        const front = (t - start) / CONFIG.layerDelay;
        ctx.beginPath();
        ctx.moveTo(e.a.x, e.a.y);
        ctx.lineTo(e.b.x, e.b.y);
        if (front <= 0) {
          ctx.strokeStyle = 'rgba(169,116,255,0.10)';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          const lit = Math.min(front, 1);
          ctx.shadowColor = 'rgba(169,116,255,0.9)';
          ctx.shadowBlur = 16;
          ctx.strokeStyle = 'rgba(169,116,255,' + (0.1 + 0.32 * lit) + ')';
          ctx.lineWidth = 2.3;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });

      // TRAVELING PULSE DOTS
      state.edges.forEach((e) => {
        const start = e.layer * CONFIG.layerDelay;
        const p = (t - start) / CONFIG.layerDelay;
        if (p > 0 && p < 1) {
          const dx = e.b.x - e.a.x;
          const dy = e.b.y - e.a.y;
          const x = e.a.x + dx * p;
          const y = e.a.y + dy * p;
          const tp = Math.max(0, p - 0.24);
          const tx = e.a.x + dx * tp;
          const ty = e.a.y + dy * tp;
          const lg = ctx.createLinearGradient(tx, ty, x, y);
          lg.addColorStop(0, 'rgba(201,168,255,0)');
          lg.addColorStop(1, 'rgba(255,255,255,0.95)');
          ctx.strokeStyle = lg;
          ctx.lineWidth = 4.4;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(x, y);
          ctx.stroke();
          const g = ctx.createRadialGradient(x, y, 0, x, y, 19);
          g.addColorStop(0, 'rgba(255,255,255,1)');
          g.addColorStop(0.32, 'rgba(201,168,255,0.95)');
          g.addColorStop(1, 'rgba(169,116,255,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, 19, 0, 6.2832);
          ctx.fill();
          ctx.shadowColor = 'rgba(255,255,255,0.95)';
          ctx.shadowBlur = 22;
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(x, y, 4.4, 0, 6.2832);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // NODES
      state.nodes.forEach((n) => {
        const start = n.layer * CONFIG.layerDelay;
        const act = smooth(0, 0.32, t - start);
        const pop = t > start ? Math.exp(-(t - start) * 4) * 0.6 : 0;
        const e = Math.min(act + pop, 1.3);
        const idle = 0.5 + 0.16 * Math.sin(t * 1.6 + n.base);
        const r = 4.5 + act * 3;

        ctx.shadowColor = 'rgba(169,116,255,' + (0.45 + act * 0.5) + ')';
        ctx.shadowBlur = 12 + act * 24;
        const g = ctx.createRadialGradient(
          n.x - r * 0.32,
          n.y - r * 0.32,
          r * 0.1,
          n.x,
          n.y,
          r
        );
        g.addColorStop(0, 'rgba(255,255,255,' + (0.85 * idle + e * 0.15) + ')');
        g.addColorStop(
          0.55,
          'rgba(' +
            Math.round(170 + e * 70) +
            ',' +
            Math.round(130 + e * 100) +
            ',255,' +
            (0.7 * idle + e * 0.3) +
            ')'
        );
        g.addColorStop(1, 'rgba(120,80,200,' + (0.25 + act * 0.4) + ')');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, 6.2832);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      rafId = requestAnimationFrame(frame);
    };

    window.addEventListener('resize', resize);
    build();
    resize();

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      CONFIG.revealAt = 0.3;
      clockRef.current.t = 10;
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
      document.body.classList.remove('revealed');
    };
  }, [onReveal]);

  const handleSkip = () => {
    // Fast-forward the intro so the title + Enter button reveal immediately.
    clockRef.current.t = Math.max(clockRef.current.t, CONFIG.revealAt + 0.1);
    revealedRef.current = true;
    document.body.classList.add('revealed');
  };

  const handleEnter = (e) => {
    e.preventDefault();
    // Advance into the main site.
    if (onReveal) onReveal();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#07040f' }}>
      {/* Vignette overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(20, 11, 40, 0.9) 0%, #07040f 100%)',
        }}
      />

      {/* Canvas animation */}
      <canvas
        ref={canvasRef}
        id="net"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          display: 'block',
        }}
      />

      {/* Center dim effect */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          background: 'radial-gradient(ellipse 60% 45% at 50% 50%, rgba(7, 4, 15, 0.82) 0%, rgba(7, 4, 15, 0) 65%)',
          opacity: 0,
          transition: 'opacity 1.4s ease-out',
        }}
        className="center-dim"
      />

      {/* Skip button */}
      <button
        onClick={handleSkip}
        style={{
          position: 'fixed',
          top: '22px',
          right: '26px',
          zIndex: 3,
          background: 'none',
          border: 'none',
          fontFamily: 'Sora, sans-serif',
          fontWeight: 300,
          fontSize: '12px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.4)',
          cursor: 'pointer',
          pointerEvents: 'auto',
          transition: 'color 200ms ease-out',
          padding: 0,
        }}
        onMouseEnter={(e) => (e.target.style.color = 'rgba(255, 255, 255, 0.85)')}
        onMouseLeave={(e) => (e.target.style.color = 'rgba(255, 255, 255, 0.4)')}
      >
        Skip ⏭
      </button>

      {/* Stage content */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
          padding: '0 24px',
        }}
      >
        <div
          className="kicker"
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 300,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontSize: '12px',
            color: '#c9a8ff',
            marginBottom: '24px',
            opacity: 0,
            transform: 'translateY(14px)',
            transition: 'opacity 0.9s ease-out, transform 0.9s ease-out',
            transitionDelay: '0.15s',
          }}
        >
          Chantilly High School
        </div>

        <h1
          style={{
            fontFamily: '"Michroma", sans-serif',
            fontSize: 'clamp(22px, 5.5vw, 58px)',
            lineHeight: '1.05',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: 'white',
            textShadow: '0 0 28px rgba(169, 116, 255, 0.55), 0 0 64px rgba(169, 116, 255, 0.25)',
            margin: 0,
          }}
        >
          <span
            className="word"
            style={{
              display: 'inline-block',
              opacity: 0,
              transform: 'translateY(22px) blur(8px)',
              transition: 'opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
              transitionDelay: '0.05s',
              filter: 'blur(8px)',
            }}
          >
            Chantilly
          </span>
          {' '}
          <span
            className="word"
            style={{
              display: 'inline-block',
              color: '#c9a8ff',
              opacity: 0,
              transform: 'translateY(22px) blur(8px)',
              transition: 'opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
              transitionDelay: '0.22s',
              filter: 'blur(8px)',
            }}
          >
            AI
          </span>
          {' '}
          <span
            className="word"
            style={{
              display: 'inline-block',
              opacity: 0,
              transform: 'translateY(22px) blur(8px)',
              transition: 'opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
              transitionDelay: '0.39s',
              filter: 'blur(8px)',
            }}
          >
            Club
          </span>
        </h1>

        <div
          className="sub"
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 300,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontSize: 'clamp(10px, 1.8vw, 14px)',
            color: 'rgba(255, 255, 255, 0.6)',
            marginTop: '24px',
            opacity: 0,
            transform: 'translateY(14px)',
            transition: 'opacity 0.9s ease-out, transform 0.9s ease-out',
            transitionDelay: '0.6s',
          }}
        >
          Learn · Build · Train the Future
        </div>

        <a
          href="#enter"
          onClick={handleEnter}
          className="enter"
          style={{
            pointerEvents: 'auto',
            marginTop: '32px',
            fontFamily: '"Sora", sans-serif',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontSize: 'clamp(13px, 1.8vw, 16px)',
            color: 'white',
            background: 'linear-gradient(to bottom right, rgba(169, 116, 255, 0.42), rgba(201, 168, 255, 0.22))',
            border: '1px solid rgba(201, 168, 255, 0.75)',
            borderRadius: '9999px',
            padding: '16px 40px',
            boxShadow: '0 0 28px rgba(169, 116, 255, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
            cursor: 'pointer',
            opacity: 0,
            transform: 'translateY(16px)',
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'opacity 0.9s ease-out, transform 0.9s ease-out, background 200ms, border-color 200ms, box-shadow 200ms',
            transitionDelay: '0.9s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(to bottom right, rgba(169, 116, 255, 0.6), rgba(201, 168, 255, 0.35))';
            e.target.style.borderColor = 'white';
            e.target.style.boxShadow = '0 0 40px rgba(169, 116, 255, 0.6)';
            e.target.querySelector('.arrow').style.transform = 'translateX(5px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(to bottom right, rgba(169, 116, 255, 0.42), rgba(201, 168, 255, 0.22))';
            e.target.style.borderColor = 'rgba(201, 168, 255, 0.75)';
            e.target.style.boxShadow = '0 0 28px rgba(169, 116, 255, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.05)';
            e.target.querySelector('.arrow').style.transform = 'translateX(0)';
          }}
        >
          Enter Site {' '}
          <span
            className="arrow"
            style={{
              display: 'inline-block',
              transition: 'transform 200ms ease-out',
            }}
          >
            →
          </span>
        </a>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Michroma&family=Sora:wght@300;400;600&display=swap');
        
        body.revealed .kicker,
        body.revealed .sub,
        body.revealed .enter {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        body.revealed .word {
          opacity: 1 !important;
          transform: translateY(0) !important;
          filter: blur(0) !important;
        }
        
        body.revealed .center-dim {
          opacity: 1 !important;
        }
        
        body {
          --purple: #a974ff;
          --purple-lt: #c9a8ff;
          --white: #fff;
        }
      `}</style>
    </div>
  );
};

export default NeuralNetAnimation;
