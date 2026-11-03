"use client";

import { Check, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "../hooks/profile.hooks";

const inputClass =
  "h-11 rounded-xl border-line pl-10 transition-all duration-200 " +
  "focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/15";

export default function ChangePasswordForm() {
  const { mutateAsync: changePassword, isPending } = useChangePassword();

const [values, setValues] = useState({
  currentPassword: "",
  newPassword: "",
});

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
  });
  const [saved, setSaved] = useState(false);

  const updateValue = (key: keyof typeof values, value: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await changePassword(values);

      setValues({
        currentPassword: "",
        newPassword: "",
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full rounded-3xl border border-line
        bg-surface p-5 sm:p-6
        shadow-[0_10px_30px_rgba(10,14,42,0.06)]
        animate-in fade-in slide-in-from-bottom-2 duration-500
      "
    >
      <div className="mb-5">
        <h3 className="text-lg font-bold text-ink">Change Password</h3>

        <p className="text-sm text-muted-ink">
          Update your account password securely.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="oldPassword"
            className="text-xs font-semibold text-ink"
          >
            Current Password
          </Label>

          <div className="relative">
            <Lock
              className="
                absolute left-3 top-1/2
                h-4 w-4 -translate-y-1/2
                text-subtle
              "
            />

            <Input
              id="oldPassword"
              type={showPassword.currentPassword ? "text" : "password"}
              value={values.currentPassword}
              onChange={(e) => updateValue("currentPassword", e.target.value)}
              placeholder="Current password"
              className={`${inputClass} pr-11`}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  currentPassword: !prev.currentPassword,
                }))
              }
              className="
    absolute right-3 top-1/2
    -translate-y-1/2
    text-subtle
    transition-colors
    hover:text-brand
  "
            >
              {showPassword.currentPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="newPassword"
            className="text-xs font-semibold text-ink"
          >
            New Password
          </Label>

          <div className="relative">
            <Lock
              className="
                absolute left-3 top-1/2
                h-4 w-4 -translate-y-1/2
                text-subtle
              "
            />

            <Input
              id="newPassword"
              type={showPassword.newPassword ? "text" : "password"}
              value={values.newPassword}
              onChange={(e) => updateValue("newPassword", e.target.value)}
              placeholder="New password"
              className={`${inputClass} pr-11`}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  newPassword: !prev.newPassword,
                }))
              }
              className="
    absolute right-3 top-1/2
    -translate-y-1/2
    text-subtle
    transition-colors
    hover:text-brand
  "
            >
              {showPassword.newPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending || !values.currentPassword || !values.newPassword}
        className="
          mt-6 h-11 w-full rounded-full
          bg-gradient-to-br from-brand to-brand-strong
          font-semibold text-white
          shadow-[0_4px_12px_rgba(45,189,182,0.35)]
          transition-transform
          hover:-translate-y-0.5
        "
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : saved ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Updated
          </>
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
}
