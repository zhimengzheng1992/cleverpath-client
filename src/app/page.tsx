import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/login"); // 在渲染时直接重定向
}
