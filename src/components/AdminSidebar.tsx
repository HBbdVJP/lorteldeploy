// src/components/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  admin: any;
  bookings: any[];
  messages: any[];
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function AdminSidebar({
  admin,
  bookings,
  messages,
  isUserMenuOpen,
  setIsUserMenuOpen,
  handleLogout,
  isDarkMode,
  toggleDarkMode,
}: SidebarProps) {
  const pathname = usePathname();

  // Hàm helper để kiểm tra xem link có đang active không
  const isActive = (path: string) => pathname === path;

  // Cấu hình Menu để code gọn hơn
  const mainNav = [
    { href: "/admin", icon: "fa-home", label: "Tổng quan" },
    {
      href: "/admin/infrastorage",
      icon: "fa-calendar-check",
      label: "Đặt phòng",
      badge: bookings.filter((b) => b.status === "pending").length,
      badgeColor: "bg-red-500",
    },
    { href: "/admin/infrastorage", icon: "fa-bed", label: "Quản lý phòng" },
    { href: "/admin/hrmanage", icon: "fa-users", label: "Khách hàng" },
    { href: "/admin/hrmanage", icon: "fa-user-tie", label: "Nhân viên" },
  ];

  const manageNav = [
    { href: "/admin/command", icon: "fa-tags", label: "Khuyến mãi" },
    { href: "/admin/finance", icon: "fa-chart-line", label: "Báo cáo" },
    {
      href: "/admin/messages",
      icon: "fa-envelope",
      label: "Tin nhắn",
      badge: messages.reduce((sum, m) => sum + (m.unread || 0), 0),
      badgeColor: "bg-green-500",
    },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl h-screen sticky top-0">
      {/* LOGO */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <i className="fas fa-crown text-gray-900 text-xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wider">
              Lortel
            </h1>
            <p className="text-xs text-gray-400">Hệ thống quản trị</p>
          </div>
        </div>
      </div>

      {/* USER PROFILE */}
      <div className="p-6 border-b border-gray-700 relative">
        <div
          className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition"
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center font-bold shadow-lg">
            {admin?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-bold truncate text-sm">
              {admin?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-400 truncate">{admin?.email}</p>
          </div>
          <i
            className={`fas fa-chevron-${isUserMenuOpen ? "up" : "down"} text-xs text-gray-500`}
          ></i>
        </div>

        {isUserMenuOpen && (
          <div className="absolute top-full left-4 right-4 bg-gray-800 rounded-lg mt-1 shadow-2xl border border-gray-700 z-50 p-1 overflow-hidden animate-slide-in">
            <Link
              href="/admin/profile"
              className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-700 rounded-md text-sm"
            >
              <i className="fas fa-user w-4"></i> Hồ sơ
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-400 hover:bg-red-400/10 rounded-md text-sm"
            >
              <i className="fas fa-sign-out-alt w-4"></i> Đăng xuất
            </button>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <div className="px-4 mb-6">
          <p className="text-[10px] font-black text-gray-500 uppercase px-3 mb-2 tracking-widest">
            Main Menu
          </p>
          <div className="space-y-1">
            {mainNav.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                  isActive(item.href)
                    ? "active bg-emerald-500/10 text-emerald-400"
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                <i className={`fas ${item.icon} w-5`}></i>
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold ${item.badgeColor || "bg-gray-600"}`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>

        <div className="px-4">
          <p className="text-[10px] font-black text-gray-500 uppercase px-3 mb-2 tracking-widest">
            Quản lý hệ thống
          </p>
          <div className="space-y-1">
            {manageNav.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                  isActive(item.href)
                    ? "active bg-emerald-500/10 text-emerald-400"
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                <i className={`fas ${item.icon} w-5`}></i>
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold ${item.badgeColor || "bg-gray-600"}`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* FOOTER - DARK MODE */}
      <div className="p-4 border-t border-gray-700 bg-gray-900/50">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <i className={`fas ${isDarkMode ? "fa-moon" : "fa-sun"}`}></i>
            <span>Giao diện tối</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </aside>
  );
}
