import FooterBar from "@/components/ui/user/FooterBar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-dvh justify-center bg-zinc-200 dark:bg-zinc-900">
      <div className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-zinc-50 font-sans dark:bg-black sm:h-[844px]  sm:shadow-2xl">

        <main className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </main>

        <FooterBar />

      </div>
    </div>
  );
};

export default AdminLayout;