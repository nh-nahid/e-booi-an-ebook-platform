"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, Mail, MailCheck } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useForgotPassword } from "@/features/auth/hooks/auth.hooks";
import {
  forgotPasswordSchema,
  type ForgotPasswordPayload,
} from "@/features/auth/schemas/auth.schema";

import AuthCard from "./auth-card";

export default function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const form = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { mutate: sendLink, isPending } = useForgotPassword();

  const onSubmit = (values: ForgotPasswordPayload) => {
    sendLink(values, {
      onSuccess: () => setSentTo(values.email),
      onError: (error) => {
        toast.error(
          error.response?.data?.message ??
            "Could not send the reset link. Please try again.",
        );
      },
    });
  };

  if (sentTo) {
    return (
      <AuthCard title="Check your email">
        <div className="space-y-5 pb-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
            <MailCheck className="h-7 w-7" />
          </div>

          <p className="text-sm leading-6 text-muted-ink">
            If an account exists for{" "}
            <span className="font-semibold text-ink">{sentTo}</span>, we
            have sent a link to reset your password. The link is valid for{" "}
            <strong>15 minutes</strong>.
          </p>

          <p className="text-xs text-muted-ink">
            Can&apos;t see it? Check your spam or promotions folder.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-full"
              onClick={() => setSentTo(null)}
            >
              Use a different email
            </Button>

            <Link
              href="/login"
              className={cn(
                buttonVariants(),
                "h-11 flex-1 rounded-full bg-brand font-semibold text-white hover:bg-brand-strong",
              )}
            >
              Back to login
            </Link>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot password?"
      subtitle="Enter your account email and we'll send you a link to reset your password."
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: focused ? "#2DBDB6" : "#9AA3AF" }}
            />

            <Input
              type="email"
              placeholder="Email"
              autoComplete="email"
              {...form.register("email")}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="h-11 rounded-xl pl-9"
              style={{
                borderColor: focused ? "#2DBDB6" : "#E1E5E8",
                boxShadow: focused ? "0 0 0 4px rgba(45,189,182,0.15)" : "none",
              }}
            />
          </div>

          {form.formState.errors.email && (
            <p className="mt-1 text-xs text-danger-ink">
              {form.formState.errors.email.message}
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
              Sending...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Send reset link
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>

        <Link
          href="/login"
          className="flex items-center justify-center gap-1.5 pb-2 text-sm font-medium text-brand hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </form>
    </AuthCard>
  );
}
