
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  CheckCircle2,
  UserX,
  Wallet,
  Eye,
  X,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Power,
  UserRound,
  RefreshCw,
} from "lucide-react";
import { createMember, getAllMembers, updateMemberStatus } from "@/lib/api/members";

// Helpers
const formatMoney = (amount) =>
  `৳${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const Page = () => {
  const [members, setMembers] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [savingMember, setSavingMember] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    let active = true;

    getAllMembers("", 100)
      .then((result) => {
        if (active) setMembers(result.members || []);
      })
      .catch((error) => {
        if (active) setLoadError(error.message || "সদস্যদের তথ্য লোড করা যায়নি।");
      });

    return () => {
      active = false;
    };
  }, []);

  // Statistics
  const activeMembers = members.filter(
    (member) => member.status === "active"
  );

  const inactiveMembers = members.filter(
    (member) => member.status === "inactive"
  );

  const totalDeposit = members.reduce(
    (total, member) => total + Number(member.totalDeposit || 0),
    0
  );

  // Search & Filter
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
      member.name?.toLowerCase().includes(search.toLowerCase()) ||
      member.memberId?.toLowerCase().includes(search.toLowerCase()) ||
      member.phone?.includes(search);

      const matchesTab =
        activeTab === "all" ||
        member.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [members, search, activeTab]);

  const handleAddMember = async (e) => {
    e.preventDefault();

    try {
      setSavingMember(true);
      setLoadError("");
      const result = await createMember(formData);
      if (!result.member) throw new Error("সদস্য তৈরি হয়েছে, কিন্তু response-এ তথ্য নেই।");
      setMembers((prev) => [result.member, ...prev]);
      setActiveTab("all");
      setSearch("");
      setFormData({ name: "", phone: "", email: "", address: "" });
      setShowAddModal(false);
    } catch (error) {
      setLoadError(error.message || "সদস্য যুক্ত করা যায়নি।");
    } finally {
      setSavingMember(false);
    }
  };

  const handleToggleStatus = async (memberId) => {
    const updatedMember = members.find(
      (member) => member._id === memberId
    );

    if (!updatedMember) return;

    const nextStatus =
      updatedMember.status === "active"
        ? "inactive"
        : "active";

    try {
      setLoadError("");
      await updateMemberStatus(memberId, nextStatus);
      setMembers((prev) =>
        prev.map((member) =>
          member._id === memberId ? { ...member, status: nextStatus } : member
        )
      );
      setSelectedMember((prev) =>
        prev?._id === memberId ? { ...prev, status: nextStatus } : prev
      );
    } catch (error) {
      setLoadError(error.message || "সদস্যের status পরিবর্তন করা যায়নি।");
    }
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
              সদস্য ব্যবস্থাপনা
            </h1>

            <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
              সকল সদস্যের তথ্য ও কার্যক্রম পরিচালনা করুন
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              aria-label="সদস্য তালিকা রিফ্রেশ করুন"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#073e6c] px-3 py-2.5 text-[10px] font-bold text-white shadow-sm transition hover:bg-blue-800 sm:px-4 sm:py-3 sm:text-xs"
            >
              <UserPlus size={16} />
              নতুন সদস্য
            </button>
          </div>

        </header>

        {loadError && (
          <p role="alert" className="shrink-0 rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-600">
            {loadError}
          </p>
        )}

        {/* Statistics */}
        <section className="grid shrink-0 grid-cols-3 gap-2 sm:gap-3">

          <div className="rounded-xl border border-blue-100 bg-white p-2.5 shadow-sm sm:rounded-2xl sm:p-4">
            <Users size={19} className="text-blue-600" />

            <p className="mt-2 text-[10px] text-slate-500 sm:text-xs">
              মোট সদস্য
            </p>

            <h3 className="mt-1 text-lg font-extrabold sm:text-2xl">
              {members.length}
            </h3>

            <p className="text-[9px] text-slate-400">
              জন সদস্য
            </p>
          </div>

          <div className="rounded-xl border border-green-100 bg-white p-2.5 shadow-sm sm:rounded-2xl sm:p-4">
            <CheckCircle2 size={19} className="text-green-600" />

            <p className="mt-2 text-[10px] text-slate-500 sm:text-xs">
              Active সদস্য
            </p>

            <h3 className="mt-1 text-lg font-extrabold text-green-600 sm:text-2xl">
              {activeMembers.length}
            </h3>

            <p className="text-[9px] text-slate-400">
              সক্রিয়
            </p>
          </div>

          <div className="rounded-xl border border-red-100 bg-white p-2.5 shadow-sm sm:rounded-2xl sm:p-4">
            <UserX size={19} className="text-red-500" />

            <p className="mt-2 text-[10px] text-slate-500 sm:text-xs">
              Inactive সদস্য
            </p>

            <h3 className="mt-1 text-lg font-extrabold text-red-500 sm:text-2xl">
              {inactiveMembers.length}
            </h3>

            <p className="text-[9px] text-slate-400">
              নিষ্ক্রিয়
            </p>
          </div>

        </section>

        {/* Total Deposit */}
        <section className="flex shrink-0 items-center justify-between rounded-xl bg-gradient-to-r from-[#073e6c] to-[#1264a3] p-3 text-white shadow-sm sm:rounded-2xl sm:p-4">

          <div>
            <p className="text-[10px] text-blue-100 sm:text-xs">
              সকল সদস্যের মোট জমা
            </p>

            <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
              {formatMoney(totalDeposit)}
            </h2>
          </div>

          <div className="rounded-xl bg-white/15 p-2.5">
            <Wallet size={23} />
          </div>

        </section>

        {/* Search */}
        <section className="shrink-0 space-y-2">

          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="সদস্যের নাম, Member ID বা ফোন নম্বর..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-xs outline-none transition focus:border-blue-400 sm:text-sm"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2">

            {[
              { value: "all", label: "সকল", count: members.length },
              { value: "active", label: "Active", count: activeMembers.length },
              { value: "inactive", label: "Inactive", count: inactiveMembers.length },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 rounded-lg py-2 text-[10px] font-bold transition sm:text-xs ${
                  activeTab === tab.value
                    ? "bg-[#073e6c] text-white"
                    : "border border-slate-200 bg-white text-slate-500"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}

          </div>

        </section>

        {/* Member List */}
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-3 py-3 sm:px-5">

            <div>
              <h2 className="text-sm font-extrabold">
                সদস্যদের তালিকা
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                {filteredMembers.length} জন সদস্য পাওয়া গেছে
              </p>
            </div>

            <Users size={19} className="text-blue-600" />

          </div>

          <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

            {filteredMembers.length > 0 ? (

              <div className="divide-y divide-slate-100">

                {filteredMembers.map((member) => (

                  <div
                    key={member._id}
                    className="flex items-center justify-between gap-2 px-3 py-3 transition hover:bg-slate-50 sm:px-5 sm:py-4"
                  >

                    <div className="flex min-w-0 items-center gap-2.5">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-700">
                        {member.name?.charAt(0) || "?"}
                      </div>

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="truncate text-xs font-extrabold sm:text-sm">
                            {member.name}
                          </h3>

                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                              member.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {member.status === "active"
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {member.memberId}
                        </p>

                        <p className="mt-0.5 text-[10px] font-semibold text-slate-600">
                          {formatMoney(member.totalDeposit)}
                        </p>

                      </div>

                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {member.status !== "active" && (
                        <button
                          onClick={() => handleToggleStatus(member._id)}
                          className="flex items-center gap-1 rounded-lg bg-green-600 px-2 py-2 text-[9px] font-bold text-white transition hover:bg-green-700"
                        >
                          <ShieldCheck size={13} />
                          সক্রিয় করুন
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="flex items-center gap-1 rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-2 text-[10px] font-bold text-blue-700 transition hover:bg-blue-100 sm:px-3"
                      >
                        <Eye size={14} />
                        বিস্তারিত
                      </button>
                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <div className="flex h-full flex-col items-center justify-center p-5 text-center">

                <UserRound size={35} className="text-slate-300" />

                <h3 className="mt-3 text-sm font-bold text-slate-600">
                  কোনো সদস্য পাওয়া যায়নি
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  অন্য নাম অথবা Member ID দিয়ে খুঁজুন।
                </p>

              </div>

            )}

          </div>

        </section>

      </div>

      {/* Member Details Modal */}
      {selectedMember && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedMember(null)}
        >

          <div
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-base font-extrabold">
                সদস্যের বিস্তারিত
              </h2>

              <button
                onClick={() => setSelectedMember(null)}
                className="rounded-lg bg-slate-100 p-2 text-slate-500"
              >
                <X size={17} />
              </button>

            </div>

            {/* Profile */}
            <div className="mb-5 flex flex-col items-center rounded-xl bg-blue-50 p-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-extrabold text-blue-700">
                {selectedMember.name?.charAt(0) || "?"}
              </div>

              <h3 className="mt-2 text-base font-extrabold">
                {selectedMember.name}
              </h3>

              <p className="mt-0.5 text-xs font-semibold text-blue-600">
                {selectedMember.memberId}
              </p>

              <span
                className={`mt-2 rounded-full px-3 py-1 text-[10px] font-bold ${
                  selectedMember.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {selectedMember.status === "active"
                  ? "Active Member"
                  : "Inactive Member"}
              </span>

            </div>

            {/* Deposit */}
            <div className="mb-4 rounded-xl bg-green-50 p-3 text-center">

              <p className="text-xs text-slate-500">
                সর্বমোট জমা
              </p>

              <h3 className="mt-1 text-xl font-extrabold text-green-700">
                {formatMoney(selectedMember.totalDeposit)}
              </h3>

            </div>

            {/* Information */}
            <div className="space-y-3">

              {[
                {
                  label: "মোবাইল নম্বর",
                  value: selectedMember.phone,
                  icon: Phone,
                },
                {
                  label: "ইমেইল",
                  value: selectedMember.email,
                  icon: Mail,
                },
                {
                  label: "ঠিকানা",
                  value: selectedMember.address,
                  icon: MapPin,
                },
                {
                  label: "যোগদানের তারিখ",
                  value: selectedMember.createdAt
                    ? formatDate(selectedMember.createdAt)
                    : "—",
                  icon: CalendarDays,
                },
              ].map(({ label, value, icon: Icon }) => (

                <div
                  key={label}
                  className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2"
                >

                  <div className="flex items-center gap-2 text-slate-500">
                    <Icon size={15} />
                    <p className="text-xs">{label}</p>
                  </div>

                  <p className="max-w-[55%] break-all text-right text-xs font-bold">
                    {value}
                  </p>

                </div>

              ))}

            </div>

            {/* Status Action */}
            <button
              onClick={() => handleToggleStatus(selectedMember._id)}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition ${
                selectedMember.status === "active"
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >

              {selectedMember.status === "active" ? (
                <>
                  <Power size={16} />
                  সদস্য Inactive করুন
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  সদস্য Active করুন
                </>
              )}

            </button>

          </div>

        </div>

      )}

      {/* Add Member Modal */}
      {showAddModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >

          <form
            onSubmit={handleAddMember}
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="text-base font-extrabold">
                  নতুন সদস্য যুক্ত করুন
                </h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  সদস্যের প্রয়োজনীয় তথ্য প্রদান করুন
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg bg-slate-100 p-2 text-slate-500"
              >
                <X size={17} />
              </button>

            </div>

            <div className="space-y-3">

              {[
                {
                  label: "সদস্যের নাম",
                  name: "name",
                  placeholder: "সম্পূর্ণ নাম",
                  type: "text",
                },
                {
                  label: "মোবাইল নম্বর",
                  name: "phone",
                  placeholder: "01XXXXXXXXX",
                  type: "tel",
                },
                {
                  label: "ইমেইল",
                  name: "email",
                  placeholder: "example@gmail.com",
                  type: "email",
                },
                {
                  label: "ঠিকানা",
                  name: "address",
                  placeholder: "বর্তমান ঠিকানা",
                  type: "text",
                },
              ].map((field) => (

                <div key={field.name}>

                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    {field.label}
                  </label>

                  <input
                    type={field.type}
                    required
                    min={field.type === "number" ? "1" : undefined}
                    value={formData[field.name]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field.name]: e.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-xs outline-none transition focus:border-blue-400"
                  />

                </div>

              ))}

            </div>

            <button
              type="submit"
              disabled={savingMember}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#073e6c] py-3 text-xs font-bold text-white transition hover:bg-blue-800"
            >
              <UserPlus size={16} />
              {savingMember ? "যুক্ত করা হচ্ছে..." : "সদস্য যুক্ত করুন"}
            </button>

          </form>

        </div>

      )}

    </main>
  );
};

export default Page;
