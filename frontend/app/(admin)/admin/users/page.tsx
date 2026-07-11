"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import {
  useAdminUsers,
  useCreateAdminUser,
  useDeleteAdminUser,
  useUpdateAdminUser,
} from "@/features/admin/hooks/admin.hooks";
import { useDebounce } from "@/hooks/use-debounce";

import UsersLoading from "./loading";
import AddUserDialog from "@/features/admin/components/users/add-user-dialog";
import UsersFilter from "@/features/admin/components/users/users-filter";
import UsersTable from "@/features/admin/components/users/users-table";
import { AdminUser } from "@/features/admin/types/admin.types";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError } = useAdminUsers({
    page,
    search: debouncedSearch,
    role,
    status,
  });

  const createUserMutation = useCreateAdminUser();
  const deleteUserMutation = useDeleteAdminUser();
  const updateUserMutation = useUpdateAdminUser();

  const handleDelete = async (user: AdminUser) => {
  try {
    await deleteUserMutation.mutateAsync(user._id);

    toast.success("User deleted successfully");
  } catch (error) {
    const axiosError = error as AxiosError<{
      message: string;
    }>;

    toast.error(
      axiosError.response?.data?.message ??
        "Failed to delete user"
    );

    throw error;
  }
};

  if (isLoading) {
    return <UsersLoading />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-lg font-semibold text-red-600">
          Failed to load users
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  const formattedUsers = data.data.map((user) => ({
    ...user,
    status: "active" as const,
    ordersCount: 0,
    booksOwned: 0,
    joinedAt: new Date(user.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0A0E2A]">
            Users Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all registered users and admins in your bookstore.
          </p>
        </div>

        <AddUserDialog
          onCreate={async (values) => {
            try {
              await createUserMutation.mutateAsync(values);

              toast.success("User created successfully");
            } catch (error: unknown) {
              const axiosError = error as AxiosError<{
                message: string;
              }>;

              toast.error(
                axiosError.response?.data?.message ?? "Failed to create user",
              );

              throw error;
            }
          }}
        />
      </div>

      {/* Filters */}
      <UsersFilter
        search={search}
        role={role}
        status={status}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onRoleChange={(value) => {
          setRole(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
      />

      {/* Users Table */}
      <UsersTable
        users={formattedUsers}
        total={formattedUsers.length}
        page={page}
        totalPages={1}
        onPageChange={setPage}
        updateLoading={updateUserMutation.isPending}
        onUpdate={async (id, values) => {
          const formData = new FormData();

          formData.append("name", values.name);
          formData.append("email", values.email);
          formData.append("phone", values.phone);
          formData.append("role", values.role);

          await updateUserMutation.mutateAsync({
            id,
            formData,
          });

          toast.success("User updated successfully");
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
