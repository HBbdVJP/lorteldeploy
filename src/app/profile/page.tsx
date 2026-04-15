"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";

// Mock data cho các đơn đặt phòng
const MOCK_BOOKINGS = [
  {
    id: "BK001",
    roomName: "Deluxe Ocean View",
    checkin: "2026-04-10",
    checkout: "2026-04-12",
    status: "completed",
    total: 3000000,
    image: "https://picsum.photos/id/20/400/300"
  },
  {
    id: "BK002",
    roomName: "Suite Premium",
    checkin: "2026-05-01",
    checkout: "2026-05-03",
    status: "pending",
    total: 4400000,
    image: "https://picsum.photos/id/29/400/300"
  }
];

const ACTIVE_PROMOS = [
  { code: "SUMMER30", name: "Giảm 30% Mùa Hè", expiry: "2026-06-30", desc: "Áp dụng cho các hạng phòng Deluxe" },
  { code: "WELCOME20", name: "Ưu đãi Thành viên", expiry: "2026-12-31", desc: "Giảm 20% cho lần đặt tiếp theo" }
];

const formatCurrency = (amount: number) => new Intl.NumberFormat("vi-VN").format(amount) + "đ";
const [activeTab, setActiveTab] = useState<"bookings" | "promos">("bookings");


export default function ProfilePage() {
  // Trạng thái user đồng bộ hoàn toàn với Header
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Logic check y hệt Header của bạn
    const userData = localStorage.getItem('customer_data') || sessionStorage.getItem('customer_data');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Lỗi parse dữ liệu user");
      }
    }
    setIsLoaded(true);
  }, []);

  // Hàm xử lý Logout đồng bộ với Header
  const handleLogout = () => {
    localStorage.removeItem('customer_data');
    sessionStorage.removeItem('customer_data');
    localStorage.removeItem('customer_email');
    localStorage.removeItem('customer_password');
    localStorage.setItem('customer_remember', 'false');
    setUser(null);
    window.location.href = "/"; // Dùng window.location để reset toàn bộ trạng thái app
  };

  // Tránh bị "nháy" giao diện khi đang đọc Storage
  if (!isLoaded) return <div className="min-h-screen bg-gray-50"></div>;

  // CHƯA LOGIN: Hiện thông báo theo style yêu cầu
  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg border border-gray-100">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-user-lock text-3xl text-emerald-600"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Bạn chưa đăng nhập</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Vui lòng đăng nhập để xem thông tin cá nhân, quản lý đơn đặt phòng và nhận các ưu đãi dành riêng cho thành viên.
            </p>
            <Link href="/login" className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold shadow-lg shadow-emerald-200">
              <i className="fas fa-user-plus mr-2"></i>Đăng ký ngay
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ĐÃ LOGIN: Hiện trang Profile
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center border border-gray-100 sticky top-24">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                <i className="fas fa-user text-4xl text-emerald-600"></i>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{user.name || "Khách hàng"}</h2>
              <p className="text-sm text-gray-500 mb-6">{user.email}</p>
              
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 font-medium border border-emerald-100">
                  <i className="fas fa-history mr-3"></i>Lịch sử đặt phòng
                </button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition font-medium">
                  <i className="fas fa-sign-out-alt mr-3"></i>Đăng xuất
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`flex-1 py-4 font-semibold text-center transition-colors ${
                    activeTab === "bookings"
                      ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/30"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <i className="fas fa-calendar-check mr-2"></i>Lịch sử đặt
                  phòng
                </button>
                <button
                  onClick={() => setActiveTab("promos")}
                  className={`flex-1 py-4 font-semibold text-center transition-colors ${
                    activeTab === "promos"
                      ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/30"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <i className="fas fa-ticket-alt mr-2"></i>Ưu đãi của tôi
                </button>
              </div>

              <div className="p-6">
                {activeTab === "bookings" ? (
                  <div className="space-y-6">
                    {MOCK_BOOKINGS.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col md:flex-row gap-6 p-4 border rounded-xl hover:shadow-md transition-shadow"
                      >
                        <img
                          src={booking.image}
                          className="w-full md:w-48 h-32 object-cover rounded-lg"
                          alt={booking.roomName}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold">{booking.roomName}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                booking.status === "completed" ? "bg-blue-100 text-blue-600" : "bg-yellow-100 text-yellow-600"
                              }`}
                            >
                              {booking.status === "completed" ? "Đã hoàn tất" : "Chờ nhận phòng"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            <i className="fas fa-clock mr-2"></i>
                            {booking.checkin} → {booking.checkout}
                          </p>
                          <p className="text-lg font-bold text-emerald-600">{formatCurrency(booking.total)}</p>
                        </div>
                        <div className="flex flex-col justify-center gap-2">
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition">
                            Chi tiết
                          </button>
                          {booking.status === "pending" && (
                            <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 text-sm font-medium transition">
                              Hủy đặt
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ACTIVE_PROMOS.map((promo) => (
                      <div
                        key={promo.code}
                        className="border-2 border-dashed border-emerald-200 rounded-2xl p-5 bg-emerald-50/50"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <i className="fas fa-gift text-emerald-600 text-xl"></i>
                          </div>
                          <span className="bg-emerald-600 text-white px-3 py-1 rounded-lg font-mono text-sm">
                            {promo.code}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1">{promo.name}</h3>
                        <p className="text-xs text-gray-500 mb-3 leading-relaxed">{promo.desc}</p>
                        <p className="text-xs text-red-500">Hết hạn: {promo.expiry}</p>
                        <button className="w-full mt-4 py-2 bg-white border border-emerald-600 text-emerald-600 rounded-lg text-sm font-bold hover:bg-emerald-600 hover:text-white transition">
                          Dùng ngay
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}