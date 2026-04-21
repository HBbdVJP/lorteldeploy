// src/app/admin/layout.tsx
"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useAdminDashboard } from "@/components/useAdminDashboard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lấy các state và logic từ hook dùng chung
  const {
    admin,
    bookings,
    messages,
    isUserMenuOpen,
    setIsUserMenuOpen,
    handleLogout,
    isDarkMode,
    toggleDarkMode,
  } = useAdminDashboard();
  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Sidebar mới đã tách file */}
      <AdminSidebar
        admin={admin}
        bookings={bookings}
        messages={messages}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        handleLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
        {/* Nội dung các trang con sẽ hiển thị tại children */}
        {children}
      </main>
    </div>
  );
}