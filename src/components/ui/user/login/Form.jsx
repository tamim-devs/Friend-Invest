
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const Form = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setError("ইমেইল এবং পাসওয়ার্ড দিন।");
      return;
    }

    try {
      setLoading(true);

      const { error: loginError } = await authClient.signIn.email({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message || "ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে।");
        return;
      }

      const { data: session, error: sessionError } =
        await authClient.getSession();

      if (sessionError || !session?.user) {
        setError("ইউজারের তথ্য পাওয়া যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      const role = session.user.role;

      if (role === "main_admin") {
        router.replace("/dashboard/main-admin");
      } else if (role === "user") {
        router.replace("/");
      } else {
        setError("আপনার অ্যাকাউন্টের Role সঠিক নয়।");
        await authClient.signOut();
        return;
      }

      router.refresh();

    } catch (error) {
      setError("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-t-[35px] bg-white px-6 py-8 shadow-lg">
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#123f68]">
            ইমেইল
          </label>

          <div className="flex items-center gap-3 rounded-2xl border-2 border-blue-100 px-4 py-4 focus-within:border-blue-500">
            <Mail size={22} className="shrink-0 text-[#123f68]" />
            <input
              name="email"
              type="email"
              required
              placeholder="example@gmail.com"
              className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#123f68]">
            পাসওয়ার্ড
          </label>

          <div className="flex items-center gap-3 rounded-2xl border-2 border-blue-100 px-4 py-4 focus-within:border-blue-500">
            <Lock size={22} className="shrink-0 text-[#123f68]" />

            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="আপনার পাসওয়ার্ড দিন"
              className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="shrink-0 text-gray-500"
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-gray-700">
            <input
              name="remember"
              type="checkbox"
              className="size-4 accent-blue-600"
            />
            আমাকে মনে রাখুন
          </label>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#073e6c] py-4 text-lg font-bold text-white shadow-lg transition hover:bg-[#062f52] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
          {!loading && <ArrowRight size={23} />}
        </button>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-blue-200" />
          <span className="text-sm font-medium text-gray-500">অথবা</span>
          <div className="h-px flex-1 bg-blue-200" />
        </div>

        <p className="pt-2 text-center text-sm text-gray-700">
          এখনো অ্যাকাউন্ট নেই?
          <Link href="/signup" className="ml-2 font-bold text-blue-700">
            সাইন আপ করুন
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Form;
