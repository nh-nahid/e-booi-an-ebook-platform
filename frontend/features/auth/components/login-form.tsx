"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useLogin } from "@/features/auth/hooks/auth.hooks";
import {
  loginSchema,
  type LoginPayload,
} from "@/features/auth/schemas/auth.schema";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function LoginForm() {
  const router = useRouter();
  const { refetch } = useAuth();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<
    "email" | "password" | null
  >(null);

  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useLogin();

  const onSubmit = (values: LoginPayload) => {
    login(values, {
      onSuccess: (data) => {
        toast.success(data.message);

        form.reset();
        queryClient.invalidateQueries({
              queryKey: ["profile"],
            });
        router.push("/");
      },

      onError: (error) => {
        toast.error(
          error.response?.data?.message ??
            "Login failed. Please try again."
        );
      },
    });
  };

  return (
    <div
      className="flex min-h-[560px] w-full items-center justify-center p-6"
      style={{ background: "#F7F9FA" }}
    >
      <Card
        className="relative w-full max-w-md overflow-hidden rounded-3xl border shadow-lg"
        style={{
          borderColor: "#E1E5E8",
          background: "#FFFFFF",
          boxShadow: "0 20px 45px rgba(10,14,42,0.08)",
        }}
      >
        <div
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: 160,
            height: 160,
            top: -60,
            right: -60,
            background: "#2DBDB6",
          }}
        />

        <div
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: 140,
            height: 140,
            bottom: -50,
            left: -50,
            background: "#2DBDB6",
          }}
        />

        <CardHeader className="pb-2 pt-8">
          <div className="mb-4 flex items-center gap-2">
            <Image
              src="/logo.jpeg"
              width={36}
              height={36}
              alt="eBook Logo"
              className="rounded-md"
            />

            <span
              className="text-lg font-bold"
              style={{ color: "#0A0E2A" }}
            >
              eBooi
            </span>
          </div>

          <CardTitle
            className="text-3xl font-bold"
            style={{ color: "#0A0E2A" }}
          >
            Welcome back
          </CardTitle>

          <p className="text-sm text-gray-500">
            Login to continue reading your favorite books.
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* EMAIL */}

            <div>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{
                    color:
                      focused === "email"
                        ? "#2DBDB6"
                        : "#9AA3AF",
                  }}
                />

                <Input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  {...form.register("email")}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className="h-11 rounded-xl pl-9"
                  style={{
                    borderColor:
                      focused === "email"
                        ? "#2DBDB6"
                        : "#E1E5E8",
                    boxShadow:
                      focused === "email"
                        ? "0 0 0 4px rgba(45,189,182,0.15)"
                        : "none",
                  }}
                />
              </div>

              {form.formState.errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}

            <div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{
                    color:
                      focused === "password"
                        ? "#2DBDB6"
                        : "#9AA3AF",
                  }}
                />

                <Input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  autoComplete="current-password"
                  {...form.register("password")}
                  onFocus={() =>
                    setFocused("password")
                  }
                  onBlur={() => setFocused(null)}
                  className="h-11 rounded-xl pl-9 pr-10"
                  style={{
                    borderColor:
                      focused === "password"
                        ? "#2DBDB6"
                        : "#E1E5E8",
                    boxShadow:
                      focused === "password"
                        ? "0 0 0 4px rgba(45,189,182,0.15)"
                        : "none",
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {form.formState.errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

               <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#2DBDB6]"
                />
                Remember me
              </label>

              <Link
                href="/forgot-password"
                className="font-medium text-[#2DBDB6] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-full bg-[#2DBDB6] font-semibold text-white transition-all hover:bg-[#249d97] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Login
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs uppercase tracking-wider text-gray-400">
                  Or
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled
              className="h-11 w-full rounded-full"
            >
              Continue with Google (Coming Soon)
            </Button>

            <p className="pt-2 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#2DBDB6] hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}