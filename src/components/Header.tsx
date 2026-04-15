// =============================================
// 2. src/components/Header.jsx (đã ghép phiên bản có kiểm tra login)
// =============================================
"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('customer_data') || sessionStorage.getItem('customer_data');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('customer_data');
    sessionStorage.removeItem('customer_data');
    localStorage.removeItem('customer_email');
    localStorage.removeItem('customer_password');
    localStorage.setItem('customer_remember', 'false');
    alert('Đã đăng xuất! Hẹn gặp lại bạn.');
    setUser(null);
    router.push('/');
  };

  const getMenuClass = (path) => {
    const isActive = pathname === path;
    return `transition font-medium ${isActive ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' : 'text-gray-600 hover:text-emerald-600'}`;
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-tree text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">LORTEL</h1>
            <p className="text-xs text-gray-500">Resort & Spa</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8">
          <Link href="/" className={getMenuClass('/')}>Trang chủ</Link>
          <Link href="/booking" className={getMenuClass('/booking')}>Đặt phòng</Link>
<<<<<<< HEAD
          <Link href="/profile" className={getMenuClass('/profile')}>Của tôi</Link>
=======
          <Link href="/promotions" className={getMenuClass('/promotions')}>Khuyến mãi</Link>
          <Link href="/contact" className={getMenuClass('/contact')}>Liên hệ</Link>
>>>>>>> 4a5421c5e6104420f479299418cc74aa944a9ffa
        </nav>

        {/* User actions */}
        <div className="flex gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-emerald-600"></i>
                </div>
                <span className="text-gray-700 font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-red-600 hover:text-red-700 transition flex items-center gap-1 font-medium"
              >
                <i className="fas fa-sign-out-alt"></i> Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-emerald-600 transition">
                <i className="fas fa-user mr-2"></i>Đăng nhập
              </Link>
              <Link href="/login" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
                <i className="fas fa-user-plus mr-2"></i>Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}