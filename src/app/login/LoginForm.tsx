"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { login } from "@/services/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Loader2, User, Lock } from "lucide-react";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
    mode: "onSubmit",
  });
  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: FormValues) => {
    try {
      const user = await login(values);
      localStorage.setItem("token", user.token);
      localStorage.setItem("loginUser", JSON.stringify(user));
      toast.success("login successful!");
      router.push("/index");
    } catch (e: any) {
      toast.error(e?.message ?? "login failed");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
        {/* 用户名 */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-600">Username</FormLabel>

              {/* 渐变高亮边框容器 */}
              <div
                className="group relative rounded-xl p-[1px]
                              bg-gradient-to-r from-sky-500/25 via-fuchsia-500/25 to-violet-500/25
                              transition-colors focus-within:from-sky-400/60 focus-within:via-fuchsia-400/60 focus-within:to-violet-400/60"
              >
                <FormControl>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      {...field}
                      autoComplete="username"
                      placeholder="e.g. zhangwuji"
                      disabled={loading}
                      className="pl-9 rounded-[11px] border-none bg-white/80 backdrop-blur
                                 shadow-sm placeholder:text-slate-400
                                 focus-visible:ring-2 focus-visible:ring-sky-500"
                    />
                  </div>
                </FormControl>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* 密码 */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-600">Password</FormLabel>

              <div
                className="group relative rounded-xl p-[1px]
                              bg-gradient-to-r from-sky-500/25 via-fuchsia-500/25 to-violet-500/25
                              transition-colors focus-within:from-sky-400/60 focus-within:via-fuchsia-400/60 focus-within:to-violet-400/60"
              >
                <FormControl>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      {...field}
                      type={showPwd ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      disabled={loading}
                      className="pl-9 pr-10 rounded-[11px] border-none bg-white/80 backdrop-blur
                                 shadow-sm placeholder:text-slate-400
                                 focus-visible:ring-2 focus-visible:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute inset-y-0 right-2 my-auto grid place-items-center rounded px-2
                                 text-slate-500 hover:text-slate-800"
                      aria-label={showPwd ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showPwd ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* 登录按钮：渐变 + 光晕 */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-xl text-white
                     bg-gradient-to-r from-sky-500 to-indigo-600
                     hover:from-sky-400 hover:to-indigo-500
                     shadow-lg shadow-indigo-500/30"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Login"
          )}
        </Button>

        {/* 底部辅助文案（可选） */}
        <p className="text-center text-xs text-slate-500">
          By continuing you agree to the CleverPath terms & privacy policy.
        </p>
      </form>
    </Form>
  );
}
