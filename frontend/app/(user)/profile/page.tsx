"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut, Loader2 } from "lucide-react";

import { useProfile } from "@/features/profile/hooks/profile.hooks";
import { useLogout } from "@/features/auth/hooks/auth.hooks";
import { clearAccessToken } from "@/services/api/token";

import ProfileCard from "@/features/profile/components/profile-card";
import ProfileForm from "@/features/profile/components/profile-form";
import ChangePasswordForm from "@/features/profile/components/change-password-form";
import ProfileSkeleton from "@/features/profile/components/profile-skeleton";

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useProfile();
  const { mutate: logout, isPending: loggingOut } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        clearAccessToken();
        queryClient.setQueryData(["profile"], {
          user: null,
        });

        toast.success("Logged out successfully");

        router.replace("/login");
      },

      onError: (error) => {
        toast.error(error.response?.data?.message ?? "Logout failed");
      },
    });
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !data?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F7F9FA]">
        <div
          className="
            flex flex-col items-center gap-2
            rounded-3xl border border-[#E1E5E8]
            bg-white px-8 py-10 text-center
            shadow-[0_10px_30px_rgba(10,14,42,0.06)]
          "
        >
          <span
            className="
              rounded-full bg-[#E6F7F6]
              px-3 py-1 text-xs font-bold
              text-[#0A0E2A]
            "
          >
            404
          </span>

          <p className="mt-2 text-lg font-bold text-[#0A0E2A]">
            Profile not found
          </p>

          <p className="text-sm text-[#6B7280]">
            We couldn&apos;t load your profile information.
          </p>
        </div>
      </div>
    );
  }

  const user = data.user;

  const avatarUrl = user.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${process.env.NEXT_PUBLIC_API_URL?.replace(
          "/api/v1",
          "",
        )}/uploads/avatars/${user.avatar}`
    : "";

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <div className="container mx-auto px-5 py-6 sm:px-10 lg:px-[60px]">
        <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:gap-8">
          {/* Left Side */}
          <div className="space-y-6">
            <ProfileCard
              name={user.name}
              email={user.email}
              avatarUrl={avatarUrl}
              role={user.role}
              booksOwned={user.booksOwned ?? 0}
              ordersCount={user.ordersCount ?? 0}
              memberSince={
                user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : undefined
              }
            />

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="
                flex w-full max-w-md items-center justify-center gap-2
                rounded-3xl border border-red-200 bg-white px-5 py-3.5
                text-sm font-bold text-red-600
                shadow-[0_10px_30px_rgba(10,14,42,0.06)]
                transition-all duration-200
                hover:-translate-y-0.5 hover:bg-red-50
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {loggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Logout
            </button>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            <ProfileForm
              key={user._id}
              defaultValues={{
                name: user.name,
                email: user.email,
                phone: user.phone ?? "",
                bio: user.bio ?? "",
              }}
            />

            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
