"use client";

import { useAuth } from "@/hooks/use-auth";

import ProfileCard from "@/features/profile/components/profile-card";
import ProfileForm from "@/features/profile/components/profile-form";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F7F9FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#E1E5E8] border-t-[#2DBDB6]" />
          <p className="text-sm font-medium text-[#6B7280]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F7F9FA]">
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-[#E1E5E8] bg-white px-8 py-10 text-center shadow-[0_10px_30px_rgba(10,14,42,0.06)]">
          <span className="rounded-full bg-[#E6F7F6] px-3 py-1 text-xs font-bold text-[#0A0E2A]">
            404
          </span>
          <p className="mt-2 text-lg font-bold text-[#0A0E2A]">User not found</p>
          <p className="text-sm text-[#6B7280]">
            We couldn&apos;t load your account. Try logging in again.
          </p>
        </div>
      </div>
    );
  }

  const avatarUrl = user.avatar
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace(
        "/api/v1",
        ""
      )}/uploads/avatars/${user.avatar}`
    : "";

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <div className="container mx-auto px-4 py-10 lg:px-[60px]">
        <div className="mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-1 duration-500">
          <span className="inline-block rounded-2xl bg-[#E6F7F6] px-4 py-1.5 text-2xl font-bold text-[#0A0E2A]">
            My Profile
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <ProfileCard
            name={user.name}
            email={user.email}
            avatarUrl={avatarUrl}
            role={user.role}
          />

          <ProfileForm
            defaultValues={{
              name: user.name,
              email: user.email,
              phone: "",
              bio: "",
            }}
          />
        </div>
      </div>
    </div>
  );
}
