
"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";

import {
  Wallet,
  Users,
  TrendingUp,
  Target,
  Trophy,
  Crown,
  RefreshCw,
} from "lucide-react";
import { getAdminDashboard } from "@/lib/api/dashboard";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const formatMoney = (amount) =>
  `৳${Number(amount || 0).toLocaleString("en-IN")}`;

const Page = () => {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    getAdminDashboard()
      .then((result) => {
        if (!active) return;

        setDashboard(result);
      })
      .catch((error) => {
        if (active) {
          setLoadError(error.message || "Admin dashboard তথ্য লোড করা যায়নি।");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (isLoading || loadError || !dashboard) {
    return (
      <main className="flex h-dvh items-center justify-center bg-[#f5f7fc] p-5 text-center text-sm text-slate-600">
        {isLoading ? "ড্যাশবোর্ড লোড হচ্ছে..." : loadError || "ড্যাশবোর্ডের তথ্য পাওয়া যায়নি।"}
      </main>
    );
  }

  const data = dashboard.statistics;
  const topContributors = (dashboard.topContributors || [])
    .map((member) => ({
      name: member.name || member.memberName || member.memberId || "সদস্য",
      total: Number(member.total ?? member.totalDeposit ?? 0),
    }))
    .filter((member) => Number.isFinite(member.total) && member.total > 0);

  const progress =
    data.targetAmount > 0
      ? Math.min(
          (data.bankBalance / data.targetAmount) * 100,
          100
        )
      : 0;

  const remainingAmount = Math.max(
    data.targetAmount - data.bankBalance,
    0
  );

  // Donut Chart Center Text
  const centerText = {
    id: "centerText",

    afterDraw(chart) {
      const { ctx, chartArea } = chart;

      if (!chartArea) return;

      const centerX =
        (chartArea.left + chartArea.right) / 2;

      const centerY =
        (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.font = "bold 22px sans-serif";
      ctx.fillStyle = "#073e6c";

      ctx.fillText(
        `${progress.toFixed(1)}%`,
        centerX,
        centerY
      );

      ctx.restore();
    },
  };

  // Target Progress Chart
  const progressChart = {
    labels: ["জমা", "বাকি"],

    datasets: [
      {
        data: [
          data.bankBalance,
          remainingAmount,
        ],

        backgroundColor: [
          "#22c55e",
          "#facc15",
        ],

        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const progressOptions = {
    responsive: true,
    maintainAspectRatio: false,

    cutout: "76%",

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ${formatMoney(context.raw)}`,
        },
      },
    },
  };

  // Contributors Bar Chart
  const contributorChart = {
    labels: topContributors.map((member) => member.name),

    datasets: [
      {
        label: "মোট জমা",

        data: topContributors.map((member) => member.total),

        backgroundColor: [
          "#0f766e",
          "#2563eb",
          "#d97706",
          "#7c3aed",
          "#0891b2",
        ],

        borderRadius: 8,
        barThickness: 18,
      },
    ],
  };

  const contributorOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: (context) =>
            ` ${formatMoney(context.raw)}`,
        },
      },
    },

    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: "#e2e8f0",
          drawTicks: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#64748b",
          font: {
            size: 9,
          },
          callback: (value) => formatMoney(value),
        },
      },

      y: {
        grid: {
          display: false,
        },

        border: {
          display: false,
        },

        ticks: {
          color: "#475569",
          font: {
            size: 9,
            weight: "600",
          },
        },
      },
    },
  };

  return (
    <main className="min-h-full w-full bg-[#f5f7fc] p-3 text-slate-800 sm:p-5">

      <div className="mx-auto flex min-h-full max-w-7xl flex-col gap-3 sm:gap-4">

        {/* Header */}
        <header className="flex shrink-0 items-center justify-between rounded-2xl bg-gradient-to-r from-[#073e6c] to-[#1264a3] px-4 py-3 text-white shadow-md">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Crown size={25} className="text-yellow-300" />
            </div>

            <div>
              <h2 className="text-sm font-extrabold sm:text-base">
                Admin Panel
              </h2>

              <p className="text-[10px] text-blue-100 sm:text-xs">
                Friends Dream Builders
              </p>
            </div>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
            A
          </div>

        </header>

        {/* Dashboard Title */}
        <div className="flex shrink-0 items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold sm:text-2xl">
              Admin Dashboard
            </h1>

            <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
              সংগঠনের সার্বিক হিসাব ও কার্যক্রম
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            aria-label="Refresh dashboard"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Statistics */}
        <section className="grid shrink-0 grid-cols-3 gap-2 sm:gap-3">

          <div className="min-w-0 rounded-xl border border-green-100 bg-green-50 p-2.5 sm:rounded-2xl sm:p-4">
            <Users className="text-green-600" size={20} />

            <p className="mt-2 truncate text-[10px] font-semibold text-slate-500 sm:text-xs">
              মোট সদস্য
            </p>

            <h3 className="mt-1 text-base font-extrabold sm:text-2xl">
              {data.totalMembers}
            </h3>

            <p className="text-[9px] text-slate-400">
              জন
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-purple-100 bg-purple-50 p-2.5 sm:rounded-2xl sm:p-4">
            <Wallet className="text-purple-600" size={20} />

            <p className="mt-2 truncate text-[10px] font-semibold text-slate-500 sm:text-xs">
              মোট ফান্ড
            </p>

            <h3 className="mt-1 truncate text-sm font-extrabold sm:text-2xl">
              {formatMoney(data.bankBalance)}
            </h3>

            <p className="text-[9px] text-slate-400">
              বর্তমান ব্যালেন্স
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-orange-100 bg-orange-50 p-2.5 sm:rounded-2xl sm:p-4">
            <TrendingUp className="text-orange-600" size={20} />

            <p className="mt-2 truncate text-[10px] font-semibold text-slate-500 sm:text-xs">
              এই মাসে জমা
            </p>

            <h3 className="mt-1 truncate text-sm font-extrabold sm:text-2xl">
              {formatMoney(data.monthlyDeposit)}
            </h3>

            <p className="text-[9px] text-slate-400">
              মাসিক জমা
            </p>
          </div>

        </section>

        {/* Target Progress */}
        <section className="shrink-0 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-5">

          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-extrabold sm:text-base">
                ফান্ডের লক্ষ্যমাত্রা
              </h2>

              <p className="text-[10px] text-slate-400 sm:text-xs">
                মোট জমা ও বাকি অর্থ
              </p>
            </div>

            <Target size={21} className="text-blue-600" />
          </div>

          <div className="flex items-center gap-3 sm:gap-8">

            <div className="relative h-28 w-28 shrink-0 sm:h-36 sm:w-36">
              <Doughnut
                data={progressChart}
                options={progressOptions}
                plugins={[centerText]}
              />
            </div>

            <div className="min-w-0 flex-1 space-y-3">

              <div>
                <p className="text-[10px] text-slate-500 sm:text-xs">
                  মোট লক্ষ্যমাত্রা
                </p>

                <h3 className="text-sm font-extrabold sm:text-xl">
                  {formatMoney(data.targetAmount)}
                </h3>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <p className="text-[10px] text-slate-500 sm:text-xs">
                    মোট জমা
                  </p>
                </div>

                <h3 className="text-sm font-bold text-green-600 sm:text-base">
                  {formatMoney(data.bankBalance)}
                </h3>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />

                  <p className="text-[10px] text-slate-500 sm:text-xs">
                    বাকি রয়েছে
                  </p>
                </div>

                <h3 className="text-sm font-bold text-orange-500 sm:text-base">
                  {formatMoney(remainingAmount)}
                </h3>
              </div>

            </div>
          </div>

        </section>

        {/* Contributors */}
        <section className="flex min-h-[230px] flex-1 flex-col rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:min-h-[280px] sm:p-5">

          <div className="mb-2 flex shrink-0 items-center justify-between">

            <div>
              <h2 className="text-xs font-extrabold sm:text-base">
                সদস্যদের অবদান
              </h2>

              <p className="text-[10px] text-slate-400 sm:text-xs">
                সর্বোচ্চ জমাদানকারী সদস্য
              </p>
            </div>

            <Trophy size={21} className="text-yellow-500" />

          </div>

          {topContributors.length ? (
            <div className="min-h-[170px] flex-1">
              <Bar data={contributorChart} options={contributorOptions} />
            </div>
          ) : (
            <div className="flex min-h-[170px] flex-1 items-center justify-center rounded-xl bg-slate-50 px-4 text-center text-xs text-slate-500">
              এখনো কোনো অনুমোদিত জমার তথ্য নেই।
            </div>
          )}

        </section>

        {/* Footer */}
        <footer className="shrink-0 pb-1 text-center text-[9px] text-slate-400">
          Friends Dream Builders · Admin Dashboard
        </footer>

      </div>
    </main>
  );
};

export default Page;
