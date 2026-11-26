
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

import {
  House,
  Wallet,
  History,
  UserRound,
  Bell,
  LayoutDashboard,
  Users,
  Settings,
  ShieldCheck,
  Receipt,
} from "lucide-react";

const userMenu = [
  { name: "হোম", icon: House, href: "/" },
  { name: "জমা", icon: Wallet, href: "/deposit" },
  { name: "হিস্ট্রি", icon: History, href: "/history" },
  { name: "প্রোফাইল", icon: UserRound, href: "/profile" },
  { name: "নোটিফিকেশন", icon: Bell, href: "/notifications" },
];

const mainAdminMenu = [
  {
    name: "ড্যাশবোর্ড",
    icon: LayoutDashboard,
    href: "/dashboard/main-admin",
  },
  {
    name: "অ্যাডমিন",
    icon: ShieldCheck,
    href: "/dashboard/main-admin/admins",
  },
  {
    name: "সদস্য",
    icon: Users,
    href: "/dashboard/main-admin/customers",
  },
  {
    name: "পেমেন্ট",
    icon: Receipt,
    href: "/dashboard/main-admin/payments",
  },
  {
    name: "সেটিংস",
    icon: Settings,
    href: "/dashboard/main-admin/settings",
  },
];

const FooterBar = ({ role: propRole }) => {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const role = propRole || session?.user?.role || "user";

  if (isPending && !propRole) return null;

  const navItems =
    role === "admin" || role === "main_admin" ? mainAdminMenu : userMenu;

  return (
    <footer className="w-full shrink-0 border-t border-gray-100 bg-white">
      <nav className="mx-auto flex w-full items-center justify-around px-1 pt-2 pb-[calc(env(safe-area-inset-bottom)+8px)]">
        {navItems.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

          return ( 
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 transition-colors ${
                active
                  ? "text-emerald-700"
                  : "text-slate-500"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.8 : 2}
                fill={
                  active && item.icon === House
                    ? "currentColor"
                    : "none"
                }
              />

              <span className="whitespace-nowrap text-[9px] font-semibold sm:text-[10px]">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
};

export default FooterBar;
