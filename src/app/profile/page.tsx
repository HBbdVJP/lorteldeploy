//src/app/profile/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import customerData from "../../data/customerdata.json";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN").format(amount) + "đ";

export default function ProfilePage() {
  // Trạng thái user đồng bộ hoàn toàn với Header
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "promos">("bookings");
  const [coupons, setCoupons] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  // Thêm vào đầu component (sau các state hiện có)
  const [searchTerm, setSearchTerm] = useState("");

  type SortOption = "date_desc" | "date_asc" | "price_desc" | "price_asc";

  const [sortOption, setSortOption] = useState<SortOption>("date_desc");

  useEffect(() => {
    const loadProfile = async () => {
      // 1. Lấy user hiện tại
      const userData =
        localStorage.getItem("customer_data") ||
        sessionStorage.getItem("customer_data");
      let currentCustomer = null;
      let customerId = null;
      let customerEmail = null;

      if (userData) {
        try {
          currentCustomer = JSON.parse(userData);
          customerId = currentCustomer.CustomerID ?? currentCustomer.id ?? null;
          customerEmail = currentCustomer.email ?? null;
          setUser(currentCustomer);
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
        setIsLoaded(true);
        return;
      }

      if (!customerId && !customerEmail) {
        setBookings([]);
        setIsLoaded(true);
        return;
      }

      // 2. Chỉ lấy từ MockAPI (không đọc localStorage)
      let apiBookings = [];
      try {
        const res = await fetch(
          "https://69d0c66890cd06523d5d7d21.mockapi.io/booking",
        );
        if (res.ok) {
          apiBookings = await res.json();
        }
      } catch (error) {
        console.error("Lỗi fetch mockAPI:", error);
      }

      // 3. Lọc theo customer
      const filtered = apiBookings.filter(
        (booking) =>
          (customerId && booking.bookingcustomerid == customerId) ||
          (customerEmail && booking.bookingcustomer === customerEmail) ||
          (customerEmail && booking.bookingcustomer === currentCustomer?.name),
      );

      // 4. Định dạng hiển thị
      const formatted = filtered.map((booking) => ({
        id: booking.id, // dùng id thật từ MockAPI
        roomName: `${booking.bookingroomType} - Phòng ${booking.bookingroomNumber}`,
        checkin: new Date(booking.bookingcheckin * 1000)
          .toISOString()
          .split("T")[0],
        checkout: new Date(booking.bookingcheckout * 1000)
          .toISOString()
          .split("T")[0],
        status:
          booking.bookingroomStatus === "confirmed" ? "completed" : "pending",
        total: booking.bookingtotalMoney,
        image: `https://picsum.photos/id/${parseInt(booking.id?.slice(-3) || "100") % 300}/400/300`,
        nights: Math.ceil(
          (booking.bookingcheckout - booking.bookingcheckin) / 86400,
        ),
        customer: {
          name: booking.bookingcustomer,
          email: booking.bookingcustomer,
        },
      }));

      setBookings(formatted);
      setIsLoaded(true);
    };

    loadProfile();
  }, []);

  // Load coupons from masterdata
  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const response = await fetch("/api/masterdata");
        const data = await response.json();
        const couponList = (data.Coupon ?? []).map((coupon: any) => {
          const promo = (data.Promo ?? []).find(
            (p: any) => p.PromoID === coupon.PromoID,
          );
          return {
            code: coupon.CouponCode,
            name: promo?.PromoName || "Ưu đãi đặc biệt",
            expiry: promo?.EndDate || "2026-12-31",
            desc:
              promo?.Description ||
              "Giảm giá đặc biệt cho khách hàng thân thiết",
          };
        });
        setCoupons(couponList);
      } catch (error) {
        console.error("Error loading coupons:", error);
      }
    };

    loadCoupons();
  }, []);

  //sort và filter bookings theo searchTerm và sortOption
  const filteredAndSortedBookings = useMemo(() => {
    let result = [...bookings];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.roomName.toLowerCase().includes(term) ||
          b.id.toLowerCase().includes(term),
      );
    }
    switch (sortOption) {
      case "date_asc":
        result.sort(
          (a, b) =>
            new Date(a.checkin).getTime() - new Date(b.checkin).getTime(),
        );
        break;
      case "date_desc":
        result.sort(
          (a, b) =>
            new Date(b.checkin).getTime() - new Date(a.checkin).getTime(),
        );
        break;
      case "price_asc":
        result.sort((a, b) => a.total - b.total);
        break;
      case "price_desc":
        result.sort((a, b) => b.total - a.total);
        break;
    }
    return result;
  }, [bookings, searchTerm, sortOption]);

  //hủy booking, cập nhật cả state và localStorage, đồng thời xóa trên mockAPI nếu có
  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Bạn có chắc muốn hủy đặt phòng này? Tiền sẽ được hoàn lại."))
      return;

    // Cập nhật state & localStorage
    const updatedBookings = bookings.filter((b) => b.id !== bookingId);
    setBookings(updatedBookings);
    localStorage.setItem("user_bookings", JSON.stringify(updatedBookings));

    // Xóa trên mockAPI (nếu có)
    try {
      await fetch(
        `https://69d0c66890cd06523d5d7d21.mockapi.io/booking/${bookingId}`,
        {
          method: "DELETE",
        },
      );
    } catch (error) {
      console.error("Lỗi khi xóa trên mockAPI:", error);
    }

    alert(
      "Đã hủy đặt phòng. Tiền sẽ được hoàn lại trong vòng 3-5 ngày làm việc.",
    );
  };
  // Xóa booking đã diễn ra khỏi lịch sử (không hoàn tiền, chỉ xóa khỏi profile)
  const handleDeleteHistory = async (bookingId: string) => {
    if (!confirm("Bạn có chắc muốn xóa đơn đặt phòng này khỏi lịch sử?"))
      return;

    // Cập nhật state & localStorage
    const updatedBookings = bookings.filter((b) => b.id !== bookingId);
    setBookings(updatedBookings);
    localStorage.setItem("user_bookings", JSON.stringify(updatedBookings));

    // Xóa trên mockAPI (nếu có)
    try {
      await fetch(
        `https://69d0c66890cd06523d5d7d21.mockapi.io/booking/${bookingId}`,
        {
          method: "DELETE",
        },
      );
    } catch (error) {
      console.error("Lỗi khi xóa trên mockAPI:", error);
    }

    alert("Đã xóa đơn đặt phòng khỏi lịch sử.");
  };

  // Hàm xử lý Logout đồng bộ với Header
  const handleLogout = () => {
    localStorage.removeItem("customer_data");
    sessionStorage.removeItem("customer_data");
    localStorage.removeItem("customer_email");
    localStorage.removeItem("customer_password");
    localStorage.setItem("customer_remember", "false");
    setUser(null);
    window.location.href = "/"; // Dùng window.location để reset toàn bộ trạng thái app
  };

  /** Phần nội dung */
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Bạn chưa đăng nhập
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Vui lòng đăng nhập để xem thông tin cá nhân, quản lý đơn đặt phòng
              và nhận các ưu đãi dành riêng cho thành viên.
            </p>
            <Link
              href="/login"
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold shadow-lg shadow-emerald-200"
            >
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
              <h2 className="text-xl font-bold text-gray-800">
                {user.name || "Khách hàng"}
              </h2>
              <p className="text-sm text-gray-500 mb-6">{user.email}</p>

              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 font-medium border border-emerald-100">
                  <i className="fas fa-history mr-3"></i>Lịch sử đặt phòng
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition font-medium"
                >
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
                  <>
                    {/* Thanh công cụ: search + sort */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <div className="flex-1">
                        <div className="relative">
                          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                          <input
                            type="text"
                            placeholder="Tìm theo tên phòng hoặc mã đơn..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <select
                          value={sortOption}
                          onChange={(e) =>
                            setSortOption(e.target.value as SortOption)
                          }
                          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="date_desc">Mới nhất trước</option>
                          <option value="date_asc">Cũ nhất trước</option>
                          <option value="price_desc">Giá cao → thấp</option>
                          <option value="price_asc">Giá thấp → cao</option>
                        </select>
                      </div>
                    </div>

                    {/* Danh sách booking đã lọc & sort */}
                    <div className="space-y-6">
                      {filteredAndSortedBookings.length === 0 ? (
                        <div className="text-center py-12">
                          <i className="fas fa-calendar-times text-4xl text-gray-300 mb-4"></i>
                          <p className="text-gray-500">
                            {bookings.length === 0
                              ? "Bạn chưa có đơn đặt phòng nào"
                              : "Không tìm thấy đơn đặt phòng nào khớp với từ khóa"}
                          </p>
                          {bookings.length === 0 && (
                            <Link
                              href="/booking"
                              className="inline-block mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                            >
                              Đặt phòng ngay
                            </Link>
                          )}
                        </div>
                      ) : (
                        filteredAndSortedBookings.map((booking) => (
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
                                <h3 className="text-lg font-bold">
                                  {booking.roomName}
                                </h3>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    booking.status === "completed"
                                      ? "bg-blue-100 text-blue-600"
                                      : booking.status === "cancelled"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-yellow-100 text-yellow-600"
                                  }`}
                                >
                                  {booking.status === "completed"
                                    ? "Đã hoàn tất"
                                    : booking.status === "cancelled"
                                      ? "Đã hủy"
                                      : "Chờ nhận phòng"}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">
                                <i className="fas fa-clock mr-2"></i>
                                {booking.checkin} → {booking.checkout}
                                {booking.nights && ` (${booking.nights} đêm)`}
                              </p>
                              <p className="text-lg font-bold text-emerald-600">
                                {formatCurrency(booking.total)}
                              </p>
                              {booking.customer && (
                                <p className="text-sm text-gray-500 mt-1">
                                  <i className="fas fa-user mr-2"></i>
                                  {booking.customer.name ||
                                    booking.customer.email}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col justify-center gap-2">
                              {booking.status === "pending" && (
                                <button
                                  onClick={() =>
                                    handleCancelBooking(booking.id)
                                  }
                                  className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 text-sm font-medium transition"
                                >
                                  Hủy đặt
                                </button>
                              )}
                              {booking.status === "completed" && (
                                <button
                                  onClick={() =>
                                    handleDeleteHistory(booking.id)
                                  }
                                  className="px-4 py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100 text-sm font-medium transition"
                                >
                                  Xóa lịch sử
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coupons.map((promo) => (
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
                        <h3 className="font-bold text-gray-800 mb-1">
                          {promo.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                          {promo.desc}
                        </p>
                        <p className="text-xs text-red-500">
                          Hết hạn: {promo.expiry}
                        </p>
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
