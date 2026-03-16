import { useRef, useEffect, memo } from "react";

interface Particle {
  x:  number; y:  number;  // world position (0–1 normalised)
  vx: number; vy: number;  // velocity
  ox: number; oy: number;  // origin (for spring-back)
  state: number;           // 0 = dark, 1 = emerald (lerped)
  size: number;
  twinkle: number;         // phase offset for twinkling
}

const PARTICLE_COUNT = 180;
const CONNECTION_DIST = 0.12; // max distance (normalised) to draw a line
const REPEL_RADIUS   = 0.10;
const REPEL_STRENGTH = 0.0025;
const SPRING_BACK    = 0.04;
const FRICTION       = 0.88;

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

const C_SLEEP  = hexToRgb("#7f1d1d"); // very dark crimson
const C_ACTIVE = hexToRgb("#10b981"); // emerald
const C_LINE_S = hexToRgb("#3b0d0d"); // dark-red line
const C_LINE_A = hexToRgb("#059669"); // emerald line

export const GlobalParticleField = memo(function GlobalParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse     = useRef({ nx: -1, ny: -1 }); // normalised mouse pos
  const scroll    = useRef(0); // 0–1 scroll progress
  const raf       = useRef(0);
  const particles = useRef<Particle[]>([]);

  // Build particle grid once
  useEffect(() => {
    const list: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random();
      const y = Math.random();
      list.push({
        x, y, vx: 0, vy: 0, ox: x, oy: y,
        state: 0,
        size: 1.2 + Math.random() * 1.8,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
    particles.current = list;
  }, []);

  // Mouse tracking (normalised 0–1)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.nx = e.clientX / window.innerWidth;
      mouse.current.ny = e.clientY / window.innerHeight + window.scrollY / document.body.scrollHeight;
    };
    const onLeave = () => { mouse.current.nx = -1; mouse.current.ny = -1; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Scroll progress tracking
  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;

    const draw = () => {
      raf.current = requestAnimationFrame(draw);
      t += 0.008;

      const W = canvas.width;
      const H = canvas.height;

      // Full-page scroll offset so particles stay fixed in viewport
      const scrollRatio = scroll.current;
      // Activation wavefront: starts at top, sweeps down as you scroll
      // At scroll=0 top 20% is active, at scroll=1 all are active
      const waveY = 0.15 + scrollRatio * 1.1; // 0–1 normalised page height

      ctx.clearRect(0, 0, W, H);

      const ps = particles.current;
      const mx = mouse.current.nx;
      const my = mouse.current.ny - (window.scrollY / document.body.scrollHeight);

      // ── Update particles ──────────────────────────────────────────────
      for (const p of ps) {
        // Target state based on wavefront (particles above wave = active)
        const targetState = p.oy < waveY ? 1 : 0;
        p.state = lerp(p.state, targetState, 0.018);

        // Mouse repulsion
        if (mx >= 0) {
          const dx = p.x - mx;
          const dy = p.y - my * (H / Math.max(document.body.scrollHeight, H));
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPEL_RADIUS && dist > 0.001) {
            const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
            p.vx += (dx / dist) * REPEL_STRENGTH * force * force;
            p.vy += (dy / dist) * REPEL_STRENGTH * force * force;
          }
        }

        // Spring back to origin
        p.vx += (p.ox - p.x) * SPRING_BACK;
        p.vy += (p.oy - p.y) * SPRING_BACK;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x  += p.vx;
        p.y  += p.vy;

        // Twinkling phase
        p.twinkle += 0.018 + p.state * 0.012;
      }

      // ── Draw connection lines ─────────────────────────────────────────
      for (let i = 0; i < ps.length; i++) {
        const a = ps[i];
        for (let j = i + 1; j < ps.length; j++) {
          const b = ps[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d > CONNECTION_DIST) continue;

          const alpha   = (1 - d / CONNECTION_DIST) * 0.35;
          const blended = Math.max(a.state, b.state);

          const [r, g, bl] = [
            lerp(C_LINE_S[0], C_LINE_A[0], blended),
            lerp(C_LINE_S[1], C_LINE_A[1], blended),
            lerp(C_LINE_S[2], C_LINE_A[2], blended),
          ];

          ctx.beginPath();
          ctx.moveTo(a.x * W, a.y * H);
          ctx.lineTo(b.x * W, b.y * H);
          ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }

      // ── Draw particles ────────────────────────────────────────────────
      for (const p of ps) {
        const px = p.x * W;
        const py = p.y * H;
        const tw = 0.5 + 0.5 * Math.sin(p.twinkle);
        const sz = p.size * (0.85 + tw * 0.3 + p.state * 0.4);

        const [r, g, b] = [
          lerp(C_SLEEP[0], C_ACTIVE[0], p.state),
          lerp(C_SLEEP[1], C_ACTIVE[1], p.state),
          lerp(C_SLEEP[2], C_ACTIVE[2], p.state),
        ];

        // Glow halo for active particles
        if (p.state > 0.1) {
          const glowAlpha = p.state * tw * 0.25;
          const grd = ctx.createRadialGradient(px, py, 0, px, py, sz * 5);
          grd.addColorStop(0, `rgba(${r},${g},${b},${glowAlpha})`);
          grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(px, py, sz * 5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Particle dot
        const alpha = 0.35 + p.state * 0.55 + tw * 0.1;
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      // ── Activation wavefront glow line ────────────────────────────────
      if (waveY > 0 && waveY < 1) {
        const wy = waveY * H;
        const grad = ctx.createLinearGradient(0, wy, W, wy);
        grad.addColorStop(0,   "rgba(16,185,129,0)");
        grad.addColorStop(0.3, "rgba(16,185,129,0.07)");
        grad.addColorStop(0.5, "rgba(16,185,129,0.14)");
        grad.addColorStop(0.7, "rgba(16,185,129,0.07)");
        grad.addColorStop(1,   "rgba(16,185,129,0)");
        ctx.beginPath();
        ctx.moveTo(0, wy);
        ctx.lineTo(W, wy);
        ctx.strokeStyle = grad as unknown as string;
        ctx.lineWidth   = 1.5;
        ctx.stroke();
      }
    };

    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden
      style={{ opacity: 0.75 }}
    />
  );
});
