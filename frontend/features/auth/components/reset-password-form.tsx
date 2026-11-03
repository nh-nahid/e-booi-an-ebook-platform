"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useResetPassword } from "@/features/auth/hooks/auth.hooks";
import {
  resetPasswordSchema,
  type ResetPasswordPayload,
} from "@/features/auth/schemas/auth.schema";

import AuthCard from "./auth-card";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<"password" | "confirm" | null>(null);
  const [done, setDone] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  const form = useForm<ResetPasswordPayload>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { mutate: resetPassword, isPending } = useResetPassword();

  // After a successful reset, send the user to the login page.
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => router.replace("/login"), 3000);
    return () => clearTimeout(t);
  }, [done, router]);

  const onSubmit = (values: ResetPasswordPayload) => {
    setLinkError(null);

    resetPassword(
      { token, password: values.password },
      {
        onSuccess: () => {
          toast.success("Password reset successfully");
          setDone(true);
        },
        onError: (error) => {
          const message =
            error.response?.data?.message ??
            "Could not reset your password. Please try again.";

          // A 400 means the link is invalid or has expired.
          if (error.response?.status === 400) {
            setLinkError(message);
          } else {
            toast.error(message);
          }
        },
      },
    );
  };

  if (done) {
    return (
      <AuthCard title="Password updated">
        <div className="space-y-5 pb-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <p className="text-sm leading-6 text-muted-ink">
            Your password has been changed. Redirecting you to the login page...
          </p>

          <Link
            href="/login"
            className={cn(
              buttonVariants(),
              "h-11 w-full rounded-full bg-brand font-semibold text-white hover:bg-brand-strong",
            )}
          >
            Go to login
          </Link>
        </div>
      </AuthCard>
    );
  }

  if (linkError) {
    return (
      <AuthCard title="Link expired">
        <div className="space-y-5 pb-2">
          <p className="text-sm leading-6 text-muted-ink">
            {linkError}. Reset links are valid for 15 minutes and can only be
            used with the latest email we sent you.
          </p>

          <Link
            href="/forgot-password"
            className={cn(
              buttonVariants(),
              "h-11 w-full rounded-full bg-brand font-semibold text-white hover:bg-brand-strong",
            )}
          >
            Request a new link
          </Link>
        </div>
      </AuthCard>
    );
  }

  const fieldStyle = (name: "password" | "confirm") => ({
    borderColor: focused === name ? "#2DBDB6" : "#E1E5E8",
    boxShadow: focused === name ? "0 0 0 4px rgba(45,189,182,0.15)" : "none",
  });

  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose a new password for your account (at least 6 characters)."
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: focused === "password" ? "#2DBDB6" : "#9AA3AF" }}
            />

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              autoComplete="new-password"
              {...form.register("password")}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              className="h-11 rounded-xl pl-9 pr-10"
              style={fieldStyle("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-ink hover:text-body"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {form.formState.errors.password && (
            <p className="mt-1 text-xs text-danger-ink">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: focused === "confirm" ? "#2DBDB6" : "#9AA3AF" }}
            />

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              autoComplete="new-password"
              {...form.register("confirmPassword")}
              onFocus={() => setFocused("confirm")}
              onBlur={() => setFocused(null)}
              className="h-11 rounded-xl pl-9"
              style={fieldStyle("confirm")}
            />
          </div>

          {form.formState.errors.confirmPassword && (
            <p className="mt-1 text-xs text-danger-ink">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="h-11 w-full cursor-pointer rounded-full bg-brand font-semibold text-white transition-all hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Reset password
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>
    </AuthCard>
  );
}
