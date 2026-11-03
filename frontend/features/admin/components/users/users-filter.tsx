"use client";

import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UsersFilterProps {
  search: string;
  role: string;
  status: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function UsersFilter({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
}: UsersFilterProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />

        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="
            h-10 w-full rounded-full border border-line bg-canvas
            pl-10 pr-4 text-sm text-ink outline-none
            transition-all duration-200
            placeholder:text-subtle
            focus:border-brand
            focus:bg-surface
            focus:shadow-[0_0_0_4px_rgba(45,189,182,0.15)]
          "
        />
      </div>

      <div className="flex gap-3">
        <Select
          value={role}
          onValueChange={(value) => {
            if (value) {
              onRoleChange(value);
            }
          }}
        >
          <SelectTrigger className="h-10 w-full rounded-full border-line text-sm sm:w-[150px]">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={(value) => {
            if (value) {
              onStatusChange(value);
            }
          }}
        >
          <SelectTrigger className="h-10 w-full rounded-full border-line text-sm sm:w-[150px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}