"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { useAdminDashboard } from "@/components/useAdminDashboard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

export default function AdminPage() {
  const router = useRouter();
  const {
    admin,
    isChecking,
    activeTab,
    setActiveTab,
    isUserMenuOpen,
    setIsUserMenuOpen,
    isNotifDropdownOpen,
    setIsNotifDropdownOpen,
    currentTime,
    globalSearch,
    setGlobalSearch,
    showSearchResults,
    setShowSearchResults,
    bookings,
    setBookings,
    rooms,
    setRooms,
    customers,
    staffs,
    promotions,
    messages,
    notifications,
    activities,
    isBookingModalOpen,
    setIsBookingModalOpen,
    isRoomModalOpen,
    setIsRoomModalOpen,
    isCustomerModalOpen,
    setIsCustomerModalOpen,
    isStaffModalOpen,
    setIsStaffModalOpen,
    isPromoModalOpen,
    setIsPromoModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteModalData,
    setDeleteModalData,
    editBookingId,
    setEditBookingId,
    editRoomId,
    setEditRoomId,
    editCustomerId,
    setEditCustomerId,
    editStaffId,
    setEditStaffId,
    bookingFormRef,
    roomFormRef,
    customerFormRef,
    staffFormRef,
    setCustomers,
    setStaffs,
    setPromotions,
    setMessages,
    setNotifications,
    promoFormRef,
    editPromoId,
    setEditPromoId,
    currentChatId,
    setCurrentChatId,
    chatInput,
    setChatInput,
    toast,
    showToast,
    handleLogout,
    searchResults,
    formatCurrency,
    formatDate,
  } = useAdminDashboard();

  // ---------- Dá»¯ liá»‡u máº«u ----------

  // ---------- Modal handlers ----------
  const openDeleteModal = (
    title: string,
    message: string,
    onConfirm: () => void,
  ) => {
    setDeleteModalData({ title, message, onConfirm });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteModalData(null);
  };

  const confirmDelete = () => {
    if (deleteModalData) {
      deleteModalData.onConfirm();
    }
    closeDeleteModal();
  };

  // Booking and Room CRUD have been moved to /admin/command/page.tsx

  // Customer CRUD
  const openCustomerModal = (id: number | null = null) => {
    setEditCustomerId(id);
    setIsCustomerModalOpen(true);
  };

  const closeCustomerModal = () => {
    setIsCustomerModalOpen(false);
    setEditCustomerId(null);
  };

  const saveCustomer = () => {
    const form = customerFormRef.current;
    if (!form) return;
    const nameInput = form.querySelector("#customerName") as HTMLInputElement;
    const emailInput = form.querySelector("#customerEmail") as HTMLInputElement;
    const phoneInput = form.querySelector("#customerPhone") as HTMLInputElement;
    const addressInput = form.querySelector(
      "#customerAddress",
    ) as HTMLInputElement;

    const name = nameInput?.value || "";
    const email = emailInput?.value || "";

    if (!name || !email) {
      showToast("Vui lÃ²ng Ä‘iá»n há» tÃªn vÃ  email", "error");
      return;
    }

    if (editCustomerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editCustomerId
            ? {
                ...c,
                name,
                email,
                phone: phoneInput?.value || "",
                address: addressInput?.value || "",
              }
            : c,
        ),
      );
      showToast("Cáº­p nháº­t khÃ¡ch hÃ ng thÃ nh cÃ´ng");
    } else {
      const newId = Math.max(...customers.map((c) => c.id), 0) + 1;
      setCustomers((prev) => [
        ...prev,
        {
          id: newId,
          name,
          email,
          phone: phoneInput?.value || "",
          address: addressInput?.value || "",
          bookings: 0,
          totalSpent: 0,
          joinDate: new Date().toISOString().split("T")[0],
        },
      ]);
      showToast("ThÃªm khÃ¡ch hÃ ng thÃ nh cÃ´ng");
    }
    closeCustomerModal();
  };

  const deleteCustomer = (id: number) => {
    openDeleteModal(
      "XÃ³a khÃ¡ch hÃ ng",
      "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a khÃ¡ch hÃ ng nÃ y?",
      () => {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
        showToast("ÄÃ£ xÃ³a khÃ¡ch hÃ ng");
      },
    );
  };

  // Staff CRUD
  const openStaffModal = (id: number | null = null) => {
    setEditStaffId(id);
    setIsStaffModalOpen(true);
  };

  const closeStaffModal = () => {
    setIsStaffModalOpen(false);
    setEditStaffId(null);
  };

  const saveStaff = () => {
    const form = staffFormRef.current;
    if (!form) return;
    const nameInput = form.querySelector("#staffName") as HTMLInputElement;
    const emailInput = form.querySelector("#staffEmail") as HTMLInputElement;
    const phoneInput = form.querySelector("#staffPhone") as HTMLInputElement;
    const roleSelect = form.querySelector("#staffRole") as HTMLSelectElement;
    const passwordInput = form.querySelector(
      "#staffPassword",
    ) as HTMLInputElement;

    const name = nameInput?.value || "";
    const email = emailInput?.value || "";

    if (!name || !email) {
      showToast("Vui lÃ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ thÃ´ng tin", "error");
      return;
    }

    if (editStaffId) {
      setStaffs((prev) =>
        prev.map((s) =>
          s.id === editStaffId
            ? {
                ...s,
                name,
                email,
                phone: phoneInput?.value || "",
                role: roleSelect?.value || "receptionist",
              }
            : s,
        ),
      );
      showToast("Cáº­p nháº­t nhÃ¢n viÃªn thÃ nh cÃ´ng");
    } else {
      if (!passwordInput?.value) {
        showToast("Vui lÃ²ng nháº­p máº­t kháº©u", "error");
        return;
      }
      const newId = Math.max(...staffs.map((s) => s.id), 0) + 1;
      setStaffs((prev) => [
        ...prev,
        {
          id: newId,
          name,
          email,
          phone: phoneInput?.value || "",
          role: roleSelect?.value || "receptionist",
          status: "active",
          joinDate: new Date().toISOString().split("T")[0],
        },
      ]);
      showToast("ThÃªm nhÃ¢n viÃªn thÃ nh cÃ´ng");
    }
    closeStaffModal();
  };

  const deleteStaff = (id: number) => {
    openDeleteModal(
      "XÃ³a nhÃ¢n viÃªn",
      "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a nhÃ¢n viÃªn nÃ y?",
      () => {
        setStaffs((prev) => prev.filter((s) => s.id !== id));
        showToast("ÄÃ£ xÃ³a nhÃ¢n viÃªn");
      },
    );
  };

  // Promotion CRUD
  const openPromoModal = (id: number | null = null) => {
    setEditPromoId(id);
    setIsPromoModalOpen(true);
  };

  const closePromoModal = () => {
    setIsPromoModalOpen(false);
    setEditPromoId(null);
  };

  const savePromotion = () => {
    const form = promoFormRef.current;
    if (!form) return;
    const nameInput = form.querySelector("#promoName") as HTMLInputElement;
    const codeInput = form.querySelector("#promoCode") as HTMLInputElement;
    const typeSelect = form.querySelector("#promoType") as HTMLSelectElement;
    const valueInput = form.querySelector("#promoValue") as HTMLInputElement;
    const startInput = form.querySelector("#promoStart") as HTMLInputElement;
    const endInput = form.querySelector("#promoEnd") as HTMLInputElement;

    const name = nameInput?.value || "";
    const code = codeInput?.value || "";
    const type = typeSelect?.value || "percent";
    const value = parseInt(valueInput?.value || "0");
    const start = startInput?.value || "";
    const end = endInput?.value || "";

    if (!name || !code || !value) {
      showToast("Vui lÃ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ thÃ´ng tin", "error");
      return;
    }

    const status = new Date(end) > new Date() ? "active" : "expired";

    if (editPromoId) {
      setPromotions((prev) =>
        prev.map((p) =>
          p.id === editPromoId
            ? {
                ...p,
                name,
                code,
                type: type as "percent" | "fixed",
                value,
                start,
                end,
                status,
              }
            : p,
        ),
      );
      showToast("Cáº­p nháº­t khuyáº¿n mÃ£i thÃ nh cÃ´ng");
    } else {
      const newId = Math.max(...promotions.map((p) => p.id), 0) + 1;
      setPromotions((prev) => [
        ...prev,
        {
          id: newId,
          name,
          code,
          type: type as "percent" | "fixed",
          value,
          start,
          end,
          status,
        },
      ]);
      showToast("ThÃªm khuyáº¿n mÃ£i thÃ nh cÃ´ng");
    }
    closePromoModal();
  };

  const deletePromotion = (id: number) => {
    openDeleteModal(
      "XÃ³a khuyáº¿n mÃ£i",
      "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a khuyáº¿n mÃ£i nÃ y?",
      () => {
        setPromotions((prev) => prev.filter((p) => p.id !== id));
        showToast("ÄÃ£ xÃ³a khuyáº¿n mÃ£i");
      },
    );
  };

  // Chat
  const loadChat = (id: number) => {
    setCurrentChatId(id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, unread: 0 } : m)),
    );
  };

  const sendMessage = () => {
    if (!chatInput.trim() || !currentChatId) return;
    const time = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) =>
      prev.map((m) =>
        m.id === currentChatId
          ? {
              ...m,
              messages: [
                ...m.messages,
                { from: "admin", text: chatInput, time },
              ],
            }
          : m,
      ),
    );
    setChatInput("");
  };

  if (isChecking) {
    return (
      <div className=" flex items-center justify-center bg-slate-900">
        <div className="loading-spinner" />
      </div>
    );
  }
  if (!admin) return null;

  // TÃ­nh toÃ¡n cho dashboard
  const totalRevenue = bookings.reduce(
    (sum, b) =>
      sum +
      (b.status === "confirmed" || b.status === "completed" ? b.total : 0),
    0,
  );
  const availableRooms = rooms.filter((r) => r.status === "available").length;
  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const newCustomers = customers.filter(
    (c) => new Date(c.joinDate) > new Date("2024-02-01"),
  ).length;

  const chartData = {
    labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    datasets: [
      {
        label: "Doanh thu (triá»‡u)",
        data: [45, 52, 48, 70, 65, 58, 62],
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.1)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const monthlyData = [
    850, 920, 1100, 980, 1250, 1400, 1350, 1420, 1380, 1450, 1520, 1680,
  ];
  const statusData = [
    bookings.filter((b) => b.status === "confirmed").length,
    bookings.filter((b) => b.status === "pending").length,
    bookings.filter((b) => b.status === "completed").length,
  ];

  // ---------- RENDER CONTENT ----------
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Tá»•ng quan</h1>
                <p className="text-gray-500 text-sm">
                  Xem tá»•ng quan hoáº¡t Ä‘á»™ng kinh doanh
                </p>
              </div>
              <button
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm"
                onClick={() => {
                  showToast("ÄÃ£ lÃ m má»›i dá»¯ liá»‡u");
                }}
              >
                <i className="fas fa-sync-alt mr-2"></i>LÃ m má»›i
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stat-card bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-700">
                <div className="flex justify-between">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-dollar-sign text-blue-600"></i>
                  </div>
                  <span className="text-green-600 text-sm">+12.5%</span>
                </div>
                <p className="text-slate-400 text-sm mt-2">
                  Doanh thu hÃ´m nay
                </p>
                <p className="text-2xl font-bold text-slate-100">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <div className="stat-card bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-700">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-calendar-check text-green-600"></i>
                </div>
                <p className="text-slate-400 text-sm mt-2">
                  Äáº·t phÃ²ng má»›i
                </p>
                <p className="text-2xl font-bold text-slate-100">{bookings.length}</p>
                <p className="text-xs text-yellow-600">
                  Chá»: {pendingBookings}
                </p>
              </div>
              <div className="stat-card bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-700">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-bed text-yellow-600"></i>
                </div>
                <p className="text-slate-400 text-sm mt-2">
                  PhÃ²ng trá»‘ng
                </p>
                <p className="text-2xl font-bold text-slate-100">{availableRooms}</p>
                <p className="text-xs text-slate-400">Tá»•ng: {rooms.length}</p>
              </div>
              <div className="stat-card bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-700">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-users text-purple-600"></i>
                </div>
                <p className="text-slate-400 text-sm mt-2">
                  KhÃ¡ch hÃ ng má»›i
                </p>
                <p className="text-2xl font-bold text-slate-100">{newCustomers}</p>
                <p className="text-xs text-slate-400">
                  Tá»•ng: {customers.length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-100">Biá»ƒu Ä‘á»“ doanh thu</h3>
                  <div className="flex gap-1">
                    <button className="text-xs px-3 py-1 rounded bg-emerald-600 text-white">
                      7 ngÃ y
                    </button>
                    <button className="text-xs px-3 py-1 rounded hover:bg-slate-700 text-slate-100 border border-slate-700">
                      30 ngÃ y
                    </button>
                  </div>
                </div>
                <div className="h-50">
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>
              </div>
              <div className="bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-700">
                <h3 className="font-bold mb-4 text-slate-100">PhÃ²ng Ä‘Æ°á»£c Ä‘áº·t nhiá»u nháº¥t</h3>
                <div className="space-y-3">
                  {rooms.slice(0, 4).map((r, idx) => (
                    <div key={r.id}>
                      <div className="flex justify-between text-sm">
                        <span>{r.name}</span>
                        <span>{Math.floor(Math.random() * 50)} lÆ°á»£t</span>
                      </div>
                      <div className="progress-bar mt-1">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.floor(Math.random() * 80 + 20)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-sm mb-2">Tá»‰ lá»‡ láº¥p Ä‘áº§y</h4>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs">
                        <span>HÃ´m nay</span>
                        <span>
                          {Math.round((occupiedRooms / rooms.length) * 100)}%
                        </span>
                      </div>
                      <div className="progress-bar mt-1">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${(occupiedRooms / rooms.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700">
                <div className="px-6 py-4 border-b flex justify-between">
                  <h3 className="font-bold">Äáº·t phÃ²ng gáº§n Ä‘Ã¢y</h3>
                  <a
                    href="#"
                    onClick={() => setActiveTab("bookings")}
                    className="text-emerald-600 text-sm"
                  >
                    Xem táº¥t cáº£
                  </a>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs">MÃ£</th>
                        <th className="px-4 py-3 text-left text-xs">KhÃ¡ch</th>
                        <th className="px-4 py-3 text-left text-xs">PhÃ²ng</th>
                        <th className="px-4 py-3 text-left text-xs">
                          Tráº¡ng thÃ¡i
                        </th>
                        <th className="px-4 py-3 text-right text-xs">Tá»•ng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map((b) => (
                        <tr
                          key={b.id}
                          className="border-b dark:border-gray-700"
                        >
                          <td className="px-4 py-2">{b.code}</td>
                          <td className="px-4 py-2">{b.customer}</td>
                          <td className="px-4 py-2">{b.room}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`badge ${b.status === "confirmed" ? "badge-success" : b.status === "pending" ? "badge-warning" : "badge-info"}`}
                            >
                              {b.status === "confirmed"
                                ? "ÄÃ£ xÃ¡c nháº­n"
                                : b.status === "pending"
                                  ? "Chá»"
                                  : "HoÃ n thÃ nh"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right">
                            {formatCurrency(b.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700">
                <div className="px-6 py-4 border-b">
                  <h3 className="font-bold">Hoáº¡t Ä‘á»™ng gáº§n Ä‘Ã¢y</h3>
                </div>
                <div className="p-4 space-y-3">
                  {activities.map((a, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm">{a.text}</p>
                        <p className="text-xs text-gray-400">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <button
                onClick={() => router.push("/admin/command")}
                className="bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-700 hover:shadow-md text-center"
              >
                <i className="fas fa-plus-circle text-emerald-600 text-2xl mb-2 block"></i>
                <span className="text-sm">Táº¡o Ä‘áº·t phÃ²ng</span>
              </button>
              <button
                onClick={() => router.push("/admin/command")}
                className="bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-700 hover:shadow-md text-center"
              >
                <i className="fas fa-bed text-emerald-600 text-2xl mb-2 block"></i>
                <span className="text-sm">ThÃªm phÃ²ng</span>
              </button>
              <button
                onClick={() => openCustomerModal(null)}
                className="bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-700 hover:shadow-md text-center"
              >
                <i className="fas fa-user-plus text-emerald-600 text-2xl mb-2 block"></i>
                <span className="text-sm">ThÃªm khÃ¡ch</span>
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className="bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-700 hover:shadow-md text-center"
              >
                <i className="fas fa-chart-line text-emerald-600 text-2xl mb-2 block"></i>
                <span className="text-sm">Xem bÃ¡o cÃ¡o</span>
              </button>
            </div>
          </div>
        );

      case "bookings":
        // Booking management moved to /admin/command/page.tsx
        return (
          <div className="space-y-6">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">Quáº£n lÃ½ Ä‘áº·t phÃ²ng</h1>
              <button
                onClick={() => router.push("/admin/command")}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
              >
                <i className="fas fa-external-link-alt mr-2"></i>Äi tá»›i Báº£ng Ä‘iá»u khiá»ƒn
              </button>
            </div>
          </div>
        );

      case "rooms":
        // Room management moved to /admin/command/page.tsx
        return (
          <div className="space-y-6">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">Quáº£n lÃ½ phÃ²ng</h1>
              <button
                onClick={() => router.push("/admin/command")}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
              >
                <i className="fas fa-external-link-alt mr-2"></i>Äi tá»›i Báº£ng Ä‘iá»u khiá»ƒn
              </button>
            </div>
          </div>
        );

      case "customers":
        return (
          <div className="space-y-6">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">Quáº£n lÃ½ khÃ¡ch hÃ ng</h1>
              <button
                onClick={() => openCustomerModal(null)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
              >
                <i className="fas fa-plus mr-2"></i>ThÃªm khÃ¡ch hÃ ng
              </button>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-700">
              <input
                type="text"
                placeholder="TÃ¬m kiáº¿m khÃ¡ch hÃ ng..."
                className="w-full md:w-1/3 border rounded-lg px-4 py-2 text-sm bg-slate-700 border-slate-600"
              />
            </div>
            <div className="bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-slate-700">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs">KhÃ¡ch hÃ ng</th>
                    <th className="px-6 py-3 text-left text-xs">Email</th>
                    <th className="px-6 py-3 text-left text-xs">Äiá»‡n thoáº¡i</th>
                    <th className="px-6 py-3 text-left text-xs">
                      Sá»‘ Ä‘áº·t phÃ²ng
                    </th>
                    <th className="px-6 py-3 text-right text-xs">
                      Tá»•ng chi tiÃªu
                    </th>
                    <th className="px-6 py-3 text-center text-xs">Thao tÃ¡c</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-b dark:border-gray-700">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            {c.name.charAt(0)}
                          </div>
                          <span className="font-medium">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">{c.email}</td>
                      <td className="px-6 py-3">{c.phone}</td>
                      <td className="px-6 py-3">{c.bookings}</td>
                      <td className="px-6 py-3 text-right">
                        {formatCurrency(c.totalSpent)}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          className="text-blue-600 mr-2"
                          onClick={() => openCustomerModal(c.id)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="text-red-600"
                          onClick={() => deleteCustomer(c.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "staff":
        return (
          <div className="space-y-6">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">Quáº£n lÃ½ nhÃ¢n viÃªn</h1>
              <button
                onClick={() => openStaffModal(null)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
              >
                <i className="fas fa-plus mr-2"></i>ThÃªm nhÃ¢n viÃªn
              </button>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="TÃ¬m kiáº¿m..."
                  className="border rounded-lg px-4 py-2 text-sm bg-slate-700 border-slate-600"
                />
                <select className="border rounded-lg px-4 py-2 text-sm bg-slate-700 border-slate-600">
                  <option value="all">Táº¥t cáº£ vai trÃ²</option>
                  <option value="admin">Admin</option>
                  <option value="receptionist">Lá»… tÃ¢n</option>
                  <option value="housekeeping">Dá»n phÃ²ng</option>
                  <option value="manager">Quáº£n lÃ½</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffs.map((s) => (
                <div
                  key={s.id}
                  className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-600">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold">{s.name}</h3>
                      <p className="text-sm text-gray-500">
                        {s.role === "admin"
                          ? "Quáº£n trá»‹ viÃªn"
                          : s.role === "receptionist"
                            ? "Lá»… tÃ¢n"
                            : s.role === "manager"
                              ? "Quáº£n lÃ½"
                              : "Dá»n phÃ²ng"}
                      </p>
                      <span
                        className={`badge ${s.status === "active" ? "badge-success" : "badge-warning"} text-xs`}
                      >
                        {s.status === "active" ? "Äang lÃ m viá»‡c" : "Táº¡m nghá»‰"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <p>
                      <i className="fas fa-envelope w-5 text-gray-400"></i>{" "}
                      {s.email}
                    </p>
                    <p>
                      <i className="fas fa-phone w-5 text-gray-400"></i>{" "}
                      {s.phone}
                    </p>
                    <p>
                      <i className="fas fa-calendar w-5 text-gray-400"></i> Tham
                      gia: {formatDate(s.joinDate)}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t dark:border-gray-700">
                    <button
                      className="text-blue-600"
                      onClick={() => openStaffModal(s.id)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => deleteStaff(s.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "promotions":
        return (
          <div className="space-y-6">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">Quáº£n lÃ½ khuyáº¿n mÃ£i</h1>
              <button
                onClick={() => openPromoModal(null)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
              >
                <i className="fas fa-plus mr-2"></i>Táº¡o khuyáº¿n mÃ£i
              </button>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="TÃ¬m kiáº¿m..."
                  className="border rounded-lg px-4 py-2 text-sm bg-slate-700 border-slate-600"
                />
                <select className="border rounded-lg px-4 py-2 text-sm bg-slate-700 border-slate-600">
                  <option value="all">Táº¥t cáº£</option>
                  <option value="active">Äang hoáº¡t Ä‘á»™ng</option>
                  <option value="expired">Háº¿t háº¡n</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((p) => (
                <div
                  key={p.id}
                  className={`bg-linear-to-r ${p.type === "percent" ? "from-purple-500 to-pink-500" : "from-blue-500 to-cyan-500"} rounded-xl p-5 text-white`}
                >
                  <span className="text-xs bg-slate-700/20 px-2 py-1 rounded">
                    {p.code}
                  </span>
                  <h3 className="text-xl font-bold mt-2">{p.name}</h3>
                  <p className="text-sm mt-1">
                    {p.type === "percent"
                      ? `Giáº£m ${p.value}%`
                      : `Giáº£m ${formatCurrency(p.value)}`}
                  </p>
                  <div className="flex justify-between text-xs mt-3">
                    <span>
                      {formatDate(p.start)} â†’ {formatDate(p.end)}
                    </span>
                    <span
                      className={`badge ${p.status === "active" ? "bg-green-500" : "bg-slate-700"} text-white`}
                    >
                      {p.status === "active" ? "Äang hoáº¡t Ä‘á»™ng" : "Háº¿t háº¡n"}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      className="text-white hover:text-gray-200"
                      onClick={() => openPromoModal(p.id)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="text-white hover:text-gray-200"
                      onClick={() => deletePromotion(p.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "messages":
        const currentChat = messages.find((m) => m.id === currentChatId);
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Tin nháº¯n</h1>
            <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 h-150">
              <div className="grid grid-cols-3 h-full">
                <div className="border-r dark:border-gray-700">
                  <div className="p-4 border-b dark:border-gray-700">
                    <input
                      type="text"
                      placeholder="TÃ¬m kiáº¿m..."
                      className="w-full border rounded-lg px-4 py-2 text-sm bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div className="overflow-y-auto h-[calc(100%-73px)]">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-4 hover:bg-slate-800 cursor-pointer border-b border-slate-700 ${m.unread > 0 ? "bg-blue-900/30" : ""}`}
                        onClick={() => loadChat(m.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold">
                            {m.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{m.sender}</span>
                              <span className="text-xs text-gray-400">
                                {m.time}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate">
                              {m.lastMsg}
                            </p>
                          </div>
                          {m.unread > 0 && (
                            <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                              {m.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 flex flex-col">
                  <div className="p-4 border-b dark:border-gray-700">
                    <h3 className="font-bold">
                      {currentChat ? currentChat.sender : "Chá»n ngÆ°á»i Ä‘á»ƒ chat"}
                    </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentChat?.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.from === "admin" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`${msg.from === "admin" ? "bg-emerald-600 text-white" : "bg-slate-700"} p-3 rounded-lg max-w-md`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p
                            className={`text-xs ${msg.from === "admin" ? "text-white/70" : "text-gray-400"} mt-1`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t dark:border-gray-700">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nháº­p tin nháº¯n..."
                        className="flex-1 border rounded-lg px-4 py-2 bg-slate-700 border-slate-600"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      />
                      <button
                        onClick={sendMessage}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  // ==================== RENDER CHÃNH ====================
  return (
    <div className="flex bg-slate-950">
     
      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-slate-800 shadow-sm z-10 p-4 px-8 flex justify-between items-center border-b border-slate-700">
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden text-gray-500" onClick={() => {}}>
              <i className="fas fa-bars text-xl"></i>
            </button>
            <div className="relative flex-1 max-w-md">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="TÃ¬m kiáº¿m..."
                className="w-full pl-10 pr-4 py-2 border border-slate-700 rounded-lg focus:border-emerald-500 outline-none text-sm bg-slate-800 text-slate-100"
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() =>
                  setTimeout(() => setShowSearchResults(false), 200)
                }
              />
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 rounded-lg shadow-lg border border-slate-700 max-h-96 overflow-y-auto z-20">
                  {searchResults.map((res, idx) => (
                    <div
                      key={idx}
                      className="p-3 hover:bg-slate-800 border-b border-slate-700 cursor-pointer"
                      onClick={() => {
                        setGlobalSearch(res.title);
                        setShowSearchResults(false);
                        showToast(`TÃ¬m tháº¥y: ${res.title}`, "info");
                      }}
                    >
                      <span className="text-xs text-gray-400">{res.type}</span>
                      <p className="text-sm">{res.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                className="text-gray-500 hover:text-emerald-600 text-slate-100-300"
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              >
                <i className="fas fa-bell text-xl"></i>
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>
              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-20">
                  <div className="p-3 border-b flex justify-between dark:border-gray-700">
                    <span className="font-bold">ThÃ´ng bÃ¡o</span>
                    <button
                      className="text-xs text-emerald-600"
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.map((n) => ({ ...n, read: true })),
                        );
                        showToast("ÄÃ£ Ä‘Ã¡nh dáº¥u táº¥t cáº£ Ä‘Ã£ Ä‘á»c");
                      }}
                    >
                      ÄÃ¡nh dáº¥u Ä‘Ã£ Ä‘á»c
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 border-b dark:border-gray-700 ${!n.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                      >
                        <p className="text-sm">{n.title}</p>
                        <p className="text-xs text-gray-400">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="text-sm font-medium text-gray-600 border-l pl-4 text-slate-100-300 dark:border-gray-600">
              {currentTime}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
          {renderContent()}
        </div>
      </main>

      {/* TOAST */}
      {toast.visible && (
        <div
          className={`fixed bottom-5 right-5 px-6 py-3 rounded-xl text-white shadow-2xl z-1000 ${toast.type === "error" ? "bg-red-500" : toast.type === "info" ? "bg-blue-500" : "bg-emerald-500"}`}
        >
          {toast.message}
        </div>
      )}

      {/* Booking and Room modals moved to /admin/command/page.tsx */}

      {/* CUSTOMER MODAL */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-slate-800 rounded-2xl max-w-md w-full relative modal-enter border border-slate-700"
            ref={customerFormRef}
          >
            <button
              onClick={closeCustomerModal}
              className="absolute top-4 right-4 text-gray-400"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold">
                {editCustomerId ? "Sá»­a khÃ¡ch hÃ ng" : "ThÃªm khÃ¡ch hÃ ng"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
                const customer = editCustomerId
                  ? customers.find((c) => c.id === editCustomerId)
                  : null;
                return (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Há» tÃªn *
                      </label>
                      <input
                        type="text"
                        id="customerName"
                        className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-600"
                        defaultValue={customer?.name || ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="customerEmail"
                        className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-600"
                        defaultValue={customer?.email || ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Sá»‘ Ä‘iá»‡n thoáº¡i
                      </label>
                      <input
                        type="tel"
                        id="customerPhone"
                        className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-600"
                        defaultValue={customer?.phone || ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Äá»‹a chá»‰
                      </label>
                      <input
                        type="text"
                        id="customerAddress"
                        className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-600"
                        defaultValue={customer?.address || ""}
                      />
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="p-6 border-t flex justify-end gap-3 dark:border-gray-700">
              <button
                onClick={closeCustomerModal}
                className="px-4 py-2 border rounded-lg dark:border-gray-600"
              >
                Há»§y
              </button>
              <button
                onClick={saveCustomer}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
              >
                LÆ°u
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAFF MODAL */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-slate-800 rounded-2xl max-w-md w-full relative modal-enter border border-slate-700"
            ref={staffFormRef}
          >
            <button
              onClick={closeStaffModal}
              className="absolute top-4 right-4 text-gray-400"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold">ThÃªm nhÃ¢n viÃªn</h2>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
                const staff = editStaffId
                  ? staffs.find((s) => s.id === editStaffId)
                  : null;
                return (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Há» tÃªn *
                      </label>
                      <input
                        type="text"
                        id="staffName"
                        className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-600"
                        defaultValue={staff?.name || ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="staffEmail"
                        className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-600"
                        defaultValue={staff?.email || ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Sá»‘ Ä‘iá»‡n thoáº¡i
                      </label>
                      <input
                        type="tel"
                        id="staffPhone"
                        className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-600"
                        defaultValue={staff?.phone || ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Vai trÃ²
                      </label>
                      <select
                        id="staffRole"
                        className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-600"
                        defaultValue={staff?.role || "receptionist"}
                      >
                        <option value="receptionist">Lá»… tÃ¢n</option>
                        <option value="housekeeping">Dá»n phÃ²ng</option>
                        <option value="manager">Quáº£n lÃ½</option>
                      </select>
                    </div>
                    {!editStaffId && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Máº­t kháº©u *
                        </label>
                        <input
                          type="password"
                          id="staffPassword"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-600"
                        />
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            <div className="p-6 border-t flex justify-end gap-3 dark:border-gray-700">
              <button
                onClick={closeStaffModal}
                className="px-4 py-2 border rounded-lg dark:border-gray-600"
              >
                Há»§y
              </button>
              <button
                onClick={saveStaff}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
              >
                LÆ°u
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROMOTION MODAL */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-slate-800 rounded-2xl max-w-md w-full relative modal-enter border border-slate-700"
            ref={promoFormRef}
          >
            <button
              onClick={closePromoModal}
              className="absolute top-4 right-4 text-gray-400"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold">ThÃªm khuyáº¿n mÃ£i</h2>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
                const promo = editPromoId
                  ? promotions.find((p) => p.id === editPromoId)
                  : null;
                return (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        TÃªn khuyáº¿n mÃ£i *
                      </label>
                      <input
                        type="text"
                        id="promoName"
                        className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-600"
                        defaultValue={promo?.name || ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        MÃ£ code
                      </label>
                      <input
                        type="text"
                        id="promoCode"
                        className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-600"
                        defaultValue={promo?.code || ""}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Loáº¡i
                        </label>
                        <select
                          id="promoType"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-600"
                          defaultValue={promo?.type || "percent"}
                        >
                          <option value="percent">Giáº£m %</option>
                          <option value="fixed">Giáº£m tiá»n</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          GiÃ¡ trá»‹
                        </label>
                        <input
                          type="number"
                          id="promoValue"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-600"
                          defaultValue={promo?.value || ""}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          NgÃ y báº¯t Ä‘áº§u
                        </label>
                        <input
                          type="date"
                          id="promoStart"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-600"
                          defaultValue={promo?.start || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          NgÃ y káº¿t thÃºc
                        </label>
                        <input
                          type="date"
                          id="promoEnd"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-600"
                          defaultValue={promo?.end || ""}
                        />
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="p-6 border-t flex justify-end gap-3 dark:border-gray-700">
              <button
                onClick={closePromoModal}
                className="px-4 py-2 border rounded-lg dark:border-gray-600"
              >
                Há»§y
              </button>
              <button
                onClick={savePromotion}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
              >
                LÆ°u
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {isDeleteModalOpen && deleteModalData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 text-center border border-slate-700">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">{deleteModalData.title}</h3>
            <p className="text-gray-500 mb-6">{deleteModalData.message}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border rounded-lg dark:border-gray-600"
              >
                Há»§y
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                XÃ³a
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



