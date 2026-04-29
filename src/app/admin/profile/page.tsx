//src/app/admin/profile/page.tsx
"use client";

import { useState, useEffect } from "react";

export default function ProfilePage() {
  
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("vi-VN", { hour12: false });
      setCurrentDateTime(`${dateStr} - ${timeStr}`);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`bg-slate-900 transition-colors duration-300 min-h-screen flex flex-col`}
    >
      {/* Header */}
      <header className="bg-slate-900 px-6 py-3 flex sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-4">
          <div className="border-l border-slate-700 pl-4">
            <h1 className="text-sm font-black text-white uppercase">
              Há»“ sÆ¡ cÃ¡ nhÃ¢n
            </h1>
          </div>
        </div>
        <div className="ml-auto flex items-center text-slate-400 text-xs font-mono">
          {currentDateTime}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-slate-800/50">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Card */}
          <div className="bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="h-32 bg-linear-to-r from-blue-500 to-blue-600"></div>
            <div className="px-6 py-6 relative">
              <div className="flex items-end gap-6 -mt-20 mb-6">
                <div className="w-32 h-32 rounded-xl bg-slate-600 border-4 border-slate-700 flex items-center justify-center shadow-md">
                  <span className="text-5xl font-black text-slate-500">ðŸ‘¤</span>
                </div>
                <div className="flex-1 pb-2">
                  <h2 className="text-2xl font-black text-slate-100">
                    Admin User
                  </h2>
                  <p className="text-sm text-slate-400">
                    Quáº£n trá»‹ viÃªn há»‡ thá»‘ng
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-blue-900/30">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">
                TÃ i khoáº£n
              </p>
              <p className="text-2xl font-black text-blue-400">
                Hoáº¡t Ä‘á»™ng
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-emerald-900/30">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">
                ÄÄƒng nháº­p cuá»‘i
              </p>
              <p className="text-sm font-black text-emerald-400">
                HÃ´m nay
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-amber-900/30">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">
                Quyá»n háº¡n
              </p>
              <p className="text-sm font-black text-amber-400">
                Cao nháº¥t
              </p>
            </div>
          </div>

          {/* Account Info Section */}
          <div className="bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-800">
              <h3 className="text-lg font-bold text-slate-100">
                ThÃ´ng tin tÃ i khoáº£n
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                    Email
                  </p>
                  <p className="text-slate-100 font-medium">
                    admin@lortelhotel.com
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                    Sá»‘ Ä‘iá»‡n thoáº¡i
                  </p>
                  <p className="text-slate-100 font-medium">
                    +84 (0)123 456 789
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                    TÃªn Ä‘áº§y Ä‘á»§
                  </p>
                  <p className="text-slate-100 font-medium">
                    Nguyá»…n VÄƒn Admin
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                    NgÃ y tham gia
                  </p>
                  <p className="text-slate-100 font-medium">
                    15/01/2020
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-800">
              <h3 className="text-lg font-bold text-slate-100">
                CÃ i Ä‘áº·t
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-100">
                    ThÃ´ng bÃ¡o email
                  </p>
                  <p className="text-sm text-slate-400">
                    Nháº­n thÃ´ng bÃ¡o qua email
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-100">
                    Cháº¿ Ä‘á»™ tá»‘i
                  </p>
                  <p className="text-sm text-slate-400">
                    Tá»± Ä‘á»™ng theo há»‡ thá»‘ng
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-800">
              <h3 className="text-lg font-bold text-slate-100">
                Hoáº¡t Ä‘á»™ng gáº§n Ä‘Ã¢y
              </h3>
            </div>
            <div className="divide-y dark:divide-slate-600">
              {[
                {
                  action: "ÄÄƒng nháº­p",
                  time: "2 phÃºt trÆ°á»›c",
                  colorClass: "bg-emerald-500",
                },
                {
                  action: "Cáº­p nháº­t há»“ sÆ¡",
                  time: "1 giá» trÆ°á»›c",
                  colorClass: "bg-blue-500",
                },
                {
                  action: "Äá»•i máº­t kháº©u",
                  time: "3 ngÃ y trÆ°á»›c",
                  colorClass: "bg-amber-500",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 flex items-center justify-between hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${item.colorClass}`}></div>
                    <div>
                      <p className="font-bold text-slate-100">
                        {item.action}
                      </p>
                      <p className="text-sm text-slate-400">
                        {item.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}




