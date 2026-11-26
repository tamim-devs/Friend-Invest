
"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Wallet,
  Users,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";
import { getDashboard } from "@/lib/api/dashboard";

const formatMoney = (amount) =>
  `৳${Number(amount || 0).toLocaleString("en-IN")}`;

const DashboardStats = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    getDashboard()
      .then((result) => {
        if (active && result?.statistics) {
          setDashboardStats(result.statistics);
        }
      })
      .catch((error) => {
        if (active) {
          setLoadError(error.message || "ড্যাশবোর্ডের তথ্য লোড করা যায়নি।");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (isLoading || loadError || !dashboardStats) {
    return (
      <section className="flex h-full items-center justify-center text-center text-xs text-slate-500">
        {isLoading ? "তথ্য লোড হচ্ছে..." : loadError || "কোনো তথ্য পাওয়া যায়নি।"}
      </section>
    );
  }

  const bankBalance = Number(dashboardStats.totalDeposit || 0);
  const targetAmount = Number(dashboardStats.targetAmount || 0);

  // Bank Balance vs Target Progress
  const progress =
    targetAmount > 0
      ? Math.min((bankBalance / targetAmount) * 100, 100)
      : 0;

  // Remaining Amount
  const remainingAmount = Math.max(
    targetAmount - bankBalance,
    0
  );

  const cards = [
    {
      title: "মোট সদস্য",
      value: `${dashboardStats.totalMembers || 0} জন`,
      icon: Users,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      text: "text-green-600",
    },
    {
      title: "আমার মোট জমা",
      value: formatMoney(bankBalance),
      icon: Wallet,
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      text: "text-purple-600",
    },
    {
      title: "অনুমোদনের অপেক্ষায়",
      value: `${dashboardStats.pendingDeposits || 0} টি`,
      icon: Wallet,
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      text: "text-amber-500",
    },
    {
      title: "লক্ষ্যে বাকি",
      value: formatMoney(remainingAmount),
      icon: ChartNoAxesColumnIncreasing,
      bg: "bg-sky-50",
      iconBg: "bg-sky-100",
      text: "text-sky-600",
    },
  ];

  return (
    <section className="flex h-full min-h-0 w-full flex-col gap-2">
      {loadError && (
        <p className="shrink-0 rounded-lg bg-red-50 px-2 py-1 text-center text-[9px] text-red-600">
          {loadError}
        </p>
      )}

      {/* Bank Balance & Progress */}
      <div className="shrink-0 rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-2.5">

        <div className="flex items-center justify-between">

          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-gray-700">
              আমার অনুমোদিত মোট জমা
            </p>

            <h2 className="mt-0.5 text-xl font-extrabold leading-tight text-gray-900">
              {formatMoney(bankBalance)}
            </h2>

            <p className="mt-1 text-[9px] font-medium text-gray-600">
              {targetAmount > 0
                ? `লক্ষ্যমাত্রা: ${formatMoney(targetAmount)}`
                : "লক্ষ্যমাত্রা নির্ধারণ করা হয়নি"}
            </p>
          </div>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
            <ShieldCheck size={18} />
          </div>

        </div>

        {/* Progress Bar */}
        <div className="mt-2 flex items-center gap-2">

          <div className="h-2 flex-1 overflow-hidden rounded-full bg-green-200">

            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-lime-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />

          </div>

          <span className="text-[9px] font-bold text-gray-800">
            {progress.toFixed(1)}%
          </span>

        </div>

        {/* Remaining Amount */}
        <div className="mt-1.5 flex items-center justify-between">
          <p className="text-[9px] font-medium text-gray-600">
            {targetAmount <= 0
              ? "অগ্রগতি দেখাতে আগে লক্ষ্যমাত্রা সেট করুন।"
              : progress >= 100
                ? "অভিনন্দন! লক্ষ্যমাত্রা পূরণ হয়েছে।"
                : `আরও ${formatMoney(remainingAmount)} জমা প্রয়োজন`}
          </p>

          <p className="text-[9px] font-bold text-green-700">
            {targetAmount <= 0
              ? "লক্ষ্যমাত্রা নেই"
              : progress >= 100
                ? "লক্ষ্য পূর্ণ"
                : "লক্ষ্যের অগ্রগতি"}
          </p>
        </div>

      </div>

      {/* Statistics Grid */}
      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-2">

        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`flex min-h-0 flex-col items-center justify-center rounded-xl border border-gray-100 p-2 ${item.bg}`}
            >

              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.iconBg} ${item.text}`}
              >
                <Icon size={17} strokeWidth={2.5} />
              </div>

              <div className="mt-1 text-center">

                <p className="text-[9px] font-semibold text-gray-600">
                  {item.title}
                </p>

                <h3 className="mt-0.5 truncate text-[15px] font-extrabold leading-tight text-gray-900">
                  {item.value}
                </h3>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
};

export default DashboardStats;
