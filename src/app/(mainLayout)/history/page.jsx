
"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  Wallet,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
);

// Sample History Data
// Later replace with Backend API response
const initialHistory = [
  {
    _id: "1",
    month: "ডিসেম্বর",
    year: 2025,
    date: "2025-12-05",
    amount: 1500,
    status: "verified",
    paymentMethod: "bkash",
    transactionId: "TRX123456",
  },
  {
    _id: "2",
    month: "নভেম্বর",
    year: 2025,
    date: "2025-11-05",
    amount: 1000,
    status: "verified",
    paymentMethod: "nagad",
    transactionId: "TRX123457",
  },
  {
    _id: "3",
    month: "অক্টোবর",
    year: 2025,
    date: "2025-10-05",
    amount: 1000,
    status: "verified",
    paymentMethod: "bkash",
    transactionId: "TRX123458",
  },
  {
    _id: "4",
    month: "সেপ্টেম্বর",
    year: 2025,
    date: "2025-09-05",
    amount: 1000,
    status: "verified",
    paymentMethod: "rocket",
    transactionId: "TRX123459",
  },
  {
    _id: "5",
    month: "আগস্ট",
    year: 2025,
    date: "2025-08-05",
    amount: 2000,
    status: "verified",
    paymentMethod: "bkash",
    transactionId: "TRX123460",
  },
];

// Sample Monthly Summary
const monthlySummary = [
  { month: "Aug", amount: 8000 },
  { month: "Sep", amount: 10000 },
  { month: "Oct", amount: 12000 },
  { month: "Nov", amount: 7500 },
  { month: "Dec", amount: 8000 },
];

const statusConfig = {
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-600",
  },
  pending: {
    label: "Pending",
    icon: Clock3,
    className: "bg-amber-100 text-amber-600",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-100 text-red-600",
  },
};

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-US").format(amount);

// Chart.js Configuration
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
    },

    tooltip: {
      enabled: true,
      displayColors: false,
      backgroundColor: "#172b4d",
      padding: 10,
      callbacks: {
        label: (context) => `৳${formatAmount(context.raw)}`,
      },
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: "#64748b",
        font: {
          size: 10,
          weight: "600",
        },
      },
    },

    y: {
      display: false,
      beginAtZero: true,
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
    },
  },

  layout: {
    padding: {
      top: 8,
    },
  },
};

const HistoryPage = () => {
  const [history] = useState(initialHistory);

  // Later get from Backend API
  const totalDeposited = 45500;

  const chartData = {
    labels: monthlySummary.map((item) => item.month),

    datasets: [
      {
        data: monthlySummary.map((item) => item.amount),

        backgroundColor: [
          "#35d86a",
          "#16c6df",
          "#ffae16",
          "#a344ed",
          "#1674f5",
        ],

        borderRadius: {
          topLeft: 5,
          topRight: 5,
        },

        borderSkipped: false,

        barThickness: 14,

        maxBarThickness: 32,
      },
    ],
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#f7f8fc] px-3 pt-2 pb-3 text-[#172b4d]">

      {/* Header */}
      <header className="flex h-10 shrink-0 items-center gap-3">

        <button type="button" className="text-slate-700">
          <ArrowLeft size={22} />
        </button>


      </header>

      {/* History List */}
      <section className="shrink-0 space-y-2">

        {history.map((item) => {
          const status =
            statusConfig[item.status] || statusConfig.pending;

          const StatusIcon = status.icon;

          return (
            <div
              key={item._id}
              className="flex min-h-[43px] items-center gap-2 rounded-xl border border-[#e2e8f2] bg-white px-3 py-1.5"
            >

              <CalendarDays
                size={17}
                className="shrink-0 text-blue-800"
              />

              <div className="min-w-0 flex-1">

                <p className="text-[11px] font-bold text-slate-800">
                  {item.month}
                </p>

                <p className="text-[15px] font-medium text-slate-500">
                  {item.year}
                </p>

              </div>

              <p className="shrink-0 text-[20px] font-bold text-green-600">
                ৳{formatAmount(item.amount)}
              </p>

              <div
                className={`flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-[9px] font-bold ${status.className}`}
              >

                <StatusIcon size={11} />

                {status.label}

              </div>

            </div>
          );
        })}

      </section>

      {/* Total Deposited */}
      <section className="mt-2 flex h-[70px] shrink-0 items-center justify-between rounded-xl bg-gradient-to-r from-[#fff0cc] to-[#fff5dc] px-4">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/70">
          <Wallet size={27} className="text-amber-500" />
        </div>

        <div className="flex-1 pl-3">

          <p className="text-[11px] font-semibold text-slate-600">
            মোট জমা (এ পর্যন্ত)
          </p>

          <h2 className="text-[22px] font-extrabold leading-tight text-slate-800">
            ৳{formatAmount(totalDeposited)}
          </h2>

        </div>

      </section>

      {/* Monthly Chart */}
      <section className="mt-3 flex min-h-0 flex-1 flex-col rounded-xl bg-white px-3 pt-3 pb-2">

        <div className="mb-2 flex shrink-0 items-center justify-between">

          <h3 className="text-[12px] font-bold text-slate-700">
            মাসিক জমার পরিসংখ্যান
          </h3>

          <span className="text-[10px] font-semibold text-slate-400">
            ২০২৫
          </span>

        </div>

        {/* Chart.js */}
        <div className="min-h-0 flex-1">
          <Bar
            data={chartData}
            options={chartOptions}
          />
        </div>

        <p className="shrink-0 pt-2 text-center text-[9px] text-slate-400">
          প্রতি মাসের জমার পরিমাণ
        </p>

      </section>

    </div>
  );
};

export default HistoryPage;
