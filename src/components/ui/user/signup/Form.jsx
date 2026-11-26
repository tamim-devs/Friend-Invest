
"use client";

import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api/api";
import { useRouter } from "next/navigation";

const Form = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const terms = formData.get("terms");

    if (!name || !phone || !email || !password || !confirmPassword) {
      return setError("সবগুলো তথ্য পূরণ করুন।");
    }

    if (password !== confirmPassword) {
      return setError("পাসওয়ার্ড দুটি মিলছে না।");
    }

    if (!terms) {
      return setError("শর্তাবলি মেনে নিতে হবে।");
    }

    if (password.length < 8) {
      return setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
    }

    try {
      setLoading(true);

      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        phone,
      });

      if (error) {
        setError(error.message || "Registration ব্যর্থ হয়েছে।");
        return;
      }

      try {
        await apiRequest("/members/register", { method: "POST" });
      } catch (registrationError) {
        setError(
          `অ্যাকাউন্ট তৈরি হয়েছে, কিন্তু সদস্য আবেদন জমা হয়নি। ${registrationError.message}`
        );
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-0 flex-1 overflow-hidden rounded-t-[28px] bg-white px-5 py-2.5 sm:px-6 sm:py-4">
      <form
        onSubmit={handleSignup}
        className="flex h-full flex-col justify-evenly gap-1.5"
      >
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-gray-700 sm:text-xs">
            আপনার নাম
          </label>
          <div className="flex h-9 items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3 focus-within:border-[#073e6c]">
            <User size={17} className="shrink-0 text-[#123f68]" />
            <input
              name="name"
              type="text"
              required
              placeholder="আপনার সম্পূর্ণ নাম"
              className="w-full bg-transparent text-xs outline-none placeholder:text-gray-400 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-gray-700 sm:text-xs">
            মোবাইল নাম্বার
          </label>
          <div className="flex h-9 items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3 focus-within:border-[#073e6c]">
            <Phone size={17} className="shrink-0 text-[#123f68]" />
            <input
              name="phone"
              type="tel"
              required
              placeholder="01XXXXXXXXX"
              className="w-full bg-transparent text-xs outline-none placeholder:text-gray-400 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-gray-700 sm:text-xs">
            ইমেইল
          </label>
          <div className="flex h-9 items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3 focus-within:border-[#073e6c]">
            <Mail size={17} className="shrink-0 text-[#123f68]" />
            <input
              name="email"
              type="email"
              required
              placeholder="example@gmail.com"
              className="w-full bg-transparent text-xs outline-none placeholder:text-gray-400 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-gray-700 sm:text-xs">
            পাসওয়ার্ড
          </label>
          <div className="flex h-9 items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3 focus-within:border-[#073e6c]">
            <Lock size={17} className="shrink-0 text-[#123f68]" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="পাসওয়ার্ড তৈরি করুন"
              className="w-full bg-transparent text-xs outline-none placeholder:text-gray-400 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="shrink-0 text-gray-400"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-gray-700 sm:text-xs">
            পাসওয়ার্ড নিশ্চিত করুন
          </label>
          <div className="flex h-9 items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3 focus-within:border-[#073e6c]">
            <Lock size={17} className="shrink-0 text-[#123f68]" />
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="আবার পাসওয়ার্ড দিন"
              className="w-full bg-transparent text-xs outline-none placeholder:text-gray-400 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="shrink-0 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-1.5 text-[10px] leading-4 text-gray-500">
          <input
            name="terms"
            type="checkbox"
            className="mt-0.5 size-3.5 shrink-0 accent-[#073e6c]"
          />
          <span>
            আমি আপনাদের
            <a href="/terms" className="mx-1 font-semibold text-[#073e6c]">
              শর্তাবলি
            </a>
            এবং
            <a href="/privacy" className="ml-1 font-semibold text-[#073e6c]">
              গোপনীয়তা নীতি
            </a>
            মেনে নিচ্ছি।
          </span>
        </label>

        {error && (
          <p className="text-center text-xs text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#073e6c] text-sm font-bold text-white shadow-md transition hover:bg-[#062f52] disabled:opacity-60"
        >
          {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          {!loading && <ArrowRight size={17} />}
        </button>

        <p className="shrink-0 pb-1 text-center text-[11px] text-gray-600">
          আগে থেকেই অ্যাকাউন্ট আছে?
          <a href="/login" className="ml-1 font-bold text-[#073e6c]">
            লগইন করুন
          </a>
        </p>
      </form>
    </div>
  );
};

export default Form;
