import { useEffect, useRef, useCallback } from "react";

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]|;:,.<>?/!@#$%^&*()_+-=";

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  length: number;
  opacity: number;
}

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const columnsRef = useRef<Column[]>([]);
  const animFrameRef = useRef<number>(0);

  const initColumns = useCallback((width: number, height: number) => {
    const fontSize = 14;
    const numCols = Math.ceil(width / fontSize);
    const cols: Column[] = [];

    for (let i = 0; i < numCols; i++) {
      const length = Math.floor(Math.random() * 25) + 8;
      const chars: string[] = [];
      for (let j = 0; j < length; j++) {
        chars.push(CHARS[Math.floor(Math.random() * CHARS.length)]);
      }
      cols.push({
        x: i * fontSize,
        y: Math.random() * height * 2 - height,
        speed: Math.random() * 2 + 1,
        chars,
        length,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
    columnsRef.current = cols;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initColumns(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const fontSize = 14;

    const draw = () => {
      ctx.fillStyle = "rgba(5, 15, 8, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      columnsRef.current.forEach((col) => {
        const dx = col.x - mx;
        const dy = col.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseInfluence = Math.max(0, 1 - dist / 250);

        const dynamicSpeed = col.speed + mouseInfluence * 4;
        const dynamicOpacity = col.opacity + mouseInfluence * 0.5;

        for (let j = 0; j < col.chars.length; j++) {
          const charY = col.y - j * fontSize;
          if (charY < -fontSize || charY > canvas.height + fontSize) continue;

          const charDx = col.x - mx;
          const charDy = charY - my;
          const charDist = Math.sqrt(charDx * charDx + charDy * charDy);
          const charInfluence = Math.max(0, 1 - charDist / 200);

          const progress = j / col.chars.length;

          if (j === 0) {
            const brightness = 0.9 + charInfluence * 0.1;
            ctx.fillStyle = `rgba(0, 255, 100, ${brightness})`;
            ctx.shadowColor = "rgba(0, 255, 100, 0.8)";
            ctx.shadowBlur = 8 + charInfluence * 15;
          } else {
            const fade = (1 - progress) * dynamicOpacity;
            const g = Math.floor(180 + charInfluence * 75);
            const r = Math.floor(charInfluence * 40);
            ctx.fillStyle = `rgba(${r}, ${g}, 60, ${fade})`;
            ctx.shadowColor = `rgba(0, ${g}, 60, ${fade * 0.3})`;
            ctx.shadowBlur = charInfluence * 10;
          }

          ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

          const offsetX = charInfluence * (dx / dist || 0) * 8;

          ctx.fillText(col.chars[j], col.x + offsetX, charY);

          if (Math.random() < 0.005 + charInfluence * 0.05) {
            col.chars[j] = CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }

        ctx.shadowBlur = 0;

        col.y += dynamicSpeed;

        if (col.y - col.chars.length * fontSize > canvas.height) {
          col.y = -col.chars.length * fontSize;
          col.speed = Math.random() * 2 + 1;
          col.opacity = Math.random() * 0.4 + 0.1;
        }
      });

      if (mx > 0 && my > 0) {
        const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, 180);
        gradient.addColorStop(0, "rgba(0, 255, 100, 0.03)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(mx - 180, my - 180, 360, 360);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [initColumns]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="canvas-matrix-rain"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        background: "linear-gradient(180deg, #020a05 0%, #050f08 50%, #020a05 100%)",
      }}
    />
  );
}
