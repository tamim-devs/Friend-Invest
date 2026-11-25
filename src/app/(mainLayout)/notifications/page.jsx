
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Info,
  Award,
  Bell,
  Megaphone,
  Wallet,
  ArrowRight,
} from "lucide-react";

// Demo Data
const initialNotifications = [
  {
    _id: "1",
    type: "success",
    title: "আপনার জমা সফলভাবে রেকর্ড হয়েছে!",
    message: "আপনার জমা সফলভাবে অনুমোদন করা হয়েছে।",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: false,
  },
  {
    _id: "2",
    type: "info",
    title: "নতুন তথ্য এসেছে",
    message: "নতুন কিছু তথ্য জানতে আমাদের নোটিশ দেখুন।",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    isRead: false,
  },
  {
    _id: "3",
    type: "reward",
    title: "এই মাসের সেরা সদস্য নির্বাচিত!",
    message: "আপনি আমাদের সেরা সদস্যদের একজন।",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    isRead: true,
  },
  {
    _id: "4",
    type: "deposit",
    title: "আপনার মাসিক জমার পরিমাণ নির্ধারিত হয়েছে ৳1,000",
    message: "নির্ধারিত সময়ের মধ্যে আপনার মাসিক জমা সম্পন্ন করুন।",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    isRead: true,
  },
];

const notificationConfig = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
  },
  info: {
    icon: Info,
    iconColor: "text-sky-500",
    iconBg: "bg-sky-100",
  },
  reward: {
    icon: Award,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-100",
  },
  deposit: {
    icon: Megaphone,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100",
  },
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  // Demo value:
  // Backend থেকে জানতে হবে এই মাসে Verified Deposit হয়েছে কিনা।
  const [hasDepositedThisMonth] = useState(false);

  // Only show notifications from the last 7 days
  const activeNotifications = useMemo(() => {
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    return notifications.filter((item) => {
      const createdAt = new Date(item.createdAt).getTime();

      return (
        !Number.isNaN(createdAt) &&
        now - createdAt < sevenDays &&
        createdAt <= now
      );
    });
  }, [notifications]);

  const unreadCount = activeNotifications.filter(
    (item) => !item.isRead
  ).length;

  const handleNotificationClick = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, isRead: true }
          : item
      )
    );

    // Backend:
    // PATCH /notifications/:id/read
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#f8f9ff] px-3 pt-2 pb-3 text-[#172b4d]">

      {/* Header */}
      <header className="flex h-10 shrink-0 items-center justify-between">

        <div className="flex items-center gap-2">
          <Bell size={20} className="text-blue-700" />

          <h1 className="text-[16px] font-bold">
            নোটিফিকেশন
          </h1>
        </div>

        {unreadCount > 0 && (
          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-700">
            {unreadCount} টি নতুন
          </span>
        )}

      </header>

      {/* Notification List */}
      <section className="min-h-0 flex-1 space-y-2 overflow-y-auto py-1">

        {activeNotifications.length > 0 ? (
          activeNotifications.map((item) => {
            const config =
              notificationConfig[item.type] ||
              notificationConfig.info;

            const Icon = config.icon;

            return (
              <button
                key={item._id}
                type="button"
                onClick={() => handleNotificationClick(item._id)}
                className={`flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left ${
                  item.isRead
                    ? "border-slate-100 bg-white"
                    : "border-blue-100 bg-white shadow-sm"
                }`}
              >

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}
                >
                  <Icon
                    size={21}
                    className={config.iconColor}
                  />
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex items-start justify-between gap-1">

                    <h2 className="text-[11px] font-bold leading-[17px] text-slate-800">
                      {item.title}
                    </h2>

                    {!item.isRead && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}

                  </div>

                  <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
                    {item.message}
                  </p>

                  <p className="mt-1 text-[9px] font-medium text-slate-400">
                    {formatDate(item.createdAt)}
                  </p>

                </div>

              </button>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell size={35} className="text-slate-300" />

            <p className="mt-2 text-[12px] font-semibold text-slate-500">
              নতুন কোনো নোটিফিকেশন নেই
            </p>
          </div>
        )}

        {/* Deposit Reminder */}
        {!hasDepositedThisMonth && (
          <div className="rounded-xl border border-green-100 bg-green-50 p-3">

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                <Wallet size={20} className="text-green-600" />
              </div>

              <div className="flex-1">
                <h2 className="text-[12px] font-bold text-green-800">
                  আপনার মাসিক জমা সম্পন্ন করুন।
                </h2>

            
              </div>
            </div>

            <Link
              href="/deposit"
              className="mt-3 flex h-9 items-center justify-center gap-2 rounded-lg bg-green-600 text-[11px] font-bold text-white"
            >
              এখনই জমা দিন
              <ArrowRight size={15} />
            </Link>

          </div>
        )}

      </section>

      {/* Promotional Banner */}
      <section className="relative mt-2 flex h-[145px] shrink-0 flex-col items-center justify-end overflow-hidden rounded-2xl bg-gradient-to-b from-[#c7f3ff] via-[#a8e8b2] to-[#65ca63]">

        <div className="absolute left-2 top-4 text-2xl">🌿</div>
        <div className="absolute right-3 top-3 text-2xl">🌿</div>
        <div className="absolute left-5 bottom-7 text-2xl">🌼</div>
        <div className="absolute right-5 bottom-8 text-2xl">🌻</div>

        <div className="relative z-10 mb-1 text-[76px] leading-[85px]">
          📣
        </div>

        <div className="relative z-20 mb-3 -rotate-2 rounded-md bg-gradient-to-r from-yellow-300 to-yellow-400 px-5 py-2 shadow-md">
          <h2 className="text-center text-[15px] font-extrabold text-green-900">
            একসাথে এগিয়ে চলি!
          </h2>
        </div>

      </section>

    </div>
  );
};

export default NotificationsPage;
