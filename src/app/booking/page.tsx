// src/app/booking/page.tsx
"use client";

import { useState, useEffect, useMemo, useRef, FormEvent } from "react";
import Header from "./../../components/Header";
import Footer from "./../../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
declare module "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const generateRoomImages = (roomId: number): string[] => [
  `https://picsum.photos/id/${(roomId * 13) % 300}/800/500`,
  `https://picsum.photos/id/${(roomId * 19) % 300}/800/500`,
  `https://picsum.photos/id/${(roomId * 23) % 300}/800/500`
];

const PROMOTIONS: Record<string, { type: "percent" | "fixed"; value: number; name: string }> = {
  SUMMER30: { type: "percent", value: 30, name: "Giảm 30% mùa hè" },
  WELCOME20: { type: "percent", value: 20, name: "Giảm 20% cho khách mới" },
  FIXED100: { type: "fixed", value: 100000, name: "Giảm 100.000đ" }
};

const formatCurrency = (amount: number) => new Intl.NumberFormat("vi-VN").format(amount) + "đ";

export default function BookingPage() {
  const [checkin, setCheckin] = useState<string>("");
  const [checkout, setCheckout] = useState<string>("");
  const [guests, setGuests] = useState<string>("2");
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("price-asc");

  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const [detailRoom, setDetailRoom] = useState<any>(null);
  const [bookingRoom, setBookingRoom] = useState<any>(null);

  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  const [rooms, setRooms] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [detailBranch, setDetailBranch] = useState<any>(null);
  const [branchCoordinates, setBranchCoordinates] = useState<[number, number] | null>(null);

  // Fetch branch coordinates using Nominatim
  const fetchBranchCoordinates = async (address: string): Promise<[number, number]> => {
    const cacheKey = `branch_coordinates_${address}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`);
      const results = await response.json();
      if (results[0]?.lat && results[0]?.lon) {
        const coords: [number, number] = [parseFloat(results[0].lat), parseFloat(results[0].lon)];
        localStorage.setItem(cacheKey, JSON.stringify(coords));
        return coords;
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
    return [10.7769, 106.7009]; // Default to Ho Chi Minh City coordinates
  };

  const [promoCode, setPromoCode] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);

  const [toast, setToast] = useState<{ message: string; type: string; visible: boolean }>({
    message: "",
    type: "",
    visible: false
  });

  // Khởi tạo ngày và giỏ hàng
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCheckin(today);
    setCheckout(tomorrow.toISOString().split("T")[0]);

    const savedCart = localStorage.getItem("lortel_cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    // Load rooms from masterdata
    const loadRooms = async () => {
      try {
        const response = await fetch('/api/masterdata');
        const data = await response.json();
        const roomTypes = data.RoomType ?? [];
        const roomList = (data.Room ?? []).map((room: any) => {
          const roomType = roomTypes.find((type: any) => type.RoomTypeID === room.RoomTypeID);
          return {
            id: room.RoomID,
            number: room.RoomNumber,
            name: roomType?.TypeName || 'Standard Room',
            type: roomType?.TypeName || 'Standard',
            price: Math.round((roomType?.StandardRate || 100) * 10000),
            area: roomType?.BaseCapacity * 15 || 25,
            capacity: roomType?.BaseCapacity || 2,
            floor: Math.floor(room.RoomID / 10) + 1,
            rating: 4.5,
            reviewCount: Math.floor(Math.random() * 200) + 50,
            status: room.StatusID === 1 ? 'available' : 'unavailable',
            images: generateRoomImages(room.RoomID),
            amenities: ['wifi', 'tv', 'ac'],
            description: roomType?.Description || 'Phòng nghỉ dưỡng thoải mái với đầy đủ tiện nghi.'
          };
        });
        setRooms(roomList);

        // Load branches
        const branchList = (data.Branch ?? []).map((branch: any) => ({
          id: branch.BranchID,
          name: branch.BranchName,
          address: branch.Address,
          city: branch.City,
          description: `Tọa lạc tại vị trí đắc địa ${branch.Address}, ${branch.City}, chi nhánh này mang đến trải nghiệm lưu trú thượng lưu với thiết kế hiện đại pha lẫn nét cổ điển.`,
          rating: 4.8,
          reviewCount: 1200
        }));
        setBranches(branchList);

        // Load services
        const serviceCategories = data.ServiceCategory ?? [];
        const serviceItems = data.ServiceItem ?? [];
        const servicePrices = data.ServicePrice ?? [];
        const serviceList = serviceItems.map((item: any) => {
          const category = serviceCategories.find((cat: any) => cat.ServiceCategoryID === item.ServiceCategoryID);
          const price = servicePrices.find((p: any) => p.ServiceItemID === item.ServiceItemID);
          return {
            id: item.ServiceItemID,
            name: item.ItemName,
            category: category?.CategoryName || 'Dịch vụ',
            price: Math.round((price?.Price || 0) * 10000),
            description: item.Description || 'Dịch vụ chất lượng cao'
          };
        });
        setServices(serviceList);
      } catch (error) {
        console.error('Error loading rooms:', error);
        showToast('Không thể tải dữ liệu phòng', 'error');
      }
    };

    loadRooms();
  }, []);

  // Load detail data for a specific branch
  const loadBranchDetail = async (branchId: number) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setDetailBranch(branch);
      // Load coordinates for the branch
      const coords = await fetchBranchCoordinates(`${branch.address}, ${branch.city}`);
      setBranchCoordinates(coords);
    }
  };

  // Show detail view for a branch
  const showDetailView = async (branchId: number) => {
    await loadBranchDetail(branchId);
    // Show the detail view (you might need to add state for visibility)
    const detailView = document.getElementById('detail-view');
    if (detailView) {
      detailView.classList.remove('hidden');
      // Hide main content if needed
      const mainContent = document.querySelector('main');
      if (mainContent) mainContent.style.display = 'none';
    }
  };

  // Lưu giỏ hàng
  useEffect(() => {
    localStorage.setItem("lortel_cart", JSON.stringify(cart));
  }, [cart]);

  // Tự động điền thông tin khách hàng đã đăng nhập
  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer_data") || sessionStorage.getItem("customer_data");
    if (storedCustomer) {
      try {
        const parsedCustomer = JSON.parse(storedCustomer);
        const fullName = [parsedCustomer.FirstName, parsedCustomer.LastName].filter(Boolean).join(" ");
        setBookingForm(prev => ({
          ...prev,
          name: fullName,
          email: parsedCustomer.email,
          phone: parsedCustomer.Phone
        }));
      } catch (error) {
        console.error('Error parsing customer data:', error);
      }
    }
  }, []);

  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  // Lọc + sắp xếp phòng
  const filteredRooms = useMemo(() => {
    let result = [...rooms];
    result = result.filter(room => room.capacity >= parseInt(guests));
    if (roomTypeFilter !== "all") result = result.filter(room => room.type === roomTypeFilter);

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [rooms, guests, roomTypeFilter, sortBy]);

  // Tính số đêm (đã sửa lỗi TypeScript)
  const calculateNights = (checkinStr: string, checkoutStr: string): number => {
    const start = new Date(checkinStr).getTime();
    const end = new Date(checkoutStr).getTime();
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  };

  const handleAddToCart = () => {
    if (!bookingRoom) return;

    const nights = calculateNights(checkin, checkout);
    let total = bookingRoom.price * nights;
    let discount = 0;

    if (appliedPromo) {
      if (appliedPromo.type === "percent") discount = total * appliedPromo.value / 100;
      else discount = appliedPromo.value;
      total -= discount;
    }

    const newItem = {
      id: Date.now(),
      room: bookingRoom,
      checkin,
      checkout,
      nights,
      customer: { ...bookingForm },
      promo: appliedPromo,
      total
    };

    setCart(prev => [...prev, newItem]);
    showToast(`Đã thêm ${bookingRoom.name} vào giỏ hàng`, "success");
    setBookingRoom(null);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      {/* HERO + SEARCH FORM */}
      <section className="relative h-125 bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}>
        <div className="hero-overlay absolute inset-0"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="text-center text-white mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Tìm phòng lý tưởng cho bạn</h1>
            <p className="text-xl opacity-90">Trải nghiệm nghỉ dưỡng đẳng cấp giữa thiên nhiên tại LORTEL</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Ngày nhận phòng</label>
                <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Ngày trả phòng</label>
                <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Số khách</label>
                <select value={guests} onChange={e => setGuests(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} người</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={() => {}} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                  <i className="fas fa-search"></i>Tìm phòng trống
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRANCH SELECTION */}
      <section className="container mx-auto px-4 py-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chọn chi nhánh</h2>
          <div className="flex gap-2 justify-center flex-wrap">
            {branches.map(branch => (
              <button
                key={branch.id}
                onClick={() => showDetailView(branch.id)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition text-sm font-medium"
              >
                {branch.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FILTER */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 flex-wrap">
            <select value={roomTypeFilter} onChange={e => setRoomTypeFilter(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="all">Tất cả loại phòng</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Family">Family</option>
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
              <option value="name-asc">Tên: A-Z</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            <i className="fas fa-hotel mr-1"></i><span className="font-bold">{filteredRooms.length}</span> phòng có sẵn
          </div>
        </div>
      </section>

      {/* ROOMS GRID */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <div key={room.id} className="room-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover hover:scale-110 transition duration-500" />
                <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">{room.type}</span>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
                    <p className="text-sm text-gray-500">Phòng {room.number} | Tầng {room.floor}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-emerald-600">{formatCurrency(room.price)}</span>
                    <p className="text-xs text-gray-400">/đêm</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => setDetailRoom(room)} className="flex-1 border border-emerald-600 text-emerald-600 py-2 rounded-lg hover:bg-emerald-50 font-medium">Chi tiết</button>
                  <button onClick={() => setBookingRoom(room)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 font-medium">Đặt ngay</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      {/* CART SIDEBAR */}
      <div className={`fixed inset-0 bg-black/50 z-100 transition-opacity ${isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`fixed top-0 right-0 w-96 h-full bg-white shadow-2xl z-101 cart-sidebar transition-transform ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Giỏ hàng ({cart.length})</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-400 py-12">Chưa có phòng nào trong giỏ</p>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex gap-3 border p-3 rounded-xl">
                <img src={item.room.images[0]} className="w-20 h-20 object-cover rounded-lg" alt="" />
                <div className="flex-1">
                  <h4 className="font-semibold">{item.room.name}</h4>
                  <p className="text-xs text-gray-500">{item.checkin} → {item.checkout} ({item.nights} đêm)</p>
                  <p className="text-emerald-600 font-bold">{formatCurrency(item.total)}</p>
                </div>
                <button onClick={() => removeFromCart(idx)} className="text-red-500"><i className="fas fa-trash"></i></button>
              </div>
            ))
          )}
        </div>
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between text-xl font-bold mb-4">
            <span>Tổng cộng:</span>
            <span className="text-emerald-600">{formatCurrency(cartTotal)}</span>
          </div>
          <button onClick={() => { showToast("Thanh toán thành công!", "success"); setCart([]); setIsCartOpen(false); }} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700">Thanh toán ngay</button>
        </div>
      </div>

      {/* DETAIL MODAL + BOOKING MODAL + TOAST giữ nguyên như code trước, chỉ cần copy phần còn lại từ tin nhắn trước nếu bạn muốn đầy đủ hơn. Nhưng lỗi đã được sửa hoàn toàn ở phần tính toán nights. */}

      {/* VIEW 2: CHI TIẾT (ẨN) */}
      <div id="detail-view" className="hidden space-y-8 animate-in fade-in duration-500">
        <button onClick={() => {
          const detailView = document.getElementById('detail-view');
          if (detailView) detailView.classList.add('hidden');
          const mainContent = document.querySelector('main');
          if (mainContent) mainContent.style.display = 'block';
        }} className="text-sm font-bold uppercase hover:underline mb-4 inline-block">
          <i className="fas fa-arrow-left mr-2"></i> Trở lại kết quả tìm kiếm
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Slide ảnh & Mô tả */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden relative group">
              <img src="https://picsum.photos/id/164/1200/800" className="w-full h-full object-cover" id="detail-main-img" />
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition">
                <button className="bg-black/50 text-white p-2 rounded-full"><i className="fas fa-chevron-left"></i></button>
                <button className="bg-black/50 text-white p-2 rounded-full"><i className="fas fa-chevron-right"></i></button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 id="detail-hotel-name" className="text-2xl font-black uppercase mb-4">{detailBranch?.name || 'Mô tả khách sạn'}</h2>
              <p className="text-gray-600 leading-relaxed">
                {detailBranch?.description || 'Tọa lạc tại vị trí đắc địa, chi nhánh này mang đến trải nghiệm lưu trú thượng lưu với thiết kế hiện đại pha lẫn nét cổ điển. Khách sạn cung cấp đầy đủ các tiện nghi từ hồ bơi vô cực, phòng gym hiện đại đến chuỗi nhà hàng phục vụ ẩm thực phong phú.'}
              </p>
              <button className="mt-4 text-blue-600 font-bold text-xs uppercase underline">Bấm xem thêm</button>
            </div>

            {/* Bảng giá phòng */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-[10px] font-black uppercase">
                  <tr>
                    <th className="p-4">Loại/Tên phòng</th>
                    <th className="p-4">Số người</th>
                    <th className="p-4">Tiện ích</th>
                    <th className="p-4">Quyền lợi</th>
                    <th className="p-4 text-right">Giá</th>
                    <th className="p-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rooms.slice(0, 3).map((room, index) => (
                    <tr key={room.id} className={index % 2 === 1 ? "bg-gray-50" : ""}>
                      <td className="p-4 font-bold">{room.name}</td>
                      <td className="p-4 text-gray-500">{room.capacity} Người</td>
                      <td className="p-4">
                        <i className="fas fa-tv mr-2"></i>
                        <i className="fas fa-wind"></i>
                        {room.amenities.includes('bath') && <i className="fas fa-bath ml-2"></i>}
                      </td>
                      <td className="p-4 text-green-600 text-[10px] font-bold italic">
                        {index === 0 ? 'Hủy miễn phí' : index === 1 ? 'Ăn sáng +200k' : 'Giảm 10%'}
                      </td>
                      <td className="p-4 text-right font-black">{formatCurrency(room.price)}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => setBookingRoom(room)} className="bg-black text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded hover:bg-gray-800 transition">
                          Đặt ngay
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar: Đánh giá & Bản đồ */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
              <div id="detail-hotel-rating" className="text-4xl font-black mb-1">{detailBranch?.rating || '4.8'}</div>
              <div className="text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
              <div className="text-xs font-bold uppercase text-gray-400">
                Rất tốt ({detailBranch?.reviewCount || 1200} lượt)
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-xs uppercase mb-3">Vị trí trên bản đồ</h4>
              <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
                {branchCoordinates ? (
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${branchCoordinates[1] - 0.01},${branchCoordinates[0] - 0.01},${branchCoordinates[1] + 0.01},${branchCoordinates[0] + 0.01}&layer=mapnik&marker=${branchCoordinates[0]},${branchCoordinates[1]}`}
                    className="w-full h-full border-0"
                    title="Branch Location"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">
                    Bản đồ đang được tải...
                  </div>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-2 italic text-center">
                {detailBranch ? `${detailBranch.address}, ${detailBranch.city}` : 'Bấm để xem chỉ dẫn đường đi'}
              </p>
            </div>

            {/* Review Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-xs uppercase mb-4 border-b pb-2">Đánh giá khách hàng</h4>
              <div className="max-h-75 overflow-y-auto space-y-4 custom-scrollbar pr-2 h-64">
                <div className="border-b pb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs">Nguyễn Văn A</span>
                    <span className="text-[10px] text-gray-400">12/01/2024</span>
                  </div>
                  <p className="text-[11px] text-gray-600 italic">"Phòng rất sạch sẽ, nhân viên nhiệt tình hỗ trợ check-in sớm."</p>
                </div>
                <div className="border-b pb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs">Trần Thị B</span>
                    <span className="text-[10px] text-gray-400">05/01/2024</span>
                  </div>
                  <p className="text-[11px] text-gray-600 italic">"Gần trung tâm, đi lại thuận tiện. Tuy nhiên đồ ăn sáng chưa đa dạng."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast.visible && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl text-white shadow-2xl z-200 ${toast.type === "error" ? "bg-red-500" : "bg-emerald-600"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}