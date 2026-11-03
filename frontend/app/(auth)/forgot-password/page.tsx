import type { Metadata } from "next";

import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password | ই-বই",
  description: "Reset your ebooi account password.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <ForgotPasswordForm />
    </main>
  );
}
