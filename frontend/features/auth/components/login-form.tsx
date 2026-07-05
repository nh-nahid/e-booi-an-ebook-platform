"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<"email" | "password" | null>(null);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1600);
  };

  return (
    <div
      className="flex min-h-[560px] w-full items-center justify-center p-6"
      style={{ background: "#F7F9FA" }}
    >
      <Card
        className="lf-card w-full max-w-md rounded-3xl border shadow-lg"
        style={{
          borderColor: "#E1E5E8",
          background: "#FFFFFF",
          boxShadow: "0 20px 45px rgba(10,14,42,0.08)",
        }}
      >
        {/* ambient teal/navy blobs */}
        <div
          className="lf-blob"
          style={{ width: 160, height: 160, top: -60, right: -60, background: "#2DBDB6" }}
        />
        <div
          className="lf-blob"
          style={{
            width: 140,
            height: 140,
            bottom: -50,
            left: -50,
            background: "#2DBDB6",
            animationDelay: "1.5s",
          }}
        />

        <CardHeader className="relative pb-2 pt-8">
          <div
            className="mb-4 flex items-center gap-2"
            style={{ animation: "fadeIn 0.6s ease 0.1s both" }}
          >
            <Image src="/logo.jpeg" height={32} width={32} alt="logo" />
           
            <span className="text-lg font-extrabold" style={{ color: "#0A0E2A" }}>
              eBook
            </span>
          </div>

          <CardTitle
            className="text-2xl font-bold"
            style={{ color: "#0A0E2A", animation: "riseIn 0.5s ease 0.15s both" }}
          >
            Welcome back
          </CardTitle>
          <p
            className="text-sm"
            style={{ color: "#6B7280", animation: "riseIn 0.5s ease 0.2s both" }}
          >
            Log in to keep reading where you left off.
          </p>
        </CardHeader>

        <CardContent className="relative space-y-4 pb-8 pt-4">
          <div className="lf-field" style={{ animationDelay: "0.25s" }}>
            <div className="relative">
              <Mail
                className="lf-icon absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: focused === "email" ? "#2DBDB6" : "#9AA3AF" }}
              />
              <Input
                type="email"
                placeholder="Email"
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                className="lf-input h-11 rounded-xl pl-9"
                style={{
                  borderColor: focused === "email" ? "#2DBDB6" : "#E1E5E8",
                  boxShadow: focused === "email" ? "0 0 0 4px rgba(45,189,182,0.15)" : "none",
                }}
              />
            </div>
          </div>

          <div className="lf-field" style={{ animationDelay: "0.32s" }}>
            <div className="relative">
              <Lock
                className="lf-icon absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: focused === "password" ? "#2DBDB6" : "#9AA3AF" }}
              />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                className="lf-input h-11 rounded-xl pl-9 pr-10"
                style={{
                  borderColor: focused === "password" ? "#2DBDB6" : "#E1E5E8",
                  boxShadow: focused === "password" ? "0 0 0 4px rgba(45,189,182,0.15)" : "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="lf-toggle absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#9AA3AF" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div
            className="flex items-center justify-between text-xs"
            style={{ animation: "riseIn 0.5s ease 0.38s both" }}
          >
            <label className="flex items-center gap-2" style={{ color: "#6B7280" }}>
              <input type="checkbox" className="h-3.5 w-3.5 accent-[#2DBDB6]" />
              Remember me
            </label>
            <a href="#" className="font-semibold" style={{ color: "#2DBDB6" }}>
              Forgot password?
            </a>
          </div>

          <div className="lf-field" style={{ animationDelay: "0.44s" }}>
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="lf-btn h-11 w-full rounded-full border-0 text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #2DBDB6, #1f9d97)",
                boxShadow: "0 4px 12px rgba(45,189,182,0.35)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Login
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>

          <p
            className="pt-1 text-center text-xs"
            style={{ color: "#6B7280", animation: "riseIn 0.5s ease 0.5s both" }}
          >
            New here?{" "}
            <a href="#" className="font-semibold" style={{ color: "#0A0E2A" }}>
              Create an account
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
