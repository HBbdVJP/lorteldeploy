"use client";

import { useRouter } from "next/navigation";
import { Line } from "react-chartjs-2";
import { useAdminDashboard } from "@/components/useAdminDashboard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
    setActiveTab,
    isNotifDropdownOpen,
    setIsNotifDropdownOpen,
    currentTime,
    globalSearch,
    setGlobalSearch,
    showSearchResults,
    setShowSearchResults,
    bookings,
    rooms,
    customers,
    notifications,
    activities,
    toast,
    showToast,
    searchResults,
    formatCurrency,
    setNotifications,
    isCustomerModalOpen,
    isDeleteModalOpen,
    deleteModalData,
    setIsDeleteModalOpen,
    setDeleteModalData,
    editCustomerId,
    customers: _customers,
    setCustomers,
    customerFormRef,
    setEditCustomerId,
    setIsCustomerModalOpen,
  } = useAdminDashboard();

  if (isChecking) {
    return (
      <div className="flex items-center justify-center bg-slate-900">
        <div className="loading-spinner" />
      </div>
    );
  }
  if (!admin) return null;

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
        label: "Doanh thu (triệu)",
        data: [45, 52, 48, 70, 65, 58, 62],
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.1)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

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

  const openCustomerModalLocal = (id: number | null = null) => {
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
    const addressInput = form.querySelector("#customerAddress") as HTMLInputElement;

    const name = nameInput?.value || "";
    const email = emailInput?.value || "";

    if (!name || !email) {
      showToast("Vui lòng điền họ tên và email", "error");
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
      showToast("Cập nhật khách hàng thành công");
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
      showToast("Thêm khách hàng thành công");
    }
    closeCustomerModal();
  };

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
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2 border border-slate-700 rounded-lg focus:border-emerald-500 outline-none text-sm bg-slate-800 text-slate-100"
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              />
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 rounded-lg shadow-lg border border-slate-700 max-h-96 overflow-y-auto z-20">
                  {searchResults.map((res, idx) => (
                    <div
                      key={idx}
                      className="p-3 hover:bg-slate-700 border-b border-slate-700 cursor-pointer"
                      onClick={() => {
                        setGlobalSearch(res.title);
                        setShowSearchResults(false);
                        showToast(`Tìm thấy: ${res.title}`, "info");
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
                className="text-slate-100 hover:text-emerald-600"
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
                  <div className="p-3 border-b border-slate-700 flex justify-between">
                    <span className="font-bold">Thông báo</span>
                    <button
                      className="text-xs text-emerald-600"
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.map((n) => ({ ...n, read: true })),
                        );
                        showToast("Đã đánh dấu tất cả đã đọc");
                      }}
                    >
                      Đánh dấu đã đọc
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 border-b border-slate-700 ${!n.read ? "bg-blue-900/20" : ""}`}
                      >
                        <p className="text-sm">{n.title}</p>
                        <p className="text-xs text-gray-400">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="text-sm font-medium text-slate-100 border-l border-slate-600 pl-4">
              {currentTime}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Tổng quan</h1>
                <p className="text-gray-500 text-sm">
                  Xem tổng quan hoạt động kinh doanh
                </p>
              </div>
              <button
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm"
                onClick={() => showToast("Đã làm mới dữ liệu")}
              >
                <i className="fas fa-sync-alt mr-2"></i>Làm mới
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
                <p className="text-slate-400 text-sm mt-2">Doanh thu hôm nay</p>
                <p className="text-2xl font-bold text-slate-100">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <div className="stat-card bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-700">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-calendar-check text-green-600"></i>
                </div>
                <p className="text-slate-400 text-sm mt-2">Đặt phòng mới</p>
                <p className="text-2xl font-bold text-slate-100">{bookings.length}</p>
                <p className="text-xs text-yellow-600">Chờ: {pendingBookings}</p>
              </div>
              <div className="stat-card bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-700">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-bed text-yellow-600"></i>
                </div>
                <p className="text-slate-400 text-sm mt-2">Phòng trống</p>
                <p className="text-2xl font-bold text-slate-100">{availableRooms}</p>
                <p className="text-xs text-slate-400">Tổng: {rooms.length}</p>
              </div>
              <div className="stat-card bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-700">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-users text-purple-600"></i>
                </div>
                <p className="text-slate-400 text-sm mt-2">Khách hàng mới</p>
                <p className="text-2xl font-bold text-slate-100">{newCustomers}</p>
                <p className="text-xs text-slate-400">Tổng: {customers.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-100">Biểu đồ doanh thu</h3>
                  <div className="flex gap-1">
                    <button className="text-xs px-3 py-1 rounded bg-emerald-600 text-white">
                      7 ngày
                    </button>
                    <button className="text-xs px-3 py-1 rounded hover:bg-slate-700 text-slate-100 border border-slate-700">
                      30 ngày
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
                <h3 className="font-bold mb-4 text-slate-100">Phòng được đặt nhiều nhất</h3>
                <div className="space-y-3">
                  {rooms.slice(0, 4).map((r) => (
                    <div key={r.id}>
                      <div className="flex justify-between text-sm">
                        <span>{r.name}</span>
                        <span>{Math.floor(Math.random() * 50)} lượt</span>
                      </div>
                      <div className="progress-bar mt-1">
                        <div
                          className="progress-fill"
                          style={{ width: `${Math.floor(Math.random() * 80 + 20)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <h4 className="font-medium text-sm mb-2">Tỉ lệ lấp đầy</h4>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs">
                        <span>Hôm nay</span>
                        <span>{Math.round((occupiedRooms / rooms.length) * 100)}%</span>
                      </div>
                      <div className="progress-bar mt-1">
                        <div
                          className="progress-fill"
                          style={{ width: `${(occupiedRooms / rooms.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700">
                <div className="px-6 py-4 border-b border-slate-700 flex justify-between">
                  <h3 className="font-bold">Đặt phòng gần đây</h3>
                  <a
                    href="#"
                    onClick={() => setActiveTab("bookings")}
                    className="text-emerald-600 text-sm"
                  >
                    Xem tất cả
                  </a>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs">Mã</th>
                        <th className="px-4 py-3 text-left text-xs">Khách</th>
                        <th className="px-4 py-3 text-left text-xs">Phòng</th>
                        <th className="px-4 py-3 text-left text-xs">Trạng thái</th>
                        <th className="px-4 py-3 text-right text-xs">Tổng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.id} className="border-b border-slate-700">
                          <td className="px-4 py-2">{b.code}</td>
                          <td className="px-4 py-2">{b.customer}</td>
                          <td className="px-4 py-2">{b.room}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`badge ${b.status === "confirmed" ? "badge-success" : b.status === "pending" ? "badge-warning" : "badge-info"}`}
                            >
                              {b.status === "confirmed"
                                ? "Đã xác nhận"
                                : b.status === "pending"
                                  ? "Chờ"
                                  : "Hoàn thành"}
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
                <div className="px-6 py-4 border-b border-slate-700">
                  <h3 className="font-bold">Hoạt động gần đây</h3>
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
          </div>
        </div>
      </main>

      {/* TOAST */}
      {toast.visible && (
        <div
          className={`fixed bottom-5 right-5 px-6 py-3 rounded-xl text-white shadow-2xl z-50 ${toast.type === "error" ? "bg-red-500" : toast.type === "info" ? "bg-blue-500" : "bg-emerald-500"}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}