"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

import type { NewUserValues } from "@/features/admin/types/admin.types";

const initialValues: NewUserValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "user",
};

interface AddUserDialogProps {
  onCreate?: (values: NewUserValues) => Promise<void> | void;
}

export default function AddUserDialog({
  onCreate,
}: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] =
    useState<NewUserValues>(initialValues);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const update = <K extends keyof NewUserValues>(
    key: K,
    value: NewUserValues[K]
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setError(null);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError(null);

    if (!values.name.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!values.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!values.password.trim()) {
      setError("Password is required.");
      return;
    }

    setLoading(true);

    try {
      await onCreate?.(values);

      resetForm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);

        if (!next) {
          resetForm();
        }
      }}
    >
      <Button
        onClick={() => setOpen(true)}
        className="
          group relative overflow-hidden rounded-full border-0
          bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97]
          font-semibold text-white
          shadow-[0_4px_12px_rgba(45,189,182,0.35)]
          transition-transform duration-150
          hover:-translate-y-0.5
          hover:shadow-[0_8px_18px_rgba(45,189,182,0.4)]
        "
      >
        <span className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-[120%]" />

        <span className="relative flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </span>
      </Button>

      <DialogContent className="rounded-3xl border-[#E1E5E8] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0A0E2A]">
            Add New User
          </DialogTitle>

          <DialogDescription className="text-sm text-[#6B7280]">
            Create a new user or admin account.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="mt-2 space-y-4"
        >
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="text-xs font-semibold"
            >
              Full Name
            </Label>

            <Input
              id="name"
              value={values.name}
              onChange={(e) =>
                update("name", e.target.value)
              }
              placeholder="John Doe"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-semibold"
            >
              Email
            </Label>

            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(e) =>
                update("email", e.target.value)
              }
              placeholder="john@example.com"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="phone"
                className="text-xs font-semibold"
              >
                Phone
                <span className="ml-1 font-normal text-gray-400">
                  (optional)
                </span>
              </Label>

              <Input
                id="phone"
                value={values.phone}
                onChange={(e) =>
                  update("phone", e.target.value)
                }
                placeholder="+8801XXXXXXXXX"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Role
              </Label>

              <Select
                value={values.role}
                onValueChange={(value) =>
                  update(
                    "role",
                    value as "user" | "admin"
                  )
                }
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="user">
                    User
                  </SelectItem>

                  <SelectItem value="admin">
                    Admin
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
  <Label
    htmlFor="password"
    className="text-xs font-semibold text-[#0A0E2A]"
  >
    Temporary Password
  </Label>

  <div className="relative">
    <Input
      id="password"
      type={showPassword ? "text" : "password"}
      value={values.password}
      onChange={(e) => update("password", e.target.value)}
      placeholder="Set an initial password"
      className="h-11 rounded-xl border-[#E1E5E8] pr-11 focus-visible:border-[#2DBDB6] focus-visible:ring-4 focus-visible:ring-[#2DBDB6]/15"
    />

    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-[#2DBDB6]"
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5" />
      ) : (
        <Eye className="h-5 w-5" />
      )}
    </button>
  </div>

  <p className="text-[11px] text-[#9AA3AF]">
    The user can change this password after their first login.
  </p>
</div>

          {error && (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="
                rounded-full
                bg-gradient-to-br
                from-[#2DBDB6]
                to-[#1f9d97]
                text-white
              "
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}