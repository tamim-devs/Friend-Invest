
"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Wallet,
  CheckCircle2,
  Upload,
  ImagePlus,
  Coins,
  Smartphone,
  Hash,
} from "lucide-react";
import { createDeposit } from "@/lib/api/deposits";

const paymentMethods = [
  { id: "bKash", name: "bKash", color: "#e2136e", bg: "#fff0f6" },
  { id: "nagad", name: "Nagad", color: "#f28c00", bg: "#fff6e8" },
  { id: "rocket", name: "Rocket", color: "#8b2bbd", bg: "#f7efff" },
];

const Page = () => {
  const [formData, setFormData] = useState({
    paymentMethod: "bKash",
    depositDate: new Date().toLocaleDateString("en-CA"),
    amount: "1000",
    phone: "",
    transactionId: "",
  });

  const [screenshot, setScreenshot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!screenshot) {
      alert("পেমেন্টের স্ক্রিনশট আপলোড করুন");
      return;
    }

    try {
      setIsSubmitting(true);

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      data.append("screenshot", screenshot);

      await createDeposit(data);
      alert("আপনার জমার আবেদন সফলভাবে পাঠানো হয়েছে।");
      setScreenshot(null);

    } catch (error) {
      console.error("Deposit Error:", error);
      alert("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#f7f8fc] px-3 pt-2 pb-3 text-[#172b4d]">

      {/* Header */}
      <header className="flex h-9 shrink-0 items-center gap-3">
     

       
      </header>

      {/* Hero */}
      <section className="flex min-h-0 flex-1 flex-col items-center justify-center">

        <div className="relative flex h-[104px] w-[150px] items-center justify-center">

          <div className="absolute top-1 text-3xl text-yellow-400">
            ✦
          </div>

          <div className="relative flex h-[75px] w-[105px] -rotate-6 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2784ff] to-[#0753c7] shadow-lg shadow-blue-200">

            <Wallet size={55} className="text-white" strokeWidth={1.7} />

            <div className="absolute -top-5 right-2 flex gap-1">
              <Coins size={28} className="text-yellow-400" />
              <Coins size={23} className="text-amber-400" />
            </div>

          </div>

          <div className="absolute right-3 bottom-1 flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
            <CheckCircle2 size={30} fill="white" className="text-green-500" />
          </div>

        </div>

        <h2 className="mt-1 text-[15px] font-bold">
          আপনার জমার তথ্য দিন
        </h2>

      </section>

      {/* Deposit Form */}
      <form onSubmit={handleSubmit} className="shrink-0 space-y-2">

        {/* Deposit Date */}
        <div className="flex h-[43px] items-center gap-2 rounded-xl border border-[#dce4f1] bg-white px-3">

          <CalendarDays size={18} className="shrink-0 text-green-600" />

          <div className="min-w-0 flex-1">

            <label className="block text-[10px] font-medium text-slate-500">
              জমার তারিখ
            </label>

            <input
              type="date"
              name="depositDate"
              value={formData.depositDate}
              onChange={handleChange}
              required
              className="w-full bg-transparent text-[12px] font-semibold outline-none"
            />

          </div>

        </div>

        {/* Amount */}
        <div className="flex h-[43px] items-center gap-2 rounded-xl border border-[#dce4f1] bg-white px-3">

          <Coins size={18} className="shrink-0 text-green-600" />

          <div className="min-w-0 flex-1">

            <label className="block text-[10px] font-medium text-slate-500">
              জমার পরিমাণ (৳)
            </label>

            <input
              type="number"
              name="amount"
              min="1"
              value={formData.amount}
              onChange={handleChange}
              required
              placeholder="টাকার পরিমাণ লিখুন"
              className="w-full bg-transparent text-[12px] font-semibold outline-none"
            />

          </div>

        </div>

        {/* Payment Method */}
        <div>

          <p className="mb-1.5 text-[12px] font-bold text-slate-700">
            পেমেন্ট পদ্ধতি নির্বাচন করুন
          </p>

          <div className="grid grid-cols-3 gap-2">

            {paymentMethods.map((item) => (

              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentMethod: item.id,
                  }))
                }
                style={{
                  backgroundColor:
                    formData.paymentMethod === item.id
                      ? item.bg
                      : "white",
                  borderColor:
                    formData.paymentMethod === item.id
                      ? item.color
                      : "#e2e8f0",
                }}
                className="flex h-[48px] flex-col items-center justify-center rounded-xl border transition-all"
              >

                <Wallet
                  size={19}
                  style={{ color: item.color }}
                />

                <span
                  className="text-[11px] font-bold"
                  style={{ color: item.color }}
                >
                  {item.name}
                </span>

              </button>

            ))}

          </div>

        </div>

        {/* Phone Number */}
        <div className="flex h-[45px] items-center gap-2 rounded-xl border border-[#dce4f1] bg-white px-3">

          <Smartphone size={18} className="shrink-0 text-green-600" />

          <div className="min-w-0 flex-1">

            <label className="block text-[10px] font-medium text-slate-500">
              যে নম্বর থেকে পাঠিয়েছেন
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="01XXXXXXXXX"
              pattern="01[0-9]{9}"
              className="w-full bg-transparent text-[12px] font-semibold outline-none"
            />

          </div>

        </div>

        {/* Transaction ID */}
        <div className="flex h-[45px] items-center gap-2 rounded-xl border border-[#dce4f1] bg-white px-3">

          <Hash size={18} className="shrink-0 text-green-600" />

          <div className="min-w-0 flex-1">

            <label className="block text-[10px] font-medium text-slate-500">
              Transaction ID (TrxID)
            </label>

            <input
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              required
              placeholder="Transaction ID লিখুন"
              className="w-full bg-transparent text-[12px] font-semibold uppercase outline-none"
            />

          </div>

        </div>

        {/* Screenshot Upload */}
        <label className="flex h-[65px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-blue-300 bg-blue-50/70">

          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={(e) =>
              setScreenshot(e.target.files?.[0] || null)
            }
          />

          {screenshot ? (
            <>
              <ImagePlus size={19} className="text-blue-600" />

              <span className="mt-1 max-w-[90%] truncate text-[10px] font-semibold text-blue-700">
                {screenshot.name}
              </span>
            </>
          ) : (
            <>
              <Upload size={19} className="text-blue-600" />

              <span className="mt-1 text-[10px] font-semibold text-slate-600">
                স্ক্রিনশট আপলোড করুন
              </span>

              <span className="text-[9px] text-slate-400">
                JPG, PNG, WEBP
              </span>
            </>
          )}

        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-[43px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-[14px] font-bold text-white shadow-md shadow-green-100 transition active:scale-[0.98] disabled:opacity-60"
        >

          {isSubmitting ? "অপেক্ষা করুন..." : "জমা দিন"}

          {!isSubmitting && <CheckCircle2 size={18} />}

        </button>

      </form>

    </div>
  );
};

export default Page;
