import { useEffect, useRef } from 'react';

const NeuralNetAnimation = ({ onReveal }) => {
  const canvasRef = useRef(null);
  const clockRef = useRef({ last: performance.now(), t: 0 });
  const revealedRef = useRef(false);
  const stateRef = useRef({
    nodes: [],
    edges: [],
    nodesByLayer: [],
    W: 0,
    H: 0,
    DPR: 1,
  });

  const CONFIG = {
    layers: [3, 5, 6, 5, 3],
    layerDelay: 0.82,
    revealAt: 4.2,
    startDelay: 0.6, // seconds the network sits idle before the first pulse
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
      state.nodesByLayer = [];
      // Build nodes once, grouped by layer in the same order as before, so
      // we never have to re-scan the whole node list to find a layer's nodes.
      CONFIG.layers.forEach((c, li) => {
        const group = [];
        for (let i = 0; i < c; i++) {
          const node = { layer: li, x: 0, y: 0, base: Math.random() * 6.28 };
          state.nodes.push(node);
          group.push(node);
        }
        state.nodesByLayer.push(group);
      });
      for (let li = 0; li < CONFIG.layers.length - 1; li++) {
        const a = state.nodesByLayer[li];
        const b = state.nodesByLayer[li + 1];
        a.forEach((na) => b.forEach((nb) => state.edges.push({ a: na, b: nb, layer: li })));
      }
    };

    const layout = () => {
      // On phones the viewport is tall and narrow, so use more of the width
      // and don't let the network stretch as tall. Desktop is unchanged.
      const mobile = state.W < 768;
      const padX = state.W * (mobile ? 0.05 : 0.12);
      const padY = state.H * (mobile ? 0.16 : 0.06);
      const usableW = state.W - padX * 2;
      const L = CONFIG.layers.length;
      CONFIG.layers.forEach((c, li) => {
        const x = L === 1 ? state.W / 2 : padX + (usableW * li) / (L - 1);
        const sp = (state.H - padY * 2) / Math.max(c, 1);
        const startY = padY + sp / 2;
        const group = state.nodesByLayer[li];
        for (let k = 0; k < group.length; k++) {
          group[k].x = x;
          group[k].y = startY + sp * k;
        }
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
      // Animation timeline: the network sits idle for startDelay seconds after
      // the page opens, then the first pulse begins. Everything that drives the
      // sweep (edge fronts, pulses, node activation, the reveal) runs off `ta`.
      const ta = t - CONFIG.startDelay;

      if (!revealedRef.current && ta > CONFIG.revealAt) {
        revealedRef.current = true;
        document.body.classList.add('revealed');
        // Reveal the title + Enter button and let them stay on screen.
        // Advancing to the main site happens only when the user clicks
        // "Enter Site" (or "Skip"), matching the standalone HTML behavior.
      }

      ctx.clearRect(0, 0, state.W, state.H);
      ctx.lineCap = 'round';

      // ---------- EDGES ----------
      // No shadowBlur (it's the #1 canvas perf killer). The glow is built from
      // a wide faint underlay stroke + a bright thin core stroke on the same
      // line — visually similar, but cheap enough to draw every edge live.
      state.edges.forEach((e) => {
        const start = e.layer * CONFIG.layerDelay;
        const front = (ta - start) / CONFIG.layerDelay; // 0 at source, 1 at target
        ctx.beginPath();
        ctx.moveTo(e.a.x, e.a.y);
        ctx.lineTo(e.b.x, e.b.y);
        if (front <= 0) {
          ctx.strokeStyle = 'rgba(169,116,255,0.10)';
          ctx.lineWidth = 1;
          ctx.stroke(); // dim / inactive
        } else {
          const lit = Math.min(front, 1); // portion already energized → stays lit
          ctx.strokeStyle = 'rgba(169,116,255,' + (0.05 + 0.16 * lit) + ')';
          ctx.lineWidth = 5.5;
          ctx.stroke();
          ctx.strokeStyle = 'rgba(214,196,255,' + (0.16 + 0.5 * lit) + ')';
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }
      });

      // ---------- TRAVELING PULSE DOTS ----------
      state.edges.forEach((e) => {
        const start = e.layer * CONFIG.layerDelay;
        const p = (ta - start) / CONFIG.layerDelay;
        if (p > 0 && p < 1) {
          const dx = e.b.x - e.a.x;
          const dy = e.b.y - e.a.y;
          const x = e.a.x + dx * p;
          const y = e.a.y + dy * p;
          // comet tail trailing the head
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
          // outer glow bloom (radial gradient — already glows, no shadowBlur)
          const g = ctx.createRadialGradient(x, y, 0, x, y, 19);
          g.addColorStop(0, 'rgba(255,255,255,1)');
          g.addColorStop(0.32, 'rgba(201,168,255,0.95)');
          g.addColorStop(1, 'rgba(169,116,255,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, 19, 0, 6.2832);
          ctx.fill();
          // bright core
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(x, y, 4.2, 0, 6.2832);
          ctx.fill();
        }
      });

      // ---------- NODES (round dots, glow on activation) ----------
      state.nodes.forEach((n) => {
        const start = n.layer * CONFIG.layerDelay;
        const act = smooth(0, 0.32, ta - start); // 0 → 1 as the pulse reaches it
        const pop = ta > start ? Math.exp(-(ta - start) * 4) * 0.6 : 0;
        const e = Math.min(act + pop, 1.3);
        const idle = 0.5 + 0.16 * Math.sin(t * 1.6 + n.base);
        const r = 4.5 + act * 3;

        // soft halo glow (cheap radial fill, no shadowBlur)
        const hr = r * 3.2;
        const hg = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, hr);
        hg.addColorStop(0, 'rgba(169,116,255,' + (0.1 + act * 0.3) + ')');
        hg.addColorStop(1, 'rgba(169,116,255,0)');
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(n.x, n.y, hr, 0, 6.2832);
        ctx.fill();

        // node sphere (offset highlight = 3D)
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
    // Set up the canvas + animation loop exactly once. onReveal is only used
    // by the click handler below (not inside this effect), so it must NOT be a
    // dependency — otherwise the whole canvas would tear down and rebuild every
    // time the parent re-renders, stacking work and stuttering.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSkip = () => {
    // Fast-forward the intro so the title + Enter button reveal immediately.
    // Account for the start delay so the network also finishes lighting up.
    clockRef.current.t = Math.max(
      clockRef.current.t,
      CONFIG.startDelay + CONFIG.revealAt + 0.1
    );
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
        <h1
          style={{
            fontFamily: '"Michroma", sans-serif',
            fontSize: 'clamp(21px, 5vw, 56px)',
            lineHeight: '1.12',
            letterSpacing: '0.04em',
            wordSpacing: '0.35em',
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
              transform: 'scale(1.5)',
              willChange: 'transform, opacity',
              transition: 'opacity 0.16s ease-out, transform 0.3s cubic-bezier(0.2, 0.9, 0.25, 1)',
              transitionDelay: '0.05s',
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
              transform: 'scale(1.5)',
              willChange: 'transform, opacity',
              transition: 'opacity 0.16s ease-out, transform 0.3s cubic-bezier(0.2, 0.9, 0.25, 1)',
              transitionDelay: '0.22s',
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
              transform: 'scale(1.5)',
              willChange: 'transform, opacity',
              transition: 'opacity 0.16s ease-out, transform 0.3s cubic-bezier(0.2, 0.9, 0.25, 1)',
              transitionDelay: '0.39s',
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
          transform: scale(1) !important;
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
