
"use client";

import {
  ShieldCheck,
  Wallet,
  Users,
  ChartNoAxesColumnIncreasing,
  Star,
} from "lucide-react";

// Demo Data
// Future: Backend API থেকে এই Data আসবে।
const dummyStats = {
  _id: "dashboard-stats-001",
  bankBalance: 40000,
  targetAmount: 720000,
  totalMembers: 20,
  monthlyDeposit: 72000,
  highestDeposit: 36000,
};

const formatMoney = (amount) =>
  `৳${Number(amount || 0).toLocaleString("en-IN")}`;

const DashboardStats = ({ stats = dummyStats }) => {
  const bankBalance = Number(stats.bankBalance || 0);
  const targetAmount = Number(stats.targetAmount || 0);

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
      value: `${stats.totalMembers || 0} জন`,
      icon: Users,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      text: "text-green-600",
    },
    {
      title: "এই মাসের জমা",
      value: formatMoney(stats.monthlyDeposit),
      icon: Wallet,
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      text: "text-purple-600",
    },
    {
      title: "সর্বোচ্চ জমা",
      value: formatMoney(stats.highestDeposit),
      icon: Star,
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

      {/* Bank Balance & Progress */}
      <div className="shrink-0 rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-2.5">

        <div className="flex items-center justify-between">

          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-gray-700">
              ব্যাংকে বর্তমান জমা
            </p>

            <h2 className="mt-0.5 text-xl font-extrabold leading-tight text-gray-900">
              {formatMoney(bankBalance)}
            </h2>

            <p className="mt-1 text-[9px] font-medium text-gray-600">
              লক্ষ্যমাত্রা: {formatMoney(targetAmount)}
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
            {progress >= 100
              ? "অভিনন্দন! লক্ষ্যমাত্রা পূরণ হয়েছে।"
              : `আরও ${formatMoney(remainingAmount)} জমা প্রয়োজন`}
          </p>

          <p className="text-[9px] font-bold text-green-700">
            {progress >= 100 ? "লক্ষ্য পূর্ণ" : "লক্ষ্যের অগ্রগতি"}
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
