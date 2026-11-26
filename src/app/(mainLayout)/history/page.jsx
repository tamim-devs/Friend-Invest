
"use client";

import { useEffect, useMemo, useState } from "react";
import {
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
import { getMyDeposits } from "@/lib/api/deposits";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
);

const CURRENT_YEAR = new Date().getFullYear();

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

const getDepositDate = (item) => {
  const value = item.depositDate || item.createdAt;
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
};

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
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    getMyDeposits(100)
      .then((result) => {
        if (active) setHistory(result.deposits || []);
      })
      .catch((error) => {
        if (active) setLoadError(error.message || "জমার ইতিহাস লোড করা যায়নি।");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const totalDeposited = history
    .filter((item) => item.status === "verified")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const monthlySummary = useMemo(() => {
    const totals = Array(12).fill(0);

    history.forEach((item) => {
      if (item.status !== "verified") return;
      const date = getDepositDate(item);
      if (!Number.isNaN(date.getTime()) && date.getFullYear() === CURRENT_YEAR) {
        totals[date.getMonth()] += Number(item.amount || 0);
      }
    });

    return totals.map((amount, index) => ({
      month: new Intl.DateTimeFormat("bn-BD", { month: "short" }).format(
        new Date(CURRENT_YEAR, index, 1)
      ),
      amount,
    }));
  }, [history]);

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

      </header>

      {/* History List */}
      <section className="shrink-0 space-y-2">

        {loadError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-600">
            {loadError}
          </p>
        )}

        {isLoading && (
          <p className="py-4 text-center text-xs text-slate-500">ইতিহাস লোড হচ্ছে...</p>
        )}

        {!isLoading && !loadError && history.length === 0 && (
          <p className="py-4 text-center text-xs text-slate-500">এখনও কোনো জমার তথ্য নেই।</p>
        )}

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
                  {getDepositDate(item).toLocaleDateString("bn-BD", { month: "long" })}
                </p>

                <p className="text-[15px] font-medium text-slate-500">
                  {getDepositDate(item).getFullYear()}
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
            {CURRENT_YEAR}
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
