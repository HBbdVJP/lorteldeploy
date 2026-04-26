"use client";

import { useDarkMode } from "@/contexts/DarkModeContext";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { isDarkMode } = useDarkMode();
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
      className={`${isDarkMode ? "dark" : ""} bg-slate-100 dark:bg-slate-900 transition-colors duration-300 min-h-screen flex flex-col`}
    >
      {/* Header */}
      <header className="bg-slate-900 px-6 py-3 flex sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-4">
          <div className="border-l border-slate-700 pl-4">
            <h1 className="text-sm font-black text-white uppercase">
              Hồ sơ cá nhân
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
          <div className="bg-white dark:bg-slate-700 rounded-xl shadow-sm overflow-hidden">
            <div className="h-32 bg-linear-to-r from-blue-500 to-blue-600"></div>
            <div className="px-6 py-6 relative">
              <div className="flex items-end gap-6 -mt-20 mb-6">
                <div className="w-32 h-32 rounded-xl bg-slate-200 dark:bg-slate-600 border-4 border-white dark:border-slate-700 flex items-center justify-center shadow-md">
                  <span className="text-5xl font-black text-slate-400 dark:text-slate-500">👤</span>
                </div>
                <div className="flex-1 pb-2">
                  <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                    Admin User
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Quản trị viên hệ thống
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-sm border border-blue-200 dark:border-blue-900/30">
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Tài khoản
              </p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                Hoạt động
              </p>
            </div>
            <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-sm border border-emerald-200 dark:border-emerald-900/30">
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Đăng nhập cuối
              </p>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                Hôm nay
              </p>
            </div>
            <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-sm border border-amber-200 dark:border-amber-900/30">
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Quyền hạn
              </p>
              <p className="text-sm font-black text-amber-600 dark:text-amber-400">
                Cao nhất
              </p>
            </div>
          </div>

          {/* Account Info Section */}
          <div className="bg-white dark:bg-slate-700 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Thông tin tài khoản
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                    Email
                  </p>
                  <p className="text-slate-800 dark:text-slate-100 font-medium">
                    admin@lortelhotel.com
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                    Số điện thoại
                  </p>
                  <p className="text-slate-800 dark:text-slate-100 font-medium">
                    +84 (0)123 456 789
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                    Tên đầy đủ
                  </p>
                  <p className="text-slate-800 dark:text-slate-100 font-medium">
                    Nguyễn Văn Admin
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                    Ngày tham gia
                  </p>
                  <p className="text-slate-800 dark:text-slate-100 font-medium">
                    15/01/2020
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white dark:bg-slate-700 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Cài đặt
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">
                    Thông báo email
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Nhận thông báo qua email
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
                  <p className="font-bold text-slate-800 dark:text-slate-100">
                    Chế độ tối
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tự động theo hệ thống
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
          <div className="bg-white dark:bg-slate-700 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Hoạt động gần đây
              </h3>
            </div>
            <div className="divide-y dark:divide-slate-600">
              {[
                {
                  action: "Đăng nhập",
                  time: "2 phút trước",
                  color: "emerald",
                },
                {
                  action: "Cập nhật hồ sơ",
                  time: "1 giờ trước",
                  color: "blue",
                },
                {
                  action: "Đổi mật khẩu",
                  time: "3 ngày trước",
                  color: "amber",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full bg-${item.color}-500`}
                    ></div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">
                        {item.action}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
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

