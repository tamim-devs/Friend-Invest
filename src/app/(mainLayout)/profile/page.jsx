
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import {
  Phone,
  Mail,
  MapPin,
  Wallet,
  CalendarDays,
  BriefcaseBusiness,
  Star,
  LogOut,
} from "lucide-react";

// Demo Profile Data
const initialProfile = {
  _id: "user_001",
  fullName: "Abrar Fahim",
  memberId: "FB-001",
  phone: "01XXXXXXXXX",
  email: "example@gmail.com",
  address: "Dhaka, Bangladesh",
  avatar: null,
};

// Demo Statistics
const initialStats = {
  totalDeposited: 45500,
  totalMonths: 18,
  totalInvestment: 45500,
  successRate: 63,
};

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-US").format(amount);

const ProfilePage = () => {
  const router = useRouter();

  const [profile] = useState(initialProfile);
  const [stats] = useState(initialStats);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      setLogoutError("");

      const { error } = await authClient.signOut();

      if (error) {
        setLogoutError(error.message || "Logout করা যায়নি।");
        return;
      }

      router.replace("/login");
      router.refresh();

    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoggingOut(false);
    }
  };

  const profileStats = [
    {
      id: "totalDeposited",
      label: "মোট জমা",
      value: `৳${formatAmount(stats.totalDeposited)}`,
      icon: Wallet,
      iconColor: "text-green-600",
      bgColor: "bg-[#e0f8e9]",
      valueColor: "text-green-700",
    },
    {
      id: "totalMonths",
      label: "মোট মাস",
      value: stats.totalMonths,
      icon: CalendarDays,
      iconColor: "text-blue-600",
      bgColor: "bg-[#e4edff]",
      valueColor: "text-blue-700",
    },
    {
      id: "totalInvestment",
      label: "মোট বিনিয়োগ",
      value: `৳${formatAmount(stats.totalInvestment)}`,
      icon: BriefcaseBusiness,
      iconColor: "text-purple-600",
      bgColor: "bg-[#f0e4ff]",
      valueColor: "text-purple-700",
    },
    {
      id: "successRate",
      label: "সফলতার হার",
      value: `${stats.successRate}%`,
      icon: Star,
      iconColor: "text-orange-500",
      bgColor: "bg-[#fff0df]",
      valueColor: "text-orange-600",
    },
  ];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#f8f9ff] px-3 pt-2 pb-3 text-[#172b4d]">

      {/* Profile Information */}
      <section className="flex shrink-0 flex-col items-center pt-2">

        {/* Profile Picture */}
        <div className="flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-full border-[4px] border-white bg-gradient-to-br from-sky-200 to-blue-300 shadow-md">

          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[54px] leading-none">
              👨🏻‍💻
            </span>
          )}

        </div>

        {/* Name */}
        <h2 className="mt-1.5 text-[16px] font-extrabold text-slate-800">
          {profile.fullName}
        </h2>

        {/* Member ID */}
        <span className="mt-1 rounded-full bg-purple-600 px-3 py-0.5 text-[10px] font-bold text-white">
          {profile.memberId}
        </span>

      </section>

      {/* Contact Information */}
      <section className="mt-3 shrink-0 space-y-2 rounded-xl border border-[#e8eaf2] bg-white px-3 py-2.5">

        {/* Phone */}
        <div className="flex items-center gap-3">
          <Phone size={16} className="shrink-0 fill-blue-700 text-blue-700" />
          <p className="text-[11px] font-medium text-slate-700">
            {profile.phone}
          </p>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail size={16} className="shrink-0 text-blue-700" />
          <p className="truncate text-[11px] font-medium text-slate-700">
            {profile.email}
          </p>
        </div>

        {/* Address */}
        <div className="flex items-center gap-3">
          <MapPin size={16} className="shrink-0 fill-blue-700 text-blue-700" />
          <p className="text-[11px] font-medium text-slate-700">
            {profile.address}
          </p>
        </div>

      </section>

      {/* Statistics */}
      <section className="mt-3 shrink-0">

        <h3 className="mb-2 text-[13px] font-bold text-slate-800">
          আমার পরিসংখ্যান
        </h3>

        <div className="grid grid-cols-2 gap-2">

          {profileStats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className={`flex h-[67px] items-center gap-2.5 rounded-xl border border-white px-2.5 shadow-sm ${item.bgColor}`}
              >

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80">
                  <Icon
                    size={19}
                    className={item.iconColor}
                    fill={
                      item.id === "successRate"
                        ? "currentColor"
                        : "none"
                    }
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-slate-600">
                    {item.label}
                  </p>

                  <p className={`truncate text-[14px] font-extrabold ${item.valueColor}`}>
                    {item.value}
                  </p>
                </div>

              </div>
            );
          })}

        </div>

      </section>

      
    

      {/* Logout Error */}
      {logoutError && (
        <p className="mt-2 text-center text-xs text-red-500">
          {logoutError}
        </p>
      )}

      {/* Logout */}
      <div className="mt-auto shrink-0 pt-3">

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex h-[43px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-[13px] font-bold text-white shadow-md shadow-red-100 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? "লগআউট হচ্ছে..." : "লগ আউট"}
          <LogOut size={16} />
        </button>

      </div>

    </div>
  );
};

export default ProfilePage;
