import type { Metadata } from "next";

import ResetPasswordForm from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password | ই-বই",
  description: "Choose a new password for your ebooi account.",
};

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <ResetPasswordForm token={token} />
    </main>
  );
}
