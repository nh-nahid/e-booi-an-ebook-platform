"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface NewUserValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "admin";
}

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

export default function AddUserDialog({ onCreate }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<NewUserValues>(initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof NewUserValues>(key: K, value: NewUserValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setValues(initialValues);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!values.name.trim() || !values.email.trim() || !values.password.trim()) {
      setError("Name, email, and password are required.");
      return;
    }

    setLoading(true);
    try {
      // TODO: wire up to your actual create-user mutation
      // await createUser(values);
      await onCreate?.(values);
      setOpen(false);
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="
            group relative overflow-hidden rounded-full border-0 font-semibold text-white
            bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97]
            shadow-[0_4px_12px_rgba(45,189,182,0.35)]
            transition-transform duration-150
            hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(45,189,182,0.4)]
            active:translate-y-0 active:scale-[0.98]
          "
        >
          <span className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-[120%]" />
          <span className="relative flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add New User
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl border-[#E1E5E8] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0A0E2A]">Add New User</DialogTitle>
          <DialogDescription className="text-sm text-[#6B7280]">
            Create a new user or admin account manually.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-[#0A0E2A]">
              Full Name
            </Label>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Full name"
              className="h-11 rounded-xl border-[#E1E5E8] focus-visible:border-[#2DBDB6] focus-visible:ring-4 focus-visible:ring-[#2DBDB6]/15"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-[#0A0E2A]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
              className="h-11 rounded-xl border-[#E1E5E8] focus-visible:border-[#2DBDB6] focus-visible:ring-4 focus-visible:ring-[#2DBDB6]/15"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold text-[#0A0E2A]">
                Phone <span className="font-normal text-[#9AA3AF]">(optional)</span>
              </Label>
              <Input
                id="phone"
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+880 1XX XXX XXXX"
                className="h-11 rounded-xl border-[#E1E5E8] focus-visible:border-[#2DBDB6] focus-visible:ring-4 focus-visible:ring-[#2DBDB6]/15"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#0A0E2A]">Role</Label>
              <Select value={values.role} onValueChange={(v) => update("role", v as NewUserValues["role"])}>
                <SelectTrigger className="h-11 rounded-xl border-[#E1E5E8] focus:ring-4 focus:ring-[#2DBDB6]/15">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-[#0A0E2A]">
              Temporary Password
            </Label>
            <Input
              id="password"
              type="password"
              value={values.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="Set an initial password"
              className="h-11 rounded-xl border-[#E1E5E8] focus-visible:border-[#2DBDB6] focus-visible:ring-4 focus-visible:ring-[#2DBDB6]/15"
            />
            <p className="text-[11px] text-[#9AA3AF]">
              The user can change this after their first login.
            </p>
          </div>

          {error && (
            <p className="rounded-xl bg-[#FDEDEC] px-3 py-2 text-xs font-medium text-red-600">
              {error}
            </p>
          )}

          <DialogFooter className="gap-2 pt-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-full border-[#E1E5E8] font-semibold text-[#0A0E2A] hover:border-[#2DBDB6] hover:text-[#2DBDB6]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="
                group relative min-w-[130px] overflow-hidden rounded-full border-0
                font-semibold text-white bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97]
                shadow-[0_4px_12px_rgba(45,189,182,0.35)]
                transition-transform duration-150
                hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(45,189,182,0.4)]
                active:translate-y-0 active:scale-[0.98]
                disabled:opacity-70
              "
            >
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
