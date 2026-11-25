
import { Wallet } from "lucide-react";

const StatsCard = ({ title, value, icon: Icon = Wallet, color }) => {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm transition hover:shadow-md sm:rounded-2xl sm:p-3">

      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl ${color}`}
      >
        <Icon size={16} />
      </div>

      <p className="mt-2 truncate text-[10px] font-medium text-slate-500 sm:text-xs">
        {title}
      </p>

      <h3 className="mt-0.5 truncate text-sm font-extrabold text-slate-800 sm:text-base">
        {value}
      </h3>

    </div>
  );
};

export default StatsCard;
