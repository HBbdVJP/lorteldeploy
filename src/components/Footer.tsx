// src/components/Footer.jsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-tree text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold">LORTEL</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Resort & Spa cao cấp giữa lòng thiên nhiên, mang đến trải nghiệm nghỉ dưỡng đẳng cấp.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><i className="fas fa-map-marker-alt w-5"></i> 123 Lê Thánh Tôn, Quận 1</li>
              <li><i className="fas fa-phone w-5"></i> 1900 1234</li>
              <li><i className="fas fa-envelope w-5"></i> info@lortel.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="#about" className="hover:text-emerald-400">Về chúng tôi</Link></li>
              <li><Link href="#rooms" className="hover:text-emerald-400">Đặt phòng</Link></li>
              <li><Link href="#promotions" className="hover:text-emerald-400">Khuyến mãi</Link></li>
              <li><Link href="#contact" className="hover:text-emerald-400">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Kết nối</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 LORTEL Resort. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}   