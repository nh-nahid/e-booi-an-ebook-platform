"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { UserDetails } from "./view-user-dialog";

interface DeleteUserDialogProps {
  user: UserDetails;
  onConfirm?: (user: UserDetails) => Promise<void> | void;
}

export default function DeleteUserDialog({ user, onConfirm }: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // TODO: wire up to your actual delete-user mutation
      // await deleteUser(user.id);
      await onConfirm?.(user);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="
          flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280]
          transition-all duration-200 hover:bg-red-50 hover:text-red-600
        "
        aria-label="Delete user"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <DialogContent className="rounded-3xl border-[#E1E5E8] sm:max-w-sm">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-lg font-bold text-[#0A0E2A]">
            Delete this user?
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-[#6B7280]">
            You're about to remove <span className="font-semibold text-[#0A0E2A]">{user.name}</span>{" "}
            ({user.email}). This action can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2 flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="w-full rounded-full border-0 bg-red-600 font-semibold text-white hover:bg-red-700"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </span>
            ) : (
              "Yes, delete user"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full rounded-full border-[#E1E5E8] font-semibold text-[#0A0E2A]"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
