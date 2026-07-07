import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginForm from "@/features/auth/components/login-form";

export default async function LoginPage() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken");

  if (refreshToken) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <LoginForm />
    </main>
  );
}