
"use client";

import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

import { Doughnut, Line } from "react-chartjs-2";

import {
  Wallet,
  TrendingUp,
  CalendarDays,
  ChartNoAxesCombined,
} from "lucide-react";
import { getReports } from "@/lib/api/reports";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

const REPORT_YEARS = [2027, 2028, 2029, 2030];

const formatMoney = (amount) =>
  `${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-2 shadow-sm sm:rounded-2xl sm:p-3">
    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${color}`}>
      <Icon size={10} />
    </div>
    <p className="mt-1.5 truncate text-[9px] text-slate-500">{title}</p>
    <h3 className="mt-0.5 truncate text-[13px] font-extrabold text-slate-800 sm:text-base">
      {value}
    </h3>
    <p className="mt-0.5 truncate text-[8px] text-slate-400">{subtext}</p>
  </div>
);

const Page = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [selectedYear, setSelectedYear] = useState(String(REPORT_YEARS[0]));
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    getReports(selectedYear)
      .then((result) => {
        if (!active) return;
        setReport({
          targetAmount: Number(result.targetAmount || 0),
          totalDeposit: Number(result.summary?.totalAmount || 0),
          totalDeposits: Number(result.summary?.totalDeposits || 0),
          monthlyReports: (result.monthly || []).map((item, index) => ({
            month: new Intl.DateTimeFormat("bn-BD", { month: "short" }).format(
              new Date(Number(selectedYear), index, 1)
            ),
            deposit: Number(item.total || 0),
          })),
          transactions: result.transactions || [],
        });
      })
      .catch((error) => {
        if (active) setLoadError(error.message || "রিপোর্ট লোড করা যায়নি।");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedYear]);

  if (isLoading || loadError || !report) {
    return (
      <main className="flex h-dvh items-center justify-center bg-[#f5f7fc] p-5 text-center text-sm text-slate-600">
        {isLoading ? "রিপোর্ট লোড হচ্ছে..." : loadError || "রিপোর্ট পাওয়া যায়নি।"}
      </main>
    );
  }

  const data = report;

  const remainingAmount = Math.max(
    data.targetAmount - data.totalDeposit,
    0
  );

  const depositPercentage =
    data.targetAmount > 0
      ? Math.min(
          (data.totalDeposit / data.targetAmount) * 100,
          100
        )
      : 0;

  // Doughnut Chart
  const donutData = {
    labels: ["জমা", "বাকি"],
    datasets: [
      {
        data: [
          data.totalDeposit,
          remainingAmount,
        ],
        backgroundColor: ["#22c55e", "#facc15"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",

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

  // Monthly Line Chart
  const lineData = {
    labels: data.monthlyReports.map(
      (item) => item.month
    ),

    datasets: [
      {
        label: "জমা",
        data: data.monthlyReports.map(
          (item) => item.deposit
        ),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.08)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 7,
          boxHeight: 7,
          usePointStyle: true,
          font: {
            size: 8,
          },
        },
      },

      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${formatMoney(context.raw)}`,
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 8,
          },
        },
      },

      y: {
        beginAtZero: true,
        grid: {
          color: "#f1f5f9",
        },
        ticks: {
          font: {
            size: 8,
          },
          callback: (value) => `${value / 1000}k`,
        },
      },
    },
  };

  // Transaction Filter
  const transactions = data.transactions;

  return (
    <main className="h-full min-h-0 overflow-hidden bg-[#f5f7fc] p-2.5 text-slate-800 sm:p-4">

      <div className="mx-auto flex h-full max-w-7xl flex-col gap-2 sm:gap-3">

        {/* Header */}
        <header className="flex shrink-0 items-center justify-between">

          <div>
            <p className="text-[8px] text-slate-400 sm:text-[10px]">
              Friends Dream Builders / Admin
            </p>

            <h1 className="mt-0.5 text-base font-extrabold sm:text-xl">
              আর্থিক প্রতিবেদন
            </h1>

            <p className="mt-0.5 text-[9px] text-slate-500">
              জমার হিসাব ও অগ্রগতি
            </p>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 sm:h-10 sm:w-10">
            <ChartNoAxesCombined size={18} />
          </div>

        </header>

        {/* Year Filter */}
        <section className="flex shrink-0 items-center justify-between">

          <div className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-500">
            <CalendarDays size={13} />
            রিপোর্টের বছর
          </div>

          <select
            value={selectedYear}
            onChange={(e) => {
              setIsLoading(true);
              setLoadError("");
              setSelectedYear(e.target.value);
            }}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold outline-none"
          >
            {REPORT_YEARS.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

        </section>

        {/* Tabs */}
        <section className="flex shrink-0 gap-1 rounded-lg bg-white p-1 shadow-sm">

          {[
            { value: "summary", label: "সারাংশ" },
            { value: "deposits", label: "জমার তালিকা" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-1 rounded-md py-1.5 text-[9px] font-bold transition ${
                activeTab === tab.value
                  ? "bg-[#073e6c] text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}

        </section>

        {/* Statistics */}
        <section className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3">

          <StatCard
            title="মোট জমা"
            value={formatMoney(data.totalDeposit)}
            icon={Wallet}
            color="bg-green-50 text-green-600"
            subtext="সর্বমোট সংগৃহীত"
          />

          <StatCard
            title="অনুমোদিত জমা"
            value={data.totalDeposits}
            icon={Wallet}
            color="bg-blue-50 text-blue-600"
            subtext="জমার সংখ্যা"
          />

          <StatCard
            title="লক্ষ্যমাত্রা"
            value={data.targetAmount > 0 ? `${depositPercentage.toFixed(0)}%` : "—"}
            icon={TrendingUp}
            color="bg-purple-50 text-purple-600"
            subtext={formatMoney(data.targetAmount)}
          />

        </section>

        {/* Summary */}
        {activeTab === "summary" && (

          <div className="flex min-h-0 flex-1 flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-3">

            {/* Doughnut Chart */}
            <section className="shrink-0 rounded-xl border border-slate-100 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">

              <div>
                <h2 className="text-[11px] font-bold sm:text-sm">
                  ফান্ডের অগ্রগতি
                </h2>
                <p className="text-[8px] text-slate-400">
                  জমা ও বাকি লক্ষ্যমাত্রা
                </p>
              </div>

              <div className="mt-2 flex items-center gap-3 sm:mt-4 sm:flex-col">

                <div className="relative h-24 w-24 shrink-0 sm:h-36 sm:w-36">
                  <Doughnut
                    data={donutData}
                    options={donutOptions}
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-2 sm:w-full">

                  <div>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <p className="text-[9px] text-slate-500">
                        জমা হয়েছে
                      </p>
                    </div>

                    <p className="text-xs font-extrabold text-green-600">
                      {formatMoney(data.totalDeposit)}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                      <p className="text-[9px] text-slate-500">
                        বাকি রয়েছে
                      </p>
                    </div>

                    <p className="text-xs font-extrabold text-orange-500">
                      {formatMoney(remainingAmount)}
                    </p>
                  </div>

                </div>

              </div>

            </section>

            {/* Monthly Chart */}
            <section className="flex min-h-0 flex-1 flex-col rounded-xl border border-slate-100 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">

              <div className="mb-2 shrink-0">
                <h2 className="text-[11px] font-bold sm:text-sm">
                  মাসিক তুলনা
                </h2>

                <p className="text-[8px] text-slate-400">
                  মাসভিত্তিক জমার হিসাব
                </p>
              </div>

              <div className="min-h-0 flex-1">
                <Line
                  data={lineData}
                  options={lineOptions}
                />
              </div>

            </section>

          </div>

        )}

        {/* Deposit List */}
        {activeTab === "deposits" && (

          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-100 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">

            <div className="mb-2 shrink-0">
              <h2 className="text-[11px] font-bold sm:text-sm">
                অনুমোদিত জমার তালিকা
              </h2>

              <p className="text-[8px] text-slate-400">
                {selectedYear} সালের জমা
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

              {transactions.length > 0 ? (

                <div className="divide-y divide-slate-100">

                  {transactions.map((item) => (

                    <div
                      key={item._id}
                      className="flex items-center justify-between gap-2 px-3 py-2.5"
                    >

                      <div className="flex min-w-0 items-center gap-2">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                          <Wallet size={15} />
                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate text-[10px] font-bold">
                            {item.title}
                          </h3>

                          <p className="mt-0.5 text-[8px] text-slate-400">
                            {item.method || "—"} · {formatDate(item.date)}
                          </p>

                        </div>

                      </div>

                      <p className="shrink-0 text-[10px] font-extrabold text-green-600">
                        +
                        {formatMoney(item.amount)}
                      </p>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="flex h-full items-center justify-center text-[10px] text-slate-400">
                  এই বছরের কোনো অনুমোদিত জমা নেই।
                </div>

              )}

            </div>

          </section>

        )}

        {/* Footer */}
        <footer className="shrink-0 pb-0.5 text-center text-[8px] text-slate-400">
          Friends Dream Builders · Financial Reports
        </footer>

      </div>

    </main>
  );
};

export default Page;
