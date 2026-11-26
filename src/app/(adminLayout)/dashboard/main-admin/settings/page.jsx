"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { getSettings, updateSettings } from "@/lib/api/settings";

import {
  Building2,
  CheckCircle2,
  Landmark,
  Loader2,
  LogOut,
  Save,
  Settings,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";

const paymentMethods = [
  { key: "bkash", label: "বিকাশ", icon: Smartphone, color: "text-pink-600", bg: "bg-pink-50" },
  { key: "nagad", label: "নগদ", icon: Wallet, color: "text-orange-600", bg: "bg-orange-50" },
  { key: "rocket", label: "রকেট", icon: Landmark, color: "text-purple-600", bg: "bg-purple-50" },
];

const inputClassName =
  "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

const Page = () => {
  const router = useRouter();

  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    organizationName: "",
    targetAmount: "",
    monthlyAmount: "",
    paymentAccounts: { bkash: "", nagad: "", rocket: "" },
  });
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    getSettings()
      .then((result) => {
        if (!active) return;
        if (!result?.settings) {
          throw new Error("সেটিংসের তথ্য পাওয়া যায়নি।");
        }

        const current = result.settings;
        setSettings(current);
        setFormData({
          organizationName: current.organizationName || "",
          targetAmount: String(current.targetAmount ?? ""),
          monthlyAmount: String(current.monthlyAmount ?? ""),
          paymentAccounts: {
            bkash: current.paymentAccounts?.bkash || "",
            nagad: current.paymentAccounts?.nagad || "",
            rocket: current.paymentAccounts?.rocket || "",
          },
        });
      })
      .catch((loadError) => {
        if (active) {
          toast.error(loadError.message || "সেটিংস লোড করা যায়নি।");
        }
      })
      .finally(() => {
        if (active) setLoadingSettings(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();

    try {
      setSavingSettings(true);
      const savedSettings = {
        ...formData,
        targetAmount: Number(formData.targetAmount),
        monthlyAmount: Number(formData.monthlyAmount),
      };

      await updateSettings(savedSettings);
      setSettings((current) => ({ ...current, ...savedSettings }));
      toast.success("সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে।");
    } catch (saveError) {
      toast.error(saveError.message || "সেটিংস সংরক্ষণ করা যায়নি।");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleLogout = async () => {
    const confirmed = window.confirm(
      "আপনি কি নিশ্চিতভাবে অ্যাকাউন্ট থেকে লগআউট করতে চান?"
    );

    if (!confirmed || loggingOut) return;

    try {
      setLoggingOut(true);
      await authClient.signOut();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(error.message || "Logout করা সম্ভব হয়নি। আবার চেষ্টা করুন।");
      setLoggingOut(false);
    }
  };

  return (
    <main className="min-h-full bg-[#f5f7fc] text-slate-800">
      <header className="relative overflow-hidden rounded-b-[28px] bg-gradient-to-br from-[#073e6c] via-[#0d5688] to-[#117c83] px-5 pb-8 pt-6 text-white shadow-lg sm:rounded-3xl sm:px-7 sm:pt-7">
        <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full border-[28px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-28 right-20 h-48 w-48 rounded-full bg-cyan-300/10 blur-2xl" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner">
              <Settings size={23} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
                Admin workspace
              </p>
              <h1 className="mt-1 text-xl font-extrabold">সেটিংস</h1>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
            <ShieldCheck size={19} className="text-cyan-100" />
          </div>
        </div>

        <p className="relative mt-5 max-w-sm text-xs leading-5 text-blue-100">
          Friends Dream Builders-এর সংগঠন, সঞ্চয়ের লক্ষ্য এবং পেমেন্ট তথ্য পরিচালনা করুন।
        </p>

        <div className="relative mt-5 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0b5b79]">
            <Building2 size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-cyan-100">আপনার সংগঠন</p>
            <p className="mt-0.5 truncate text-sm font-bold">
              {settings?.organizationName || "Friends Dream Builders"}
            </p>
          </div>
          <CheckCircle2 size={17} className="ml-auto shrink-0 text-emerald-300" />
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-4 px-3 py-5 sm:px-5 sm:py-6">
        <form
          onSubmit={handleSettingsSubmit}
          className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Building2 size={19} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold">সংগঠনের তথ্য</h2>
              <p className="mt-0.5 text-[10px] text-slate-500">
                নাম ও সঞ্চয়ের লক্ষ্য হালনাগাদ করুন
              </p>
            </div>
          </div>

          {loadingSettings ? (
            <div className="flex items-center justify-center gap-2 px-4 py-12 text-xs text-slate-500">
              <Loader2 size={16} className="animate-spin" />
              সেটিংস লোড হচ্ছে...
            </div>
          ) : (
            <div className="space-y-4 p-4 sm:p-5">
              <label className="block text-xs font-bold text-slate-600">
                সংগঠনের নাম
                <input
                  type="text"
                  required
                  value={formData.organizationName}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      organizationName: event.target.value,
                    }))
                  }
                  placeholder="সংগঠনের নাম লিখুন"
                  className={inputClassName}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    name: "targetAmount",
                    label: "মোট লক্ষ্যমাত্রা",
                    hint: "সংগঠনের মোট সঞ্চয়ের লক্ষ্য",
                  },
                  {
                    name: "monthlyAmount",
                    label: "মাসিক জমা",
                    hint: "প্রতি মাসে সদস্যপ্রতি জমার পরিমাণ",
                  },
                ].map((field) => (
                  <label
                    key={field.name}
                    className="block text-xs font-bold text-slate-600"
                  >
                    {field.label}
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                        ৳
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={formData[field.name]}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            [field.name]: event.target.value,
                          }))
                        }
                        className={`${inputClassName} pl-8`}
                      />
                    </div>
                    <span className="mt-1.5 block text-[10px] font-normal text-slate-400">
                      {field.hint}
                    </span>
                  </label>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="mb-3">
                  <h3 className="text-xs font-extrabold text-slate-700">
                    পেমেন্ট অ্যাকাউন্ট
                  </h3>
                  <p className="mt-1 text-[10px] text-slate-500">
                    সদস্যদের জমার জন্য ব্যবহৃত নম্বরগুলো দিন
                  </p>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;

                    return (
                      <label
                        key={method.key}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition focus-within:border-blue-200 focus-within:bg-blue-50/30"
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${method.bg} ${method.color}`}
                        >
                          <Icon size={18} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-bold text-slate-700">
                            {method.label}
                          </span>
                          <input
                            type="tel"
                            inputMode="numeric"
                            value={formData.paymentAccounts[method.key]}
                            onChange={(event) =>
                              setFormData((current) => ({
                                ...current,
                                paymentAccounts: {
                                  ...current.paymentAccounts,
                                  [method.key]: event.target.value,
                                },
                              }))
                            }
                            placeholder="মোবাইল নম্বর"
                            className="mt-1 w-full bg-transparent text-xs font-medium text-slate-600 outline-none placeholder:text-slate-400"
                          />
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#073e6c] to-[#1264a3] py-3.5 text-xs font-extrabold text-white shadow-md shadow-blue-900/10 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingSettings ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {savingSettings ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
              </button>
            </div>
          )}
        </form>

        <section className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-xs font-extrabold text-slate-800">
              নিরাপদ অ্যাডমিন অ্যাকাউন্ট
            </h2>
            <p className="mt-1 text-[10px] leading-4 text-slate-500">
              অ্যাকাউন্টের প্রবেশাধিকার শুধু বিশ্বস্ত অ্যাডমিনদের সঙ্গে শেয়ার করুন।
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-3 rounded-2xl border border-red-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <LogOut size={18} />
            </div>
            <div>
              <h2 className="text-xs font-extrabold text-slate-800">
                অ্যাডমিন অ্যাকাউন্ট
              </h2>
              <p className="mt-1 text-[10px] text-slate-500">
                এই ডিভাইস থেকে নিরাপদে লগআউট করুন
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loggingOut ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <LogOut size={15} />
            )}
            {loggingOut ? "লগআউট হচ্ছে..." : "লগআউট"}
          </button>
        </section>

        <footer className="pb-2 pt-1 text-center">
          <p className="text-[10px] font-semibold text-slate-400">
            Friends Dream Builders · Together We Grow
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Page;
