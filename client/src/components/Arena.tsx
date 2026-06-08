import { useRef, useEffect } from 'react';
import type { Robot } from '../types/robot';
import styles from './Arena.module.css';

const ROBOT_COLORS = ['#818cf8', '#34d399', '#f472b6', '#fb923c', '#38bdf8'];

interface Props {
  robots: Robot[];
}

export function Arena({ robots }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    function toCanvas(x: number, y: number): [number, number] {
      return [(x / 100) * W, (y / 100) * H];
    }

    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const gx = (i / 10) * W;
      const gy = (i / 10) * H;
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }

    robots.forEach((r, i) => {
      const color = ROBOT_COLORS[i % ROBOT_COLORS.length];
      const [cx, cy] = toCanvas(r.position.x, r.position.y);
      const rad = (r.heading * Math.PI) / 180;

      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
      grd.addColorStop(0, color + '35');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fill();

      const arrowEnd = 24;
      const ax = cx + Math.cos(rad) * arrowEnd;
      const ay = cy + Math.sin(rad) * arrowEnd;
      ctx.strokeStyle = color + 'bb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ax, ay);
      ctx.stroke();

      const hl = 7;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax - hl * Math.cos(rad - 0.45), ay - hl * Math.sin(rad - 0.45));
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax - hl * Math.cos(rad + 0.45), ay - hl * Math.sin(rad + 0.45));
      ctx.stroke();

      ctx.fillStyle = r.status === 'error' ? '#ef4444' : color;
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 10px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(r.id.replace('robot_', 'R'), cx, cy - 13);
    });
  }, [robots]);

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Live Arena — 100 × 100 m</p>
      <canvas ref={canvasRef} width={500} height={500} className={styles.canvas} />
    </div>
  );
}
