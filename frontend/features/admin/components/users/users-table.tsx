"use client";

import { Pencil, Trash2 } from "lucide-react";

import DeleteUserDialog from "./delete-user-dialog";
import ViewUserDialog from "./view-user-dialog";
import Pagination from "./pagination";
import { AdminUser } from "../../types/admin.types";
import Image from "next/image";
import EditUserDialog, { EditAdminUserValues } from "./edit-user-dialog";

interface UsersTableProps {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  onUpdate?: (id: string, values: EditAdminUserValues) => Promise<void>;

  updateLoading?: boolean;

  onDelete?: (user: AdminUser) => Promise<void> | void;
}

export default function UsersTable({
  users,
  total,
  page,
  totalPages,
  onPageChange,
  onUpdate,
  updateLoading = false,
  onDelete,
}: UsersTableProps) {
  const imageBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "");
  const avatarSrc = (user: AdminUser) =>
    user.avatar
      ? user.avatar.startsWith("http")
        ? user.avatar
        : `${imageBaseUrl}/uploads/avatars/${user.avatar}`
      : "/avatar-placeholder.png";

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-ink">
          Showing{" "}
          <span className="font-semibold text-ink">{users.length}</span>{" "}
          of <span className="font-semibold text-ink">{total}</span> users
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left">
          <thead>
            <tr className="border-b border-line text-xs font-semibold text-subtle">
              <th className="pb-2 pr-4 font-semibold">User</th>
              <th className="pb-2 pr-4 font-semibold">Role</th>
              <th className="pb-2 pr-4 font-semibold">Status</th>
              <th className="pb-2 pr-4 font-semibold">Orders</th>
              <th className="pb-2 pr-4 font-semibold">Joined</th>
              <th className="pb-2 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const initials = user.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <tr
                  key={user._id}
                  className="border-b border-soft text-sm transition-colors last:border-0 hover:bg-canvas"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy text-xs font-bold text-white">
                        {user.avatar ? (
                          <Image
                            src={avatarSrc(user)}
                            alt={user.name}
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-ink">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${
                        user.role === "admin"
                          ? "bg-navy text-white"
                          : "bg-brand-soft text-ink"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3 pr-4">
                    <span
                      className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${
                        user.status === "active"
                          ? "bg-success-soft text-success-ink"
                          : "bg-danger-soft text-danger-ink"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          user.status === "active"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>

                  <td className="py-3 pr-4 font-semibold text-ink">
                    {user.ordersCount ?? 0}
                  </td>

                  <td className="py-3 pr-4 text-xs text-subtle">
                    {user.joinedAt}
                  </td>

                  <td className="py-3">
                    <div className="flex items-center justify-end gap-1">
                      <ViewUserDialog user={user} />

                      <EditUserDialog
                        user={user}
                        loading={updateLoading}
                        onUpdate={onUpdate}
                      />

                      <DeleteUserDialog user={user} onConfirm={onDelete} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-5">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
