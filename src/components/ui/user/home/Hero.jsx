'use client'
import { useSession } from "@/lib/auth-client";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";

const Hero = () => {

  const { data: session } = useSession();
  return (
    <section className="relative mb-10 h-[444px] w-full shrink-0 ">

      {/* Hero Background */}
      <div className="absolute inset-0 overflow-hidden ">
        <Image
          src="/LoginBanner.png"
          alt="Friends Dream Builders"
          fill
          priority
          quality={100}
          sizes="(max-width: 430px) 100vw, 430px"
          className="object-cover object-[center_10%]"
        />
      </div>

      {/* Profile Badge */}
      <div className="absolute bottom-0 left-4 right-4 z-10 translate-y-1/2 sm:left-5 sm:right-5">

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/70 bg-[#F0FDE8] p-3 shadow-lg backdrop-blur-md sm:p-4">

          {/* Profile Info */}
          <div className="flex min-w-0 items-center gap-3">
            <CircleUserRound />

            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                {session?.user?.name || "User Name"}
              </h3>

              <p className="mt-0.5 text-[10px] font-medium text-gray-500 sm:text-xs">
              {session?.user?.id
  ? `Member ID: ${session.user.id}`
  : "Member ID: Auto"}
              </p>
            </div>
          </div>

          {/* Member Badge */}
          <div className="shrink-0 rounded-full bg-green-700 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm sm:px-4 sm:text-xs">
            Member
          </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;
