"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { AdminUser } from "../../types/admin.types";

export interface EditAdminUserValues {
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
}

interface EditUserDialogProps {
  user: AdminUser;
  loading?: boolean;
  onUpdate?: (id: string, values: EditAdminUserValues) => Promise<void>;
}

const getInitialValues = (user: AdminUser): EditAdminUserValues => ({
  name: user.name,
  email: user.email,
  phone: user.phone ?? "",
  role: user.role,
});

export default function EditUserDialog({
  user,
  loading = false,
  onUpdate,
}: EditUserDialogProps) {
  const [open, setOpen] = useState(false);

  const [values, setValues] = useState<EditAdminUserValues>(() =>
    getInitialValues(user),
  );

  const [error, setError] = useState("");

  const update = <K extends keyof EditAdminUserValues>(
    key: K,
    value: EditAdminUserValues[K],
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setValues(getInitialValues(user));
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!values.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!values.email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      await onUpdate?.(user._id, values);
      setOpen(false);
    } catch {
      // toast handled by parent
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] transition hover:bg-[#E6F7F6] hover:text-[#2DBDB6]"
      >
        <Pencil className="h-4 w-4" />
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="rounded-3xl border-[#E1E5E8] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0A0E2A]">
              Edit User
            </DialogTitle>

            <DialogDescription>Update user information.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Name</Label>

              <Input
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Email</Label>

              <Input
                type="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Phone</Label>

              <Input
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Role</Label>

              <Select
                value={values.role}
                onValueChange={(value) =>
                  update("role", value as "user" | "admin")
                }
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="user">User</SelectItem>

                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="bg-[#2DBDB6] hover:bg-[#26a59e]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
