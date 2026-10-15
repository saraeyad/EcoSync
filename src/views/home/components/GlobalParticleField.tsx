import { useRef, useEffect, memo } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ox: number;
  oy: number;
  state: number;
  size: number;
  twinkle: number;
}

const PARTICLE_COUNT =
  typeof window !== "undefined" && window.innerWidth < 768 ? 48 : 72;
const CONNECTION_DIST = 0.1;
const REPEL_RADIUS = 0.1;
const REPEL_STRENGTH = 0.0025;
const SPRING_BACK = 0.04;
const FRICTION = 0.88;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

const C_SLEEP = hexToRgb("#7f1d1d");
const C_ACTIVE = hexToRgb("#10b981");
const C_LINE_S = hexToRgb("#3b0d0d");
const C_LINE_A = hexToRgb("#059669");

export const GlobalParticleField = memo(function GlobalParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ nx: -1, ny: -1 });
  const scroll = useRef(0);
  const raf = useRef(0);
  const particles = useRef<Particle[]>([]);
  const visible = useRef(true);

  useEffect(() => {
    const list: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random();
      const y = Math.random();
      list.push({
        x,
        y,
        vx: 0,
        vy: 0,
        ox: x,
        oy: y,
        state: 0,
        size: 1.2 + Math.random() * 1.8,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
    particles.current = list;
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.nx = e.clientX / window.innerWidth;
      mouse.current.ny =
        e.clientY / window.innerHeight +
        window.scrollY / document.body.scrollHeight;
    };
    const onLeave = () => {
      mouse.current.nx = -1;
      mouse.current.ny = -1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onVisibility = () => {
      visible.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    let frame = 0;
    const draw = () => {
      raf.current = requestAnimationFrame(draw);
      if (!visible.current) return;
      // Run physics/draw at ~30fps equivalent
      frame += 1;
      if (frame % 2 === 1) return;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const scrollRatio = scroll.current;
      const waveY = 0.15 + scrollRatio * 1.1;

      ctx.clearRect(0, 0, W, H);

      const ps = particles.current;
      const mx = mouse.current.nx;
      const my =
        mouse.current.ny - window.scrollY / document.body.scrollHeight;

      for (const p of ps) {
        const targetState = p.oy < waveY ? 1 : 0;
        p.state = lerp(p.state, targetState, 0.03);

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

        p.vx += (p.ox - p.x) * SPRING_BACK;
        p.vy += (p.oy - p.y) * SPRING_BACK;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += 0.03 + p.state * 0.02;
      }

      // Sparse connections — sample every other particle to cut O(n²)
      for (let i = 0; i < ps.length; i += 2) {
        const a = ps[i];
        for (let j = i + 2; j < ps.length; j += 2) {
          const b = ps[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > CONNECTION_DIST) continue;
          const alpha = (1 - d / CONNECTION_DIST) * 0.3;
          const blended = Math.max(a.state, b.state);
          const r = lerp(C_LINE_S[0], C_LINE_A[0], blended);
          const g = lerp(C_LINE_S[1], C_LINE_A[1], blended);
          const bl = lerp(C_LINE_S[2], C_LINE_A[2], blended);
          ctx.beginPath();
          ctx.moveTo(a.x * W, a.y * H);
          ctx.lineTo(b.x * W, b.y * H);
          ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      for (const p of ps) {
        const px = p.x * W;
        const py = p.y * H;
        const tw = 0.5 + 0.5 * Math.sin(p.twinkle);
        const sz = p.size * (0.85 + tw * 0.3 + p.state * 0.4);
        const r = lerp(C_SLEEP[0], C_ACTIVE[0], p.state);
        const g = lerp(C_SLEEP[1], C_ACTIVE[1], p.state);
        const b = lerp(C_SLEEP[2], C_ACTIVE[2], p.state);
        const alpha = 0.35 + p.state * 0.55 + tw * 0.1;
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }
    };

    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden
      style={{ opacity: 0.65 }}
    />
  );
});
