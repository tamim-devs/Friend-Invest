
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import {
  Settings,
  Wallet,
  CalendarDays,
  Bell,
  Info,
  LogOut,
  ChevronRight,
  Users,
  X,
  ShieldCheck,
  Loader2,
  Building2,
} from "lucide-react";

const settingsItems = [
  {
    id: "payment",
    title: "পেমেন্ট অ্যাকাউন্ট",
    description: "bKash, Nagad ও Bank Account পরিচালনা",
    icon: Wallet,
    color: "bg-purple-100 text-purple-600",
    details:
      "এখানে bKash, Nagad এবং Bank Account-এর তথ্য যুক্ত ও পরিচালনা করা যাবে।",
  },
  {
    id: "deposit",
    title: "মাসিক জমার নিয়ম",
    description: "সদস্যদের মাসিক জমার পরিমাণ ও নিয়ম",
    icon: CalendarDays,
    color: "bg-blue-100 text-blue-600",
    details:
      "এখানে মাসিক জমার পরিমাণ, জমার তারিখ এবং অন্যান্য নিয়ম পরিচালনা করা যাবে।",
  },
  {
    id: "notification",
    title: "নোটিফিকেশন সেটিংস",
    description: "অ্যাপের নোটিফিকেশন পরিচালনা",
    icon: Bell,
    color: "bg-amber-100 text-amber-600",
    details:
      "এখানে নতুন জমা, সদস্যদের আপডেট এবং অন্যান্য নোটিফিকেশন নিয়ন্ত্রণ করা যাবে।",
  },
  {
    id: "about",
    title: "অ্যাপ সম্পর্কে",
    description: "Friends Dream Builders সম্পর্কে জানুন",
    icon: Info,
    color: "bg-cyan-100 text-cyan-600",
    details:
      "Friends Dream Builders - Together We Grow. অ্যাপের তথ্য ও ভার্সন এখানে দেখানো যাবে।",
  },
];

const Page = () => {
  const router = useRouter();

  const [activeSetting, setActiveSetting] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    const confirmed = window.confirm(
      "আপনি কি নিশ্চিতভাবে অ্যাকাউন্ট থেকে লগআউট করতে চান?"
    );

    if (!confirmed || loggingOut) return;

    try {
      setLoggingOut(true);
      setError("");

      await authClient.signOut();

      router.replace("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Logout করা সম্ভব হয়নি। আবার চেষ্টা করুন।");
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-full bg-[#f4f6ff]">

      {/* Header */}
      <div className="rounded-b-2xl bg-gradient-to-r from-[#073e83] to-[#0756bd] px-4 py-5 text-white shadow-md sm:rounded-2xl sm:px-6">

        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <Settings size={23} />
            </div>

            <div>
              <h1 className="text-lg font-bold">
                সেটিংস
              </h1>

              <p className="text-[11px] text-blue-100">
                Friends Dream Builders Admin
              </p>
            </div>

          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
            <Users size={21} />
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-3xl space-y-4 px-3 py-4 sm:px-5 sm:py-5">

        {/* Organization Information */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Building2 size={29} />
            </div>

            <div className="min-w-0 flex-1">

              <h2 className="text-sm font-extrabold text-slate-800">
                Friends Dream Builders
              </h2>

              <p className="mt-1 text-[11px] text-slate-500">
                Together We Grow
              </p>

              <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-green-600">
                <ShieldCheck size={13} />
                Admin Panel
              </div>

            </div>

          </div>

        </div>

        {/* Settings Options */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">

          <h2 className="mb-3 px-1 text-sm font-bold text-slate-800">
            অ্যাপ সেটিংস
          </h2>

          <div className="space-y-1">

            {settingsItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSetting(item)}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50 active:bg-slate-100"
                >

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <Icon size={19} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="text-xs font-bold text-slate-800 sm:text-sm">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                      {item.description}
                    </p>

                  </div>

                  <ChevronRight
                    size={18}
                    className="shrink-0 text-slate-400"
                  />

                </button>
              );
            })}

          </div>
        </div>

        {/* Account Security */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-800">
                Account Security
              </h3>

              <p className="mt-1 text-[10px] text-slate-500">
                আপনার অ্যাকাউন্ট নিরাপদ রাখুন
              </p>
            </div>

          </div>

        </div>

        {/* Logout Error */}
        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600">
            {error}
          </p>
        )}

        {/* Logout */}
        <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <LogOut size={21} />
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-800">
                  লগ আউট
                </h3>

                <p className="mt-1 text-[10px] text-slate-500">
                  আপনার অ্যাডমিন অ্যাকাউন্ট থেকে বের হয়ে যান
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 text-xs font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >

              {loggingOut ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut size={15} />
                  Logout
                </>
              )}

            </button>

          </div>

        </div>

        {/* Footer */}
        <div className="pb-3 pt-1 text-center">
          <p className="text-[10px] font-medium text-slate-400">
            Friends Dream Builders
          </p>

          <p className="mt-1 text-[9px] text-slate-400">
            Together We Grow
          </p>
        </div>

      </div>

      {/* Settings Details Modal */}
      {activeSetting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">

          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">

            <div className="mb-4 flex items-center justify-between">

              <h3 className="text-sm font-bold text-slate-800">
                {activeSetting.title}
              </h3>

              <button
                type="button"
                onClick={() => setActiveSetting(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
              >
                <X size={17} />
              </button>

            </div>

            <p className="text-xs leading-6 text-slate-600">
              {activeSetting.details}
            </p>

            <p className="mt-4 rounded-xl bg-blue-50 p-3 text-[11px] leading-5 text-blue-700">
              এই সেটিংসের Backend API পরবর্তীতে যুক্ত করা যাবে। বর্তমানে কোনো ডেটা পরিবর্তন বা সংরক্ষণ করা হচ্ছে না।
            </p>

            <button
              type="button"
              onClick={() => setActiveSetting(null)}
              className="mt-4 h-10 w-full rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700"
            >
              ঠিক আছে
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default Page;
