// src/app/booking/page.tsx
"use client";

import { useState, useEffect, useMemo, useRef, FormEvent } from "react";
import Header from "./../../components/Header";
import Footer from "./../../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import infraData from "../../data/infrastructuredata.json";
import { useModal } from "../../hooks/useModal";

const generateRoomImages = (roomId: number): string[] => {
  // Xử lý roomId không hợp lệ (null, undefined, 0)
  const seed = (typeof roomId === 'number' && roomId > 0) ? roomId : 1;

  // Hàm tạo số ngẫu nhiên giả (PRNG) từ seed
  const mulberry32 = (a: number) => {
    return () => {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t >>> 14;
      return (t >>> 0) / 4294967296;
    };
  };

  const rng = mulberry32(seed);
  const ids = new Set<number>();

  // Tạo 3 ID khác nhau, từ 1 đến 1000
  while (ids.size < 3) {
    const id = Math.floor(rng() * 1000) + 1; // 1..1000
    ids.add(id);
  }

  return Array.from(ids).map(id => `https://picsum.photos/id/${id}/800/500`);
};

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

  const detailModal = useModal<any>(null);
  const branchDetailModal = useModal<any>(null);
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

    // Load rooms from infrastructuredata.json
    const loadRooms = async () => {
      try {
        // Use infrastructure data directly
        const roomTypes = infraData.RoomType ?? [];
        const roomStatuses = infraData.RoomStatus ?? [];
        const amenities = infraData.Amenity ?? [];
        const roomAmenities = infraData.RoomAmenity ?? [];

        const roomList = infraData.Room.map((room: any) => {
          const roomType = roomTypes.find((type: any) => type.RoomTypeID === room.RoomTypeID);
          const roomStatus = roomStatuses.find((status: any) => status.StatusID === room.StatusID);

          // Get amenities for this room
          const roomAmenityList = roomAmenities
            .filter((ra: any) => ra.RoomID === room.RoomID)
            .map((ra: any) => {
              const amenity = amenities.find((a: any) => a.AmenityID === ra.AmenityID);
              return amenity?.Name.toLowerCase() || 'unknown';
            });

          return {
            id: room.RoomID,
            number: room.RoomNumber,
            name: roomType?.TypeName || 'Standard Room',
            type: roomType?.TypeName || 'Standard',
            price: Math.round((roomType?.StandardRate || 100) * 10000),
            area: roomType?.BaseCapacity * 15 || 25,
            capacity: roomType?.BaseCapacity || 2,
            floor: infraData.Floor?.find((f: any) => f.FloorID === room.FloorID)?.FloorNumber || 1,
            rating: 4.5,
            reviewCount: Math.floor(Math.random() * 200) + 50,
            status: roomStatus?.StatusName === 'Available' ? 'available' : 'unavailable',
            images: generateRoomImages(room.RoomID),
            amenities: roomAmenityList,
            description: roomType?.Description || 'Phòng nghỉ dưỡng thoải mái với đầy đủ tiện nghi.'
          };
        });
        setRooms(roomList);

        // Load branches with floor and room data
        const branchList = infraData.Branch.map((branch: any) => {
          // Get buildings and floors for this branch
          const branchBuildings = infraData.Building.filter((building: any) => building.BranchID === branch.BranchID);
          const branchFloors = infraData.Floor.filter((floor: any) =>
            branchBuildings.some((building: any) => building.BuildingID === floor.BuildingID)
          );

          // Get rooms for this branch
          const branchRooms = infraData.Room.filter((room: any) =>
            branchFloors.some((floor: any) => floor.FloorID === room.FloorID)
          );

          return {
            id: branch.BranchID,
            name: branch.BranchName,
            address: branch.Address,
            city: branch.City,
            description: `Tọa lạc tại vị trí đắc địa ${branch.Address}, ${branch.City}, chi nhánh này mang đến trải nghiệm lưu trú thượng lưu với thiết kế hiện đại pha lẫn nét cổ điển.`,
            rating: 4.8,
            reviewCount: 1200,
            totalFloors: branchFloors.length,
            totalRooms: branchRooms.length
          };
        });
        setBranches(branchList);

        // Load services from infrastructure data
        const serviceCategories = infraData.ServiceCategory ?? [];
        const serviceItems = infraData.ServiceItem ?? [];
        const serviceList = serviceItems.map((item: any) => {
          const category = serviceCategories.find((cat: any) => cat.CatID === item.CategoryID);
          return {
            id: item.ItemID,
            name: item.ItemName,
            category: category?.Name || 'Dịch vụ',
            price: Math.round(50000), // Default price since not in data
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
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      // Load coordinates for the branch
      const coords = await fetchBranchCoordinates(`${branch.address}, ${branch.city}`);
      setBranchCoordinates(coords);
      branchDetailModal.open({ ...branch, coordinates: coords });
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

  const handleAddToCart = (selectedRoom?: any) => {
    const roomToAdd = selectedRoom ?? bookingRoom;
    if (!roomToAdd) return;

    const nights = calculateNights(checkin, checkout);
    let total = roomToAdd.price * nights;
    let discount = 0;

    if (appliedPromo) {
      if (appliedPromo.type === "percent") discount = total * appliedPromo.value / 100;
      else discount = appliedPromo.value;
      total -= discount;
    }

    const newItem = {
      id: Date.now(),
      room: roomToAdd,
      checkin,
      checkout,
      nights,
      customer: { ...bookingForm },
      promo: appliedPromo,
      total
    };

    setCart(prev => [...prev, newItem]);
    showToast(`Đã thêm ${roomToAdd.name} vào giỏ hàng`, "success");
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
                  <button onClick={() => detailModal.open(room)} className="flex-1 border border-emerald-600 text-emerald-600 py-2 rounded-lg hover:bg-emerald-50 font-medium">Chi tiết</button>
                  <button onClick={() => handleAddToCart(room)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 font-medium">Đặt ngay</button>
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
          <button onClick={() => {
            // Save bookings to localStorage for profile page
            const existingBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
            const newBookings = cart.map((item, index) => ({
              id: `BK${Date.now() + index}`,
              roomName: item.room.name,
              checkin: item.checkin,
              checkout: item.checkout,
              status: "pending", // New bookings start as pending
              total: item.total,
              image: item.room.images[0],
              nights: item.nights,
              customer: item.customer,
              promo: item.promo
            }));

            const updatedBookings = [...existingBookings, ...newBookings];
            localStorage.setItem('user_bookings', JSON.stringify(updatedBookings));

            showToast("Thanh toán thành công!", "success");
            setCart([]);
            setIsCartOpen(false);
          }} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700">Thanh toán ngay</button>
        </div>
      </div>

      {/* DETAIL MODAL + BOOKING MODAL + TOAST */}

      {detailModal.isOpen && detailModal.payload && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-4xl bg-white shadow-2xl">
            <button onClick={detailModal.close} className="absolute right-4 top-4 z-10 rounded-full bg-white p-3 text-gray-700 shadow-sm hover:bg-gray-100">
              <i className="fas fa-times"></i>
            </button>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="relative h-96 bg-gray-100">
                <img src={detailModal.payload.images?.[0]} alt={detailModal.payload.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-8 flex flex-col justify-between gap-6">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-emerald-600">Chi tiết phòng</span>
                  <h2 className="mt-3 text-3xl font-black text-gray-900">{detailModal.payload.name}</h2>
                  <p className="text-sm text-gray-500 mt-2">Phòng {detailModal.payload.number} | Tầng {detailModal.payload.floor}</p>
                </div>

                <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 p-4">
                    <div className="text-xs uppercase text-gray-400">Giá mỗi đêm</div>
                    <div className="mt-2 text-xl font-bold text-emerald-600">{formatCurrency(detailModal.payload.price)}</div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 p-4">
                    <div className="text-xs uppercase text-gray-400">Sức chứa</div>
                    <div className="mt-2 text-xl font-bold">{detailModal.payload.capacity} khách</div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 p-4">
                    <div className="text-xs uppercase text-gray-400">Diện tích</div>
                    <div className="mt-2 text-xl font-bold">{detailModal.payload.area} m²</div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 p-4">
                    <div className="text-xs uppercase text-gray-400">Đánh giá</div>
                    <div className="mt-2 text-xl font-bold">{detailModal.payload.rating} ⭐</div>
                  </div>
                </div>

                <p className="text-gray-600 leading-7">{detailModal.payload.description}</p>

                <div className="flex flex-wrap gap-2">
                  {Array.isArray(detailModal.payload.amenities) && detailModal.payload.amenities.map((amenity: string) => (
                    <span key={amenity} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs uppercase tracking-[0.08em] text-gray-600">
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => { handleAddToCart(detailModal.payload); detailModal.close(); }} className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold uppercase text-white transition hover:bg-emerald-700">
                    Đặt ngay
                  </button>
                  <button onClick={detailModal.close} className="w-full rounded-2xl border border-gray-300 bg-white py-3 text-sm font-semibold uppercase text-gray-700 transition hover:bg-gray-50">
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {branchDetailModal.isOpen && branchDetailModal.payload && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={branchDetailModal.close} className="absolute right-4 top-4 z-10 rounded-full bg-white p-3 text-gray-700 shadow-sm hover:bg-gray-100">
              <i className="fas fa-times"></i>
            </button>
            <div className="p-8">
              <div className="text-center mb-8">
                <span className="text-xs uppercase tracking-[0.2em] text-emerald-600">Chi tiết chi nhánh</span>
                <h2 className="mt-3 text-4xl font-black text-gray-900">{branchDetailModal.payload.name}</h2>
                <p className="text-lg text-gray-600 mt-2">{branchDetailModal.payload.address}, {branchDetailModal.payload.city}</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="rounded-2xl border border-gray-200 p-6 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{branchDetailModal.payload.totalFloors}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">Tầng</div>
                </div>
                <div className="rounded-2xl border border-gray-200 p-6 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{branchDetailModal.payload.totalRooms}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">Phòng</div>
                </div>
                <div className="rounded-2xl border border-gray-200 p-6 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{branchDetailModal.payload.rating}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">Đánh giá</div>
                </div>
                <div className="rounded-2xl border border-gray-200 p-6 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{branchDetailModal.payload.reviewCount}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">Lượt đánh giá</div>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="text-xl font-bold mb-4">Mô tả</h3>
                  <p className="text-gray-600 leading-7 mb-6">{branchDetailModal.payload.description}</p>

                  <h3 className="text-xl font-bold mb-4">Vị trí trên bản đồ</h3>
                  <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
                    {branchDetailModal.payload.coordinates ? (
                      <iframe
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${branchDetailModal.payload.coordinates[1] - 0.01},${branchDetailModal.payload.coordinates[0] - 0.01},${branchDetailModal.payload.coordinates[1] + 0.01},${branchDetailModal.payload.coordinates[0] + 0.01}&layer=mapnik&marker=${branchDetailModal.payload.coordinates[0]},${branchDetailModal.payload.coordinates[1]}`}
                        className="w-full h-full border-0"
                        title="Branch Location"
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm italic">
                        Đang tải bản đồ...
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Danh sách phòng mẫu</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {rooms.slice(0, 6).map((room: any) => (
                      <div key={room.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                        <img src={room.images[0]} alt={room.name} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{room.name}</h4>
                          <p className="text-sm text-gray-500">Phòng {room.number} • {room.capacity} khách</p>
                          <p className="text-emerald-600 font-bold">{formatCurrency(room.price)}/đêm</p>
                        </div>
                        <button
                          onClick={() => { handleAddToCart(room); branchDetailModal.close(); }}
                          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700"
                        >
                          Đặt ngay
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button onClick={branchDetailModal.close} className="px-8 py-3 border border-gray-300 bg-white text-gray-700 rounded-2xl hover:bg-gray-50 font-semibold">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.visible && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl text-white shadow-2xl z-200 ${toast.type === "error" ? "bg-red-500" : "bg-emerald-600"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}