"use client";

import { useState } from "react";

import { useUsers } from "@/features/admin/hooks/admin.hooks";
import { useDebounce } from "@/hooks/use-debounce";

import UsersLoading from "./loading";
import AddUserDialog from "@/features/admin/components/users/add-user-dialog";
import UsersFilter from "@/features/admin/components/users/users-filter";
import UsersTable from "@/features/admin/components/users/users-table";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError, refetch } = useUsers({
    page,
    search: debouncedSearch,
    role,
    status,
  });

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
            // TODO: call your create-user mutation, then refetch
            await refetch();
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

      {/* Table */}
      <UsersTable
        users={formattedUsers}
        total={data.data.length}
        page={1}
        totalPages={1}
        onPageChange={setPage}
        onEdit={(user) => {
          console.log(user);
        }}
        onDelete={async (user) => {
          await refetch();
        }}
      />
    </div>
  );
}
