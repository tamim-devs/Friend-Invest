
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getMyProfile } from "@/lib/api/members";

import {
  Phone,
  Mail,
  MapPin,
  Wallet,
  CalendarDays,
  LogOut,
} from "lucide-react";

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-US").format(amount);

const ProfilePage = () => {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    let active = true;

    getMyProfile()
      .then((result) => {
        if (!active) return;
        setProfile(result.member);
        setStats(result.statistics);
      })
      .catch((error) => {
        if (active) setProfileError(error.message || "প্রোফাইল লোড করা যায়নি।");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

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

  const profileStats = stats
    ? [
        {
          id: "totalDeposited",
          label: "অনুমোদিত মোট জমা",
          value: `৳${formatAmount(stats.totalDeposit)}`,
          icon: Wallet,
          iconColor: "text-green-600",
          bgColor: "bg-[#e0f8e9]",
          valueColor: "text-green-700",
        },
        {
          id: "verifiedDeposits",
          label: "অনুমোদিত জমার সংখ্যা",
          value: stats.verifiedDeposits,
          icon: CalendarDays,
          iconColor: "text-blue-600",
          bgColor: "bg-[#e4edff]",
          valueColor: "text-blue-700",
        },
      ]
    : [];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#f8f9ff] px-3 pt-2 pb-3 text-[#172b4d]">
      {profileError && (
        <p role="alert" className="shrink-0 rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-600">
          {profileError}
        </p>
      )}

      {/* Profile Information */}
      <section className="flex shrink-0 flex-col items-center pt-2">

        {/* Profile Picture */}
        <div className="flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-full border-[4px] border-white bg-gradient-to-br from-sky-200 to-blue-300 shadow-md">

          {profile?.image ? (
            // Profile images are user-provided external URLs.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.image}
              alt={profile.name || "সদস্য"}
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
          {profile?.name || (isLoading ? "লোড হচ্ছে..." : "—")}
        </h2>

        {/* Member ID */}
        <span className="mt-1 rounded-full bg-purple-600 px-3 py-0.5 text-[10px] font-bold text-white">
          {profile?.memberId || "—"}
        </span>

      </section>

      {/* Contact Information */}
      <section className="mt-3 shrink-0 space-y-2 rounded-xl border border-[#e8eaf2] bg-white px-3 py-2.5">

        {/* Phone */}
        <div className="flex items-center gap-3">
          <Phone size={16} className="shrink-0 fill-blue-700 text-blue-700" />
          <p className="text-[11px] font-medium text-slate-700">
            {profile?.phone || "—"}
          </p>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail size={16} className="shrink-0 text-blue-700" />
          <p className="truncate text-[11px] font-medium text-slate-700">
            {profile?.email || "—"}
          </p>
        </div>

        {/* Address */}
        <div className="flex items-center gap-3">
          <MapPin size={16} className="shrink-0 fill-blue-700 text-blue-700" />
          <p className="text-[11px] font-medium text-slate-700">
            {profile?.address || "—"}
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
                    fill="none"
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
