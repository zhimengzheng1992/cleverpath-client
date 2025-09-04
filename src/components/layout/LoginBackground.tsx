"use client";
import React, { useEffect, useRef } from "react";

/** 轻量 class 合并 */
const cx = (...a: Array<string | false | null | undefined>) =>
  a.filter(Boolean).join(" ");

type Props = {
  children: React.ReactNode;
  withCard?: boolean; // 是否包裹成居中卡片
  cardClassName?: string; // 覆盖卡片样式
};

export default function LoginBackground({
  children,
  withCard = true,
  cardClassName,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  /** 视差（鼠标移动带动极光偏移 & 卡片轻微倾斜） */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width; // 0..1
      const y = (e.clientY - r.top) / r.height; // 0..1
      el.style.setProperty("--px", String(x));
      el.style.setProperty("--py", String(y));
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  /** 粒子星空 */
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0,
      H = 0;

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let ps: P[] = [];

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const resize = () => {
      const rect = cvs.getBoundingClientRect();
      W = Math.floor(rect.width * dpr);
      H = Math.floor(rect.height * dpr);
      cvs.width = W;
      cvs.height = H;

      const count = Math.min(
        160,
        Math.floor((rect.width * rect.height) / 8000)
      );
      ps = Array.from({ length: count }).map(() => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: rnd(-0.25, 0.25) * dpr,
        vy: rnd(-0.25, 0.25) * dpr,
        r: rnd(0.7, 1.8) * dpr,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // 星点
      ctx.globalCompositeOperation = "lighter";
      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        g.addColorStop(0, "rgba(255,255,255,0.9)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 连线
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i],
            b = ps[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          const R = 120 * dpr;
          if (d2 < R * R) {
            const alpha = 0.22 * (1 - Math.sqrt(d2) / R);
            ctx.strokeStyle = `rgba(148,163,184,${alpha})`;
            ctx.lineWidth = 0.7 * dpr;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(cvs);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current || 0);
      ro.disconnect();
    };
  }, []);

  /** 点击光环/波纹效果（不阻塞点击） */
  useEffect(() => {
    const root = rootRef.current;
    const host = rippleRef.current;
    if (!root || !host) return;

    const spawnRipple = (x: number, y: number) => {
      // 限制最多保留若干个节点，避免 DOM 积累
      while (host.childElementCount > 12) host.firstChild?.remove();

      // 外环（描边）
      const ring = document.createElement("span");
      ring.className = "login-ring";
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;
      host.appendChild(ring);
      ring.addEventListener("animationend", () => ring.remove());

      // 内环（填充更柔和）
      const ring2 = document.createElement("span");
      ring2.className = "login-ring-2";
      ring2.style.left = `${x}px`;
      ring2.style.top = `${y}px`;
      host.appendChild(ring2);
      ring2.addEventListener("animationend", () => ring2.remove());
    };

    const onDown = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      spawnRipple(e.clientX - r.left, e.clientY - r.top);
    };

    root.addEventListener("pointerdown", onDown, { passive: true });
    return () => root.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <div
      ref={rootRef}
      className={cx(
        "relative min-h-screen w-full overflow-hidden",
        "bg-[#0b1220]" // 深邃底色
      )}
      style={
        {
          ["--px" as any]: 0.5,
          ["--py" as any]: 0.5,
        } as React.CSSProperties
      }
    >
      {/* 1) 背景渐变平移（可见动态） */}
      <div
        className="absolute inset-0 -z-10 animate-[bg-pan_30s_linear_infinite] opacity-90"
        style={{
          background:
            "linear-gradient(120deg,#0ea5e9 0%,#4338ca 35%,#7c3aed 65%,#0ea5e9 100%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* 2) 极光（鼠标视差） */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 blur-3xl"
        style={{
          transform:
            "translate3d(calc((var(--px) - .5) * 36px), calc((var(--py) - .5) * 36px), 0)",
          background:
            "radial-gradient(800px 500px at 20% 30%, rgba(99,102,241,0.55), transparent 60%), radial-gradient(700px 500px at 85% 60%, rgba(14,165,233,0.55), transparent 60%), radial-gradient(600px 400px at 50% 90%, rgba(236,72,153,0.45), transparent 60%)",
        }}
      />

      {/* 3) 霓虹流体漂浮 */}
      <div className="pointer-events-none absolute -inset-10 z-0 mix-blend-screen">
        <div className="absolute left-1/5 top-1/4 h-[40vmax] w-[40vmax] rounded-full bg-fuchsia-500 opacity-35 blur-[80px] animate-[blob_20s_ease-in-out_infinite]" />
        <div className="absolute right-1/6 top-1/3 h-[36vmax] w-[36vmax] rounded-full bg-sky-400 opacity-35 blur-[80px] animate-[blob_24s_ease-in-out_infinite_3s]" />
        <div className="absolute left-1/3 bottom-1/5 h-[34vmax] w-[34vmax] rounded-full bg-violet-500 opacity-30 blur-[80px] animate-[blob_28s_ease-in-out_infinite_6s]" />
      </div>

      {/* 4) 粒子星空 */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      />

      {/* 5) 细网格（很淡） */}
      <svg
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="white"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>

      {/* 6) Ripple 容器（置顶且不拦截指针） */}
      <div
        ref={rippleRef}
        className="pointer-events-none absolute inset-0 z-[60]"
      />

      {/* 7) 内容区（浅色卡片，更配深色背景） */}
      <div className="relative z-40 grid min-h-screen place-items-center p-4">
        {withCard ? (
          <div
            className={cx(
              "w-full max-w-md rounded-2xl border bg-white/92 text-slate-900",
              "border-white/50 shadow-2xl backdrop-blur-xl",
              "p-6",
              "transition-transform duration-200 will-change-transform",
              "[transform:perspective(1200px)_rotateX(calc((0.5-var(--py))*4deg))_rotateY(calc((var(--px)-0.5)*6deg))]",
              cardClassName
            )}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </div>

      {/* 关键帧 & Ripple 样式 */}
      <style jsx global>{`
        @keyframes bg-pan {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(20px, -30px) scale(1.08);
          }
          66% {
            transform: translate(-25px, 25px) scale(0.95);
          }
        }
        /* 外环：描边扩散 */
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0.6);
            opacity: 0.45;
          }
          70% {
            opacity: 0.15;
          }
          100% {
            transform: translate(-50%, -50%) scale(12);
            opacity: 0;
          }
        }
        /* 内环：柔光填充 */
        @keyframes ripple2 {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0.35;
          }
          100% {
            transform: translate(-50%, -50%) scale(6);
            opacity: 0;
          }
        }
        .login-ring,
        .login-ring-2 {
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 9999px;
          pointer-events: none;
          will-change: transform, opacity;
          filter: drop-shadow(0 2px 6px rgba(59, 130, 246, 0.25));
        }
        .login-ring {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255, 255, 255, 0.85);
          box-shadow: 0 0 30px rgba(14, 165, 233, 0.25),
            inset 0 0 12px rgba(255, 255, 255, 0.2);
          animation: ripple 900ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
        .login-ring-2 {
          width: 10px;
          height: 10px;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.35),
            rgba(255, 255, 255, 0)
          );
          animation: ripple2 1000ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
}
