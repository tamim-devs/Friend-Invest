import Hero from "@/components/ui/user/home/Hero";
import DashboardStats from "@/components/ui/user/home/DashboardStats";

export default function Home() {
  return (
    <main className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-white">

      <Hero />

      <div className="min-h-0 flex-1 px-4 pb-2 sm:px-5">
        <DashboardStats />
      </div>

    </main>
  );
}