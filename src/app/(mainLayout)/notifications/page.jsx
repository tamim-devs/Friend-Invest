
"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Info,
  Award,
  Bell,
  Megaphone,
} from "lucide-react";
import { getNotifications, markNotificationAsRead } from "@/lib/api/notifications";

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
  const [notifications, setNotifications] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getNotifications()
      .then((result) => {
        if (!active || !result?.notifications) return;

        setNotifications(result.notifications.map((item) => ({
          ...item,
          isRead: Boolean(item.read),
          createdAt: item.createdAt,
        })));
      })
      .catch((error) => {
        if (active) setLoadError(error.message || "নোটিফিকেশন লোড করা যায়নি।");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const activeNotifications = notifications;

  const unreadCount = activeNotifications.filter(
    (item) => !item.isRead
  ).length;

  const handleNotificationClick = async (id) => {
    try {
      await markNotificationAsRead(id);
    } catch (error) {
      setLoadError(error.message || "নোটিফিকেশন পড়া হয়েছে হিসেবে চিহ্নিত করা যায়নি।");
      return;
    }

    setNotifications((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, isRead: true }
          : item
      )
    );

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
        {loadError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-600">
            {loadError}
          </p>
        )}

        {isLoading ? (
          <p className="py-8 text-center text-xs text-slate-500">নোটিফিকেশন লোড হচ্ছে...</p>
        ) : activeNotifications.length > 0 ? (
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

      </section>

    </div>
  );
};

export default NotificationsPage;
