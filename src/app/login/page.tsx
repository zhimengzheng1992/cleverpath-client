import LoginBackground from "@/components/layout/LoginBackground";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <LoginBackground>
      <h1 className="relative group text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-8">
        {/* 动态渐变文字 + 轻描边 + 光晕 */}
        <span
          className="
      bg-gradient-to-r from-sky-400 via-fuchsia-400 to-indigo-400
      bg-clip-text text-transparent
      drop-shadow-[0_4px_20px_rgba(99,102,241,.30)]
      bg-[length:200%_200%] animate-[bg-pan_8s_ease-in-out_infinite]
    "
          style={{ WebkitTextStroke: "0.5px rgba(255,255,255,0.15)" }}
        >
          CleverPath – Intelligent Learning Assistant
        </span>

        {/* 悬停时的流光扫过 */}
        <span
          aria-hidden
          className="
      pointer-events-none absolute inset-0 rounded
      [mask-image:linear-gradient(110deg,transparent,rgba(255,255,255,.9),transparent)]
      [mask-size:200%_100%] [mask-position:-100%_0%]
      group-hover:[mask-position:200%_0%]
      transition-[mask-position] duration-1000 ease-out
    "
        />

        {/* 发光下划线（模糊层 + 实线层） */}
        <span
          aria-hidden
          className="absolute -bottom-2 left-0 h-[3px] w-full
               bg-gradient-to-r from-sky-400 via-fuchsia-400 to-indigo-400
               blur-[1.2px] opacity-80"
        />
        <span
          aria-hidden
          className="absolute -bottom-2 left-0 h-[2px] w-full
               bg-gradient-to-r from-sky-500 via-fuchsia-500 to-indigo-500"
        />
      </h1>

      <LoginForm />
    </LoginBackground>
  );
}
