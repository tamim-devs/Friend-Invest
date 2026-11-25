
"use client";

import { useMemo, useState } from "react";

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
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  Banknote,
  ChartNoAxesCombined,
} from "lucide-react";

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

// Dummy Financial Data
// Future Backend: GET /api/admin/reports

const reportData = {
  2026: {
    targetAmount: 720000,
    totalDeposit: 480000,
    totalExpense: 12000,
    bankBalance: 468000,

    monthlyReports: [
      { month: "জানু", deposit: 35000, expense: 1000 },
      { month: "ফেব্রু", deposit: 42000, expense: 500 },
      { month: "মার্চ", deposit: 50000, expense: 1500 },
      { month: "এপ্রিল", deposit: 48000, expense: 1000 },
      { month: "মে", deposit: 55000, expense: 500 },
      { month: "জুন", deposit: 62000, expense: 1000 },
      { month: "জুলাই", deposit: 58000, expense: 1500 },
      { month: "আগস্ট", deposit: 65000, expense: 1000 },
      { month: "সেপ্টে", deposit: 70000, expense: 1000 },
      { month: "অক্টো", deposit: 68000, expense: 1000 },
      { month: "নভে", deposit: 72000, expense: 2000 },
      { month: "ডিসে", deposit: 0, expense: 0 },
    ],

    transactions: [
      {
        _id: "TRX-001",
        title: "সদস্যদের মাসিক জমা",
        type: "deposit",
        amount: 72000,
        date: "2026-11-23",
        method: "bKash / Nagad",
      },
      {
        _id: "TRX-002",
        title: "ব্যাংক চার্জ",
        type: "expense",
        amount: 1000,
        date: "2026-11-18",
        method: "Bank",
      },
      {
        _id: "TRX-003",
        title: "সদস্যদের মাসিক জমা",
        type: "deposit",
        amount: 65000,
        date: "2026-10-20",
        method: "bKash",
      },
      {
        _id: "TRX-004",
        title: "অন্যান্য খরচ",
        type: "expense",
        amount: 1000,
        date: "2026-10-15",
        method: "Cash",
      },
      {
        _id: "TRX-005",
        title: "সদস্যদের মাসিক জমা",
        type: "deposit",
        amount: 62000,
        date: "2026-09-20",
        method: "Nagad",
      },
    ],
  },

  2025: {
    targetAmount: 600000,
    totalDeposit: 420000,
    totalExpense: 15000,
    bankBalance: 405000,

    monthlyReports: [
      { month: "জানু", deposit: 25000, expense: 1000 },
      { month: "ফেব্রু", deposit: 30000, expense: 1500 },
      { month: "মার্চ", deposit: 35000, expense: 1000 },
      { month: "এপ্রিল", deposit: 30000, expense: 1000 },
      { month: "মে", deposit: 40000, expense: 1500 },
      { month: "জুন", deposit: 35000, expense: 1000 },
      { month: "জুলাই", deposit: 45000, expense: 1500 },
      { month: "আগস্ট", deposit: 35000, expense: 1000 },
      { month: "সেপ্টে", deposit: 40000, expense: 1500 },
      { month: "অক্টো", deposit: 45000, expense: 1500 },
      { month: "নভে", deposit: 30000, expense: 2000 },
      { month: "ডিসে", deposit: 30000, expense: 1500 },
    ],

    transactions: [],
  },
};

const formatMoney = (amount) =>
  `${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));

const Page = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [selectedYear, setSelectedYear] = useState("2026");

  const data = reportData[selectedYear];

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

  const totalMonthlyDeposit = data.monthlyReports.reduce(
    (total, item) => total + item.deposit,
    0
  );

  const totalMonthlyExpense = data.monthlyReports.reduce(
    (total, item) => total + item.expense,
    0
  );

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
      {
        label: "খরচ",
        data: data.monthlyReports.map(
          (item) => item.expense
        ),
        borderColor: "#f59e0b",
        backgroundColor: "transparent",
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
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
  const transactions = useMemo(() => {
    return data.transactions.filter((item) =>
      activeTab === "deposits"
        ? item.type === "deposit"
        : activeTab === "expenses"
          ? item.type === "expense"
          : true
    );
  }, [data, activeTab]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtext,
  }) => (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-2 shadow-sm sm:rounded-2xl sm:p-3">

      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${color}`}>
        <Icon size={10} />
      </div>

      <p className="mt-1.5 truncate text-[9px] text-slate-500">
        {title}
      </p>

      <h3 className="mt-0.5 truncate text-[3px] font-extrabold text-slate-800 sm:text-base">
        {value}
      </h3>

      <p className="mt-0.5 truncate text-[8px] text-slate-400">
        {subtext}
      </p>

    </div>
  );

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
              আয়, ব্যয় ও আর্থিক হিসাব
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
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold outline-none"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>

        </section>

        {/* Tabs */}
        <section className="flex shrink-0 gap-1 rounded-lg bg-white p-1 shadow-sm">

          {[
            { value: "summary", label: "সারাংশ" },
            { value: "deposits", label: "জমা" },
            { value: "expenses", label: "বিবরণী" },
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
        <section className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4">

          <StatCard
            title="মোট জমা"
            value={formatMoney(data.totalDeposit)}
            icon={Wallet}
            color="bg-green-50 text-green-600"
            subtext="সর্বমোট সংগৃহীত"
          />

          <StatCard
            title="মোট খরচ"
            value={formatMoney(data.totalExpense)}
            icon={TrendingDown}
            color="bg-orange-50 text-orange-600"
            subtext="সর্বমোট ব্যয়"
          />

          <StatCard
            title="বর্তমান ব্যালেন্স"
            value={formatMoney(data.bankBalance)}
            icon={Banknote}
            color="bg-blue-50 text-blue-600"
            subtext="ব্যাংকে অবশিষ্ট"
          />

          <StatCard
            title="লক্ষ্যমাত্রা"
            value={`${depositPercentage.toFixed(0)}%`}
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
                  জমা ও খরচের হিসাব
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

        {/* Deposit Report */}
        {activeTab === "deposits" && (

          <section className="flex min-h-0 flex-1 flex-col rounded-xl border border-slate-100 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">

            <div className="mb-2 shrink-0">
              <h2 className="text-[11px] font-bold sm:text-sm">
                মাসিক জমার রিপোর্ট
              </h2>

              <p className="text-[8px] text-slate-400">
                {selectedYear} সালের জমার হিসাব
              </p>
            </div>

            <div className="mb-3 shrink-0 rounded-lg bg-green-50 p-2.5">
              <p className="text-[9px] text-slate-500">
                সর্বমোট জমা
              </p>

              <h3 className="mt-0.5 text-base font-extrabold text-green-700">
                {formatMoney(data.totalDeposit)}
              </h3>
            </div>

            <div className="min-h-0 flex-1">
              <Line
                data={{
                  labels: data.monthlyReports.map(
                    (item) => item.month
                  ),
                  datasets: [
                    {
                      label: "জমা",
                      data: data.monthlyReports.map(
                        (item) => item.deposit
                      ),
                      borderColor: "#16a34a",
                      backgroundColor: "rgba(22,163,74,0.1)",
                      fill: true,
                      tension: 0.4,
                      borderWidth: 2,
                      pointRadius: 2,
                    },
                  ],
                }}
                options={lineOptions}
              />
            </div>

          </section>

        )}

        {/* Expense / Details */}
        {activeTab === "expenses" && (

          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm sm:rounded-2xl">

            <div className="shrink-0 border-b border-slate-100 p-3">
              <h2 className="text-[11px] font-bold sm:text-sm">
                আর্থিক বিবরণী
              </h2>

              <p className="text-[8px] text-slate-400">
                আয় ও ব্যয়ের লেনদেন
              </p>
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-2 p-2.5">

              <div className="rounded-lg bg-green-50 p-2.5">
                <p className="text-[9px] text-slate-500">
                  মোট জমা
                </p>

                <p className="mt-0.5 text-xs font-extrabold text-green-700">
                  {formatMoney(totalMonthlyDeposit)}
                </p>
              </div>

              <div className="rounded-lg bg-orange-50 p-2.5">
                <p className="text-[9px] text-slate-500">
                  মোট খরচ
                </p>

                <p className="mt-0.5 text-xs font-extrabold text-orange-600">
                  {formatMoney(totalMonthlyExpense)}
                </p>
              </div>

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

                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          item.type === "deposit"
                            ? "bg-green-50 text-green-600"
                            : "bg-orange-50 text-orange-600"
                        }`}>
                          {item.type === "deposit" ? (
                            <ArrowDownRight size={15} />
                          ) : (
                            <ArrowUpRight size={15} />
                          )}
                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate text-[10px] font-bold">
                            {item.title}
                          </h3>

                          <p className="mt-0.5 text-[8px] text-slate-400">
                            {item.method} · {formatDate(item.date)}
                          </p>

                          <p className="text-[8px] text-slate-400">
                            {item._id}
                          </p>

                        </div>

                      </div>

                      <p className={`shrink-0 text-[10px] font-extrabold ${
                        item.type === "deposit"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}>
                        {item.type === "deposit" ? "+" : "-"}
                        {formatMoney(item.amount)}
                      </p>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="flex h-full items-center justify-center text-[10px] text-slate-400">
                  এই বছরের কোনো লেনদেন নেই।
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
