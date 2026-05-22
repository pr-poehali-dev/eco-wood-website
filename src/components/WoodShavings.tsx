import { useEffect, useRef } from 'react';

interface WoodShavingsProps {
  className?: string;
}

const SHAVING_PATHS = [
  'M0,0 Q15,-8 30,2 Q45,12 60,0 Q75,-10 90,4',
  'M0,0 Q20,10 40,-5 Q60,-18 80,8',
  'M0,0 Q12,15 28,5 Q44,-8 60,10 Q76,22 90,8',
  'M0,0 Q18,-12 36,6 Q54,18 72,2 Q88,-8 100,4',
  'M0,0 Q22,8 44,-4 Q66,-14 88,6',
];

const COLORS = ['#c2440a', '#a83800', '#e05010', '#b84020', '#d04818'];

interface Shaving {
  x: number;
  y: number;
  angle: number;
  scale: number;
  opacity: number;
  speed: number;
  rotSpeed: number;
  path: string;
  color: string;
  phase: number;
}

export default function WoodShavings({ className = '' }: WoodShavingsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const shavingsRef = useRef<Shaving[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const makeShaving = (): Shaving => ({
      x: Math.random() * (canvas.width || 300),
      y: -20 - Math.random() * 40,
      angle: Math.random() * Math.PI * 2,
      scale: 0.6 + Math.random() * 0.8,
      opacity: 0.5 + Math.random() * 0.5,
      speed: 0.4 + Math.random() * 0.8,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      path: SHAVING_PATHS[Math.floor(Math.random() * SHAVING_PATHS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      phase: Math.random() * Math.PI * 2,
    });

    shavingsRef.current = Array.from({ length: 12 }, makeShaving).map(s => ({
      ...s,
      y: Math.random() * (canvas.height || 300),
    }));

    let frame = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      frame++;
      if (frame % 90 === 0 && shavingsRef.current.length < 18) {
        shavingsRef.current.push(makeShaving());
      }

      shavingsRef.current = shavingsRef.current.filter(s => s.y < h + 30);

      for (const s of shavingsRef.current) {
        s.y += s.speed;
        s.x += Math.sin(s.phase + frame * 0.02) * 0.4;
        s.angle += s.rotSpeed;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        ctx.scale(s.scale, s.scale);
        ctx.globalAlpha = s.opacity;

        const p = new Path2D(s.path);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke(p);

        ctx.restore();

        if (s.y > h + 20) {
          const idx = shavingsRef.current.indexOf(s);
          shavingsRef.current[idx] = makeShaving();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
}
