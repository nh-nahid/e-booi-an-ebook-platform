"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useRegister } from "@/features/auth/hooks/auth.hooks";

import type { ApiError } from "@/features/auth/types/api-error";

type Role = "user" | "admin";

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminCode: string;
  role: Role;
}

const initialValues: RegisterValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  adminCode: "",
  role: "user",
};

export default function RegisterForm() {
  const [values, setValues] = useState<RegisterValues>(initialValues);
  const [focused, setFocused] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isAdmin = values.role === "admin";
  const { mutate: register, isPending } = useRegister();

  const update = <K extends keyof RegisterValues>(
    key: K,
    value: RegisterValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleRoleChange = (role: Role) => {
    update("role", role);
    setError(null);
  };

  const iconColor = (key: string) => (focused === key ? "#2DBDB6" : "#9AA3AF");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (isAdmin && !values.adminCode.trim()) {
      setError("Admin access code is required.");
      return;
    }

    register(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: values.role,
        adminCode: isAdmin ? values.adminCode : undefined,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);

          setValues(initialValues);

          router.push("/login");
        },

        onError: (error: ApiError) => {
          setError(error.response?.data?.message ?? "Registration failed");
        },
      },
    );
  };

  const fieldClass =
    "h-11 w-full rounded-xl border pl-10 pr-3 text-sm text-[#0A0E2A] outline-none " +
    "transition-all duration-200 placeholder:text-[#9AA3AF]";

  return (
    <div
      className="
        relative w-full max-w-md overflow-hidden rounded-3xl border border-[#E1E5E8]
        bg-white p-7 shadow-[0_20px_45px_rgba(10,14,42,0.08)]
        animate-in fade-in slide-in-from-bottom-2 duration-500
      "
    >
      {/* ambient blobs */}
      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-[#2DBDB6] opacity-[0.14] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-[#0A0E2A] opacity-[0.08] blur-3xl" />

      <div className="relative">
        {/* logo */}
        <div className="mb-5 flex items-center gap-2">
          <Image
            src="/logo.jpeg"
            alt="eBooi Logo"
            width={32}
            height={32}
          />

          <span className="text-lg font-extrabold text-[#0A0E2A]">
            eBoo<span className="text-[#2DBDB6]">i</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold text-[#0A0E2A]">Create an account</h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Join eBooi and start building your library.
        </p>

        {/* role toggle */}
        <div className="mt-5 grid grid-cols-2 gap-1 rounded-full border border-[#E1E5E8] bg-[#F7F9FA] p-1">
          <button
            type="button"
            onClick={() => handleRoleChange("user")}
            className={`
              flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold
              transition-all duration-200
              ${
                values.role === "user"
                  ? "bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97] text-white shadow-[0_4px_12px_rgba(45,189,182,0.35)]"
                  : "text-[#6B7280] hover:text-[#0A0E2A]"
              }
            `}
          >
            <User className="h-3.5 w-3.5" />
            As User
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("admin")}
            className={`
              flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold
              transition-all duration-200
              ${
                isAdmin
                  ? "bg-gradient-to-br from-[#0A0E2A] to-[#1a2050] text-white shadow-[0_4px_12px_rgba(10,14,42,0.35)]"
                  : "text-[#6B7280] hover:text-[#0A0E2A]"
              }
            `}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            As Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0A0E2A]">
              Full Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                style={{ color: iconColor("name") }}
              />
              <input
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                placeholder="Your full name"
                className={fieldClass}
                style={{
                  borderColor: focused === "name" ? "#2DBDB6" : "#E1E5E8",
                  boxShadow:
                    focused === "name"
                      ? "0 0 0 4px rgba(45,189,182,0.15)"
                      : "none",
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0A0E2A]">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                style={{ color: iconColor("email") }}
              />
              <input
                type="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="you@example.com"
                className={fieldClass}
                style={{
                  borderColor: focused === "email" ? "#2DBDB6" : "#E1E5E8",
                  boxShadow:
                    focused === "email"
                      ? "0 0 0 4px rgba(45,189,182,0.15)"
                      : "none",
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0A0E2A]">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                style={{ color: iconColor("password") }}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={(e) => update("password", e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                placeholder="Create a password"
                className={`${fieldClass} pr-10`}
                style={{
                  borderColor: focused === "password" ? "#2DBDB6" : "#E1E5E8",
                  boxShadow:
                    focused === "password"
                      ? "0 0 0 4px rgba(45,189,182,0.15)"
                      : "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA3AF] transition-transform hover:scale-110"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0A0E2A]">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                style={{ color: iconColor("confirm") }}
              />
              <input
                type={showConfirm ? "text" : "password"}
                value={values.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                onFocus={() => setFocused("confirm")}
                onBlur={() => setFocused(null)}
                placeholder="Re-enter your password"
                className={`${fieldClass} pr-10`}
                style={{
                  borderColor: focused === "confirm" ? "#2DBDB6" : "#E1E5E8",
                  boxShadow:
                    focused === "confirm"
                      ? "0 0 0 4px rgba(45,189,182,0.15)"
                      : "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA3AF] transition-transform hover:scale-110"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* admin-only field */}
          <div
            className={`
              grid overflow-hidden transition-all duration-300 ease-out
              ${isAdmin ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
            `}
          >
            <div className="min-h-0 space-y-1.5">
              <label className="text-xs font-semibold text-[#0A0E2A]">
                Admin Access Code
              </label>
              <div className="relative">
                <KeyRound
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                  style={{ color: iconColor("adminCode") }}
                />
                <input
                  value={values.adminCode}
                  onChange={(e) => update("adminCode", e.target.value)}
                  onFocus={() => setFocused("adminCode")}
                  onBlur={() => setFocused(null)}
                  placeholder="Enter admin invite code"
                  className={fieldClass}
                  style={{
                    borderColor:
                      focused === "adminCode" ? "#2DBDB6" : "#E1E5E8",
                    boxShadow:
                      focused === "adminCode"
                        ? "0 0 0 4px rgba(45,189,182,0.15)"
                        : "none",
                  }}
                />
              </div>
              <p className="text-[11px] text-[#9AA3AF]">
                Ask your workspace owner for an admin invite code.
              </p>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-[#FDEDEC] px-3 py-2 text-xs font-medium text-red-600 animate-in fade-in duration-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className={`
              group relative h-11 w-full overflow-hidden rounded-full border-0
              font-semibold text-white transition-transform duration-150
              hover:-translate-y-0.5 cursor-pointer active:translate-y-0 active:scale-[0.98]
              disabled:opacity-70
              ${
                isAdmin
                  ? "bg-gradient-to-br from-[#0A0E2A] to-[#1a2050] shadow-[0_4px_12px_rgba(10,14,42,0.35)] hover:shadow-[0_8px_18px_rgba(10,14,42,0.4)]"
                  : "bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97] shadow-[0_4px_12px_rgba(45,189,182,0.35)] hover:shadow-[0_8px_18px_rgba(45,189,182,0.4)]"
              }
            `}
          >
            <span className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-[120%]" />
            <span className="relative flex items-center justify-center gap-2 text-sm">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Register as {isAdmin ? "Admin" : "User"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </span>
          </button>

          <p className="pt-1 text-center text-xs text-[#6B7280]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#0A0E2A] hover:text-[#2DBDB6]"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
