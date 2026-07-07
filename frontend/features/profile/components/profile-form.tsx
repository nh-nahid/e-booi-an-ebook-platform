"use client";

import { useState } from "react";
import { User, Mail, Phone, FileText, Loader2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateProfile } from "../hooks/profile.hooks";

interface ProfileFormValues {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
}

interface ProfileFormProps {
  defaultValues?: ProfileFormValues;
}


const fieldBase =
  "h-11 rounded-xl border-[#E1E5E8] pl-10 transition-all duration-200 " +
  "focus-visible:border-[#2DBDB6] focus-visible:ring-4 focus-visible:ring-[#2DBDB6]/15";


export default function ProfileForm({
  defaultValues = {
    name: "",
    email: "",
    phone: "",
    bio: "",
  },
}: ProfileFormProps) {

  const {
    mutateAsync: updateProfile,
    isPending,
  } = useUpdateProfile();


  const [values, setValues] =
    useState<ProfileFormValues>(defaultValues);


  const [focused, setFocused] =
    useState<string | null>(null);


  const [saved, setSaved] =
    useState(false);



  const update = (
    key: keyof ProfileFormValues,
    value: string
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };



  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      await updateProfile({
        name: values.name,
        phone: values.phone,
        bio: values.bio,
      });


      setSaved(true);


      setTimeout(() => {
        setSaved(false);
      }, 2200);


    } catch (error) {

      console.error(
        "Profile update failed:",
        error
      );

    }
  };



  const iconColor = (key: string) =>
    focused === key
      ? "#2DBDB6"
      : "#9AA3AF";



  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full rounded-3xl border border-[#E1E5E8]
        bg-white p-6
        shadow-[0_10px_30px_rgba(10,14,42,0.06)]
        animate-in fade-in slide-in-from-bottom-2 duration-500
      "
    >


      <div className="mb-5">

        <h3 className="text-lg font-bold text-[#0A0E2A]">
          Edit Profile
        </h3>


        <p className="text-sm text-[#6B7280]">
          Update your personal information.
        </p>

      </div>



      {/* Name */}
      <div className="space-y-1.5">

        <Label
          htmlFor="name"
          className="text-xs font-semibold text-[#0A0E2A]"
        >
          Full Name
        </Label>


        <div className="relative">

          <User
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{
              color: iconColor("name"),
            }}
          />


          <Input
            id="name"
            value={values.name}
            onChange={(e)=>
              update(
                "name",
                e.target.value
              )
            }
            onFocus={() =>
              setFocused("name")
            }
            onBlur={() =>
              setFocused(null)
            }
            className={fieldBase}
          />

        </div>

      </div>




      {/* Email */}
      <div className="mt-4 space-y-1.5">

        <Label
          htmlFor="email"
          className="text-xs font-semibold text-[#0A0E2A]"
        >
          Email
        </Label>


        <div className="relative">

          <Mail
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{
              color: iconColor("email"),
            }}
          />


          <Input
            id="email"
            type="email"
            value={values.email}
            disabled
            className={`${fieldBase} cursor-not-allowed bg-[#F7F9FA]`}
          />

        </div>

      </div>




      {/* Phone */}
      <div className="mt-4 space-y-1.5">

        <Label
          htmlFor="phone"
          className="text-xs font-semibold text-[#0A0E2A]"
        >
          Phone
          <span className="ml-1 font-normal text-[#9AA3AF]">
            (optional)
          </span>
        </Label>


        <div className="relative">

          <Phone
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{
              color: iconColor("phone"),
            }}
          />


          <Input
            id="phone"
            value={values.phone}
            onChange={(e)=>
              update(
                "phone",
                e.target.value
              )
            }
            onFocus={() =>
              setFocused("phone")
            }
            onBlur={() =>
              setFocused(null)
            }
            placeholder="+880 1XX XXX XXXX"
            className={fieldBase}
          />

        </div>

      </div>




      {/* Bio */}
      <div className="mt-4 space-y-1.5">

        <Label
          htmlFor="bio"
          className="text-xs font-semibold text-[#0A0E2A]"
        >
          Bio
        </Label>


        <div className="relative">

          <FileText
            className="absolute left-3 top-3 h-4 w-4"
            style={{
              color: iconColor("bio"),
            }}
          />


          <Textarea
            id="bio"
            rows={3}
            value={values.bio}
            onChange={(e)=>
              update(
                "bio",
                e.target.value
              )
            }
            onFocus={() =>
              setFocused("bio")
            }
            onBlur={() =>
              setFocused(null)
            }
            placeholder="Tell us about yourself..."
            className="
              resize-none rounded-xl
              border-[#E1E5E8]
              pl-10 pt-2.5
              focus-visible:border-[#2DBDB6]
              focus-visible:ring-4
              focus-visible:ring-[#2DBDB6]/15
            "
          />

        </div>

      </div>




      <Button
        type="submit"
        disabled={isPending}
        className="
          mt-6 h-11 w-full rounded-full
          bg-gradient-to-br from-[#2DBDB6] to-[#1f9d97]
          font-semibold text-white
          shadow-[0_4px_12px_rgba(45,189,182,0.35)]
        "
      >

        {
          isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          )
          :
          saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved
            </>
          )
          :
          "Save Changes"
        }

      </Button>


    </form>
  );
}