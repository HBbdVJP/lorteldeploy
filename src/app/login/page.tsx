// src/app/login/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Modal Đăng ký
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regData, setRegData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  // Toast
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  // Dữ liệu mẫu (giống hệt file HTML cũ)
  const adminAccounts = [
    { name: "Quản trị viên", email: "admin@lortel.com", password: "admin123", role: "admin" },
    { name: "Lễ tân", email: "letan@lortel.com", password: "letan123", role: "receptionist" },
  ];

  const [customerAccounts, setCustomerAccounts] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "khachhang@lortel.com", password: "khachhang123", phone: "0901123456", role: "customer" },
    { id: 2, name: "Trần Thị B", email: "vip@lortel.com", password: "vip123", phone: "0902123456", role: "customer" },
  ]);

  // Load thông tin đã ghi nhớ
  useEffect(() => {
    const savedEmail = localStorage.getItem("customer_email") || localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("customer_password") || localStorage.getItem("savedPassword");
    const isRemembered = localStorage.getItem("customer_remember") === "true" || localStorage.getItem("rememberMe") === "true";

    if (isRemembered && savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // Kiểm tra đã đăng nhập chưa
  useEffect(() => {
    const customerData = localStorage.getItem("customer_data") || sessionStorage.getItem("customer_data");
    const adminData = localStorage.getItem("admin_data") || sessionStorage.getItem("admin_data");

    if (customerData) router.replace("/");
    else if (adminData) router.replace("/admin");
  }, [router]);

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return showToast("Vui lòng nhập đầy đủ thông tin", "error");

    setIsLoading(true);

    setTimeout(() => {
      const admin = adminAccounts.find((acc) => acc.email === email && acc.password === password);
      const customer = customerAccounts.find((acc) => acc.email === email && acc.password === password);

      if (admin) {
        const userData = { ...admin, loginTime: new Date() };
        if (rememberMe) {
          localStorage.setItem("admin_data", JSON.stringify(userData));
          localStorage.setItem("savedEmail", email);
          localStorage.setItem("savedPassword", password);
          localStorage.setItem("rememberMe", "true");
        } else {
          sessionStorage.setItem("admin_data", JSON.stringify(userData));
          localStorage.setItem("rememberMe", "false");
        }
        showToast(`Đăng nhập Nội bộ: Chào mừng ${admin.name}!`);
        setTimeout(() => router.push("/admin"), 1000);
      } else if (customer) {
        const userData = { ...customer, loginTime: new Date() };
        if (rememberMe) {
          localStorage.setItem("customer_data", JSON.stringify(userData));
          localStorage.setItem("customer_email", email);
          localStorage.setItem("customer_password", password);
          localStorage.setItem("customer_remember", "true");
        } else {
          sessionStorage.setItem("customer_data", JSON.stringify(userData));
          localStorage.setItem("customer_remember", "false");
        }
        showToast(`Chào mừng ${customer.name} quay trở lại!`);
        setTimeout(() => router.push("/"), 1000);
      } else {
        showToast("Email hoặc mật khẩu không đúng", "error");
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setIsLoading(false);
      }
    }, 800);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regData.name || !regData.email || !regData.password) return showToast("Vui lòng điền đầy đủ", "error");
    if (regData.password !== regData.confirm) return showToast("Mật khẩu không khớp", "error");
    if (regData.password.length < 6) return showToast("Mật khẩu phải có ít nhất 6 ký tự", "error");

    if (customerAccounts.some((acc) => acc.email === regData.email) || adminAccounts.some((acc) => acc.email === regData.email)) {
      return showToast("Email đã được đăng ký", "error");
    }

    const newCustomer = {
      id: Date.now(),
      name: regData.name,
      email: regData.email,
      password: regData.password,
      phone: regData.phone,
      role: "customer",
    };

    setCustomerAccounts((prev) => [...prev, newCustomer]);
    showToast("Đăng ký thành công! Hãy đăng nhập.", "success");

    setIsModalOpen(false);
    setEmail(regData.email);
    setPassword(regData.password);
    setRegData({ name: "", email: "", phone: "", password: "", confirm: "" });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    showToast("Vui lòng liên hệ hotline: 1900 1234 để được hỗ trợ", "info");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0f172a]">
      <div className="bg-pattern"></div>

      {/* Floating decoration */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }}></div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Cột trái - Branding */}
          <div className="text-white space-y-8 hidden md:block animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-crown text-white text-2xl"></i>
              </div>
              <div>
                <h1 className="text-4xl font-bold">LORTEL</h1>
                <p className="text-white/70 text-sm">Khách sạn & Nghỉ dưỡng cao cấp</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Chào mừng đến với<br />
              <span className="text-emerald-400">LORTEL</span>
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Đăng nhập để trải nghiệm dịch vụ đặt phòng trực tuyến,<br />
              theo dõi lịch sử đặt phòng và nhận ưu đãi độc quyền.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-bed text-emerald-400 text-sm"></i>
                </div>
                <span className="text-white/90">Đặt phòng nhanh chóng, tiện lợi</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-tags text-emerald-400 text-sm"></i>
                </div>
                <span className="text-white/90">Ưu đãi đặc biệt cho thành viên</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-headset text-emerald-400 text-sm"></i>
                </div>
                <span className="text-white/90">Hỗ trợ 24/7 từ đội ngũ chuyên nghiệp</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-line text-emerald-400 text-sm"></i>
                </div>
                <span className="text-white/90">Theo dõi lịch sử và quản lý đặt phòng</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-400">500+</div>
                <div className="text-white/60 text-xs">Phòng nghỉ</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">10k+</div>
                <div className="text-white/60 text-xs">Khách hàng</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">98%</div>
                <div className="text-white/60 text-xs">Hài lòng</div>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className={`login-card rounded-2xl p-8 animate-slide-up ${isShaking ? "animate-shake" : ""}`}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-circle text-emerald-600 text-3xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Đăng nhập hệ thống</h2>
              <p className="text-gray-500 text-sm mt-1">Dành cho Khách hàng & Quản trị viên</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="input-group relative">
                  <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                    placeholder="Nhập email của bạn"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                <div className="input-group relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" onClick={handleForgotPassword} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-login w-full text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i> Đăng nhập
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Chưa có tài khoản?{" "}
                <button onClick={() => setIsModalOpen(true)} className="text-emerald-600 hover:text-emerald-700 font-bold">
                  Đăng ký ngay
                </button>
              </p>
            </div>

            {/* Tài khoản Demo */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-gray-500 text-xs text-center mb-2 font-semibold">
                <i className="fas fa-info-circle mr-1"></i>Tài khoản Demo
              </p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-xs">
                <div className="text-emerald-600 font-semibold col-span-2 border-b pb-1">Khách Hàng</div>
                <div className="text-gray-500">📧 khachhang@lortel.com</div>
                <div className="text-gray-500">🔑 khachhang123</div>
                <div className="text-gray-500">📧 vip@lortel.com</div>
                <div className="text-gray-500">🔑 vip123</div>

                <div className="text-blue-600 font-semibold col-span-2 border-b pb-1 mt-1">Nội bộ (Admin/Lễ tân)</div>
                <div className="text-gray-500">📧 admin@lortel.com</div>
                <div className="text-gray-500">🔑 admin123</div>
                <div className="text-gray-500">📧 letan@lortel.com</div>
                <div className="text-gray-500">🔑 letan123</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Đăng ký */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 relative animate-slide-up">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-user-plus text-emerald-600 text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Đăng ký thành viên</h2>
                <p className="text-gray-500 text-sm">Nhận ưu đãi đặc biệt khi đăng ký hôm nay</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                  <input
                    type="text"
                    required
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                  <input
                    type="password"
                    required
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    required
                    value={regData.confirm}
                    onChange={(e) => setRegData({ ...regData, confirm: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold transition mt-2"
                >
                  Đăng ký ngay
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <div
          className={`fixed bottom-5 right-5 px-6 py-3 rounded-xl text-white shadow-2xl z-[1000] animate-slide-in ${
            toast.type === "error"
              ? "bg-red-500"
              : toast.type === "info"
              ? "bg-blue-500"
              : "bg-emerald-500"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}