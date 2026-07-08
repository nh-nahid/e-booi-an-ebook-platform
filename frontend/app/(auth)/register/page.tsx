import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import RegisterForm from "../../../features/auth/components/register-form";

export default async function RegisterPage() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken");

  if (refreshToken) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F9FA] px-4 py-10">
      <RegisterForm />
    </div>
  );
}