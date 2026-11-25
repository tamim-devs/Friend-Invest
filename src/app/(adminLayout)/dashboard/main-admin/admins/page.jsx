
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Wallet,
  Clock,
  CheckCircle2,
  Eye,
  Check,
  X,
  CalendarDays,
  CreditCard,
  ArrowDownLeft,
  Filter,
} from "lucide-react";

// Dummy Data
// Future Backend: GET /api/admin/deposits
const initialDeposits = [
  {
    _id: "deposit_001",
    memberId: "FB-001",
    memberName: "আবরার ফাহিম",
    amount: 2000,
    month: "নভেম্বর 2026",
    paymentMethod: "bKash",
    transactionId: "9F3A7B2C1D",
    phone: "01XXXXXXXXX",
    submittedAt: "2026-11-23",
    status: "pending",
  },
  {
    _id: "deposit_002",
    memberId: "FB-002",
    memberName: "মেহেদী হাসান",
    amount: 1500,
    month: "নভেম্বর 2026",
    paymentMethod: "Nagad",
    transactionId: "8G4B6C2D9A",
    phone: "01XXXXXXXXX",
    submittedAt: "2026-11-22",
    status: "pending",
  },
  {
    _id: "deposit_003",
    memberId: "FB-003",
    memberName: "রাফি আহমেদ",
    amount: 1000,
    month: "নভেম্বর 2026",
    paymentMethod: "Rocket",
    transactionId: "7H5C8D3E1B",
    phone: "01XXXXXXXXX",
    submittedAt: "2026-11-21",
    status: "pending",
  },
  {
    _id: "deposit_004",
    memberId: "FB-004",
    memberName: "সাকিব রহমান",
    amount: 2000,
    month: "নভেম্বর 2026",
    paymentMethod: "bKash",
    transactionId: "6J2D9E4F5C",
    phone: "01XXXXXXXXX",
    submittedAt: "2026-11-20",
    status: "approved",
  },
  {
    _id: "deposit_005",
    memberId: "FB-005",
    memberName: "নাঈম আহমেদ",
    amount: 1500,
    month: "অক্টোবর 2026",
    paymentMethod: "Nagad",
    transactionId: "5K3E7F8G2D",
    phone: "01XXXXXXXXX",
    submittedAt: "2026-10-25",
    status: "approved",
  },
];

const formatMoney = (amount) =>
  `৳${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));

const Page = () => {
  const [deposits, setDeposits] = useState(initialDeposits);
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [selectedDeposit, setSelectedDeposit] = useState(null);

  // Deposit Statistics
  const pendingDeposits = deposits.filter(
    (item) => item.status === "pending"
  );

  const approvedDeposits = deposits.filter(
    (item) => item.status === "approved"
  );

  const pendingAmount = pendingDeposits.reduce(
    (total, item) => total + item.amount,
    0
  );

  const approvedAmount = approvedDeposits.reduce(
    (total, item) => total + item.amount,
    0
  );

  // Search and Filter
  const filteredDeposits = useMemo(() => {
    return deposits.filter((item) => {
      const matchesTab = item.status === activeTab;

      const matchesSearch =
        item.memberName.toLowerCase().includes(search.toLowerCase()) ||
        item.memberId.toLowerCase().includes(search.toLowerCase()) ||
        item.transactionId.toLowerCase().includes(search.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [deposits, activeTab, search]);

  // Future Backend:
  // PATCH /api/admin/deposits/:id/approve
  const handleApprove = (depositId) => {
    setDeposits((prev) =>
      prev.map((item) =>
        item._id === depositId
          ? { ...item, status: "approved" }
          : item
      )
    );

    setSelectedDeposit(null);
  };

  // Future Backend:
  // PATCH /api/admin/deposits/:id/reject
  const handleReject = (depositId) => {
    setDeposits((prev) =>
      prev.filter((item) => item._id !== depositId)
    );

    setSelectedDeposit(null);
  };

  return (
    <main className="h-full min-h-0 overflow-hidden bg-[#f5f7fc] p-3 text-slate-800 sm:p-5">

      <div className="mx-auto flex h-full max-w-7xl flex-col gap-3 sm:gap-5">

        {/* Header */}
        <header className="flex shrink-0 items-center justify-between">
          <div>
            <p className="text-[10px] font-medium text-slate-400 sm:text-xs">
              Friends Dream Builders / Admin
            </p>

            <h1 className="mt-1 text-lg font-extrabold sm:text-2xl">
              জমা ব্যবস্থাপনা
            </h1>

            <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
              সদস্যদের জমার আবেদন যাচাই ও পরিচালনা করুন
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Wallet size={21} />
          </div>
        </header>

        {/* Statistics */}
        <section className="grid shrink-0 grid-cols-3 gap-2 sm:gap-3">

          <div className="rounded-xl border border-amber-100 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">
            <Clock size={19} className="text-amber-500" />

            <p className="mt-2 text-[10px] text-slate-500 sm:text-xs">
              অপেক্ষমাণ
            </p>

            <h3 className="mt-1 text-lg font-extrabold sm:text-2xl">
              {pendingDeposits.length}
            </h3>

            <p className="truncate text-[9px] font-semibold text-amber-600 sm:text-xs">
              {formatMoney(pendingAmount)}
            </p>
          </div>

          <div className="rounded-xl border border-green-100 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">
            <CheckCircle2 size={19} className="text-green-600" />

            <p className="mt-2 text-[10px] text-slate-500 sm:text-xs">
              অনুমোদিত
            </p>

            <h3 className="mt-1 text-lg font-extrabold sm:text-2xl">
              {approvedDeposits.length}
            </h3>

            <p className="truncate text-[9px] font-semibold text-green-600 sm:text-xs">
              {formatMoney(approvedAmount)}
            </p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">
            <ArrowDownLeft size={19} className="text-blue-600" />

            <p className="mt-2 text-[10px] text-slate-500 sm:text-xs">
              মোট আবেদন
            </p>

            <h3 className="mt-1 text-lg font-extrabold sm:text-2xl">
              {deposits.length}
            </h3>

            <p className="truncate text-[9px] font-semibold text-blue-600 sm:text-xs">
              সব আবেদন
            </p>
          </div>

        </section>

        {/* Tabs */}
        <section className="flex shrink-0 items-center gap-2 rounded-xl bg-white p-1.5 shadow-sm">

          <button
            onClick={() => setActiveTab("pending")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition ${
              activeTab === "pending"
                ? "bg-[#073e6c] text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Clock size={15} />
            অপেক্ষমাণ ({pendingDeposits.length})
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition ${
              activeTab === "approved"
                ? "bg-[#073e6c] text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <CheckCircle2 size={15} />
            অনুমোদিত ({approvedDeposits.length})
          </button>

        </section>

        {/* Search */}
        <div className="relative shrink-0">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="নাম, Member ID অথবা Transaction ID খুঁজুন..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-xs outline-none transition focus:border-blue-400 sm:text-sm"
          />
        </div>

        {/* Deposit List */}
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-3 py-3 sm:px-5">
            <div>
              <h2 className="text-sm font-extrabold">
                {activeTab === "pending"
                  ? "জমার আবেদন"
                  : "অনুমোদিত জমা"}
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                {filteredDeposits.length} টি আবেদন পাওয়া গেছে
              </p>
            </div>

            <Filter size={18} className="text-slate-400" />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

            {filteredDeposits.length > 0 ? (
              <div className="divide-y divide-slate-100">

                {filteredDeposits.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col gap-3 p-3 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4"
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-700">
                        {item.memberName.charAt(0)}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-xs font-extrabold sm:text-sm">
                            {item.memberName}
                          </h3>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                              item.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {item.status === "pending"
                              ? "Pending"
                              : "Approved"}
                          </span>
                        </div>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {item.memberId} · {item.month}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                          <span>{item.paymentMethod}</span>
                          <span>·</span>
                          <span>{formatDate(item.submittedAt)}</span>
                        </div>

                      </div>

                    </div>

                    <div className="flex items-center justify-between gap-2 sm:justify-end">

                      <h3 className="text-sm font-extrabold text-slate-800 sm:min-w-24 sm:text-right">
                        {formatMoney(item.amount)}
                      </h3>

                      <button
                        onClick={() => setSelectedDeposit(item)}
                        className="flex items-center justify-center gap-1 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-[10px] font-bold text-blue-700 transition hover:bg-blue-100"
                      >
                        <Eye size={14} />
                        বিস্তারিত
                      </button>

                      {item.status === "pending" && (
                        <button
                          onClick={() => handleApprove(item._id)}
                          className="flex items-center justify-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-[10px] font-bold text-white transition hover:bg-green-700"
                        >
                          <Check size={14} />
                          অনুমোদন
                        </button>
                      )}

                    </div>

                  </div>
                ))}

              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-5 text-center">
                <Wallet size={35} className="text-slate-300" />

                <h3 className="mt-3 text-sm font-bold text-slate-600">
                  কোনো আবেদন পাওয়া যায়নি
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  অন্য নাম অথবা Member ID দিয়ে খুঁজুন।
                </p>
              </div>
            )}

          </div>
        </section>

      </div>

      {/* Deposit Details Modal */}
      {selectedDeposit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedDeposit(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-extrabold">
                জমার বিস্তারিত
              </h2>

              <button
                onClick={() => setSelectedDeposit(null)}
                className="rounded-lg bg-slate-100 p-2 text-slate-500"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mb-5 rounded-xl bg-blue-50 p-4 text-center">
              <Wallet size={24} className="mx-auto text-blue-600" />

              <p className="mt-2 text-xs text-slate-500">
                জমার পরিমাণ
              </p>

              <h3 className="mt-1 text-2xl font-extrabold text-blue-700">
                {formatMoney(selectedDeposit.amount)}
              </h3>
            </div>

            <div className="space-y-3">

              {[
                ["সদস্যের নাম", selectedDeposit.memberName],
                ["Member ID", selectedDeposit.memberId],
                ["জমার মাস", selectedDeposit.month],
                ["Payment Method", selectedDeposit.paymentMethod],
                ["Transaction ID", selectedDeposit.transactionId],
                ["মোবাইল নম্বর", selectedDeposit.phone],
                ["জমার তারিখ", formatDate(selectedDeposit.submittedAt)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2"
                >
                  <p className="text-xs text-slate-500">
                    {label}
                  </p>

                  <p className="max-w-[60%] break-all text-right text-xs font-bold text-slate-800">
                    {value}
                  </p>
                </div>
              ))}

            </div>

            {selectedDeposit.status === "pending" && (
              <div className="mt-5 grid grid-cols-2 gap-2">

                <button
                  onClick={() => handleReject(selectedDeposit._id)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-3 text-xs font-bold text-red-600"
                >
                  <X size={15} />
                  বাতিল করুন
                </button>

                <button
                  onClick={() => handleApprove(selectedDeposit._id)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-xs font-bold text-white"
                >
                  <Check size={15} />
                  অনুমোদন করুন
                </button>

              </div>
            )}

            {selectedDeposit.status === "approved" && (
              <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-green-50 py-3 text-xs font-bold text-green-700">
                <CheckCircle2 size={16} />
                এই জমাটি অনুমোদিত হয়েছে
              </div>
            )}

          </div>
        </div>
      )}

    </main>
  );
};

export default Page;
