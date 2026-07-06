"use client";

import { useState } from "react";
import { User, Mail, Phone, FileText, Loader2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileFormValues {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
}

interface ProfileFormProps {
  defaultValues?: ProfileFormValues;
  onSubmit?: (values: ProfileFormValues) => Promise<void> | void;
}

const fieldBase =
  "h-11 rounded-xl border-[#E1E5E8] pl-10 transition-all duration-200 " +
  "focus-visible:border-[#2DBDB6] focus-visible:ring-4 focus-visible:ring-[#2DBDB6]/15";

export default function ProfileForm({
  defaultValues = { name: "", email: "", phone: "", bio: "" },
  onSubmit,
}: ProfileFormProps) {
  const [values, setValues] = useState<ProfileFormValues>(defaultValues);
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (key: keyof ProfileFormValues, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      await onSubmit?.(values);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } finally {
      setLoading(false);
    }
  };

  const iconColor = (key: string) => (focused === key ? "#2DBDB6" : "#9AA3AF");

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-md space-y-5 rounded-3xl border border-[#E1E5E8]
        bg-white p-6 shadow-[0_10px_30px_rgba(10,14,42,0.06)]
        animate-in fade-in slide-in-from-bottom-2 duration-500
      "
    >
      <div>
        <h3 className="text-lg font-bold text-[#0A0E2A]">Edit Profile</h3>
        <p className="text-sm text-[#6B7280]">Update your personal information.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-xs font-semibold text-[#0A0E2A]">
          Full Name
        </Label>
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
            style={{ color: iconColor("name") }}
          />
          <Input
            id="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused(null)}
            placeholder="Your full name"
            className={fieldBase}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-semibold text-[#0A0E2A]">
          Email
        </Label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
            style={{ color: iconColor("email") }}
          />
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            placeholder="you@example.com"
            className={fieldBase}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-xs font-semibold text-[#0A0E2A]">
          Phone <span className="font-normal text-[#9AA3AF]">(optional)</span>
        </Label>
        <div className="relative">
          <Phone
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
            style={{ color: iconColor("phone") }}
          />
          <Input
            id="phone"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            onFocus={() => setFocused("phone")}
            onBlur={() => setFocused(null)}
            placeholder="+880 1XX XXX XXXX"
            className={fieldBase}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio" className="text-xs font-semibold text-[#0A0E2A]">
          Bio <span className="font-normal text-[#9AA3AF]">(optional)</span>
        </Label>
        <div className="relative">
          <FileText
            className="absolute left-3 top-3 h-4 w-4 transition-colors"
            style={{ color: iconColor("bio") }}
          />
          <Textarea
            id="bio"
            value={values.bio}
            onChange={(e) => update("bio", e.target.value)}
            onFocus={() => setFocused("bio")}
            onBlur={() => setFocused(null)}
            placeholder="Tell us a little about yourself..."
            rows={3}
            className="
              resize-none rounded-xl border-[#E1E5E8] pl-10 pt-2.5
              transition-all duration-200
              focus-visible:border-[#2DBDB6] focus-visible:ring-4 focus-visible:ring-[#2DBDB6]/15
            "
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="
          group relative h-11 w-full overflow-hidden rounded-full border-0
          bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97] font-semibold text-white
          shadow-[0_4px_12px_rgba(45,189,182,0.35)]
          transition-transform duration-150
          hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(45,189,182,0.4)]
          active:translate-y-0 active:scale-[0.98]
        "
      >
        <span className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-[120%]" />
        <span className="relative flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved
            </>
          ) : (
            "Save Changes"
          )}
        </span>
      </Button>
    </form>
  );
}
