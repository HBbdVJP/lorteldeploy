import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export const useAdminDashboard = () => {
  const router = useRouter();
  const BASE_URL = "https://69d0c66890cd06523d5d7d21.mockapi.io";

  async function fetchBookings() {
    try {
      const response = await fetch(`${BASE_URL}/booking`);
      const bookings = await response.json();
      return bookings;
    } catch (error) {
      console.error("Lỗi fetch bookings:", error);
    }
  }

  async function fetchRooms() {
    try {
      const response = await fetch(`${BASE_URL}/room`);
      const rooms = await response.json();
      return rooms;
    } catch (error) {
      console.error("Lỗi fetch rooms:", error);
    }
  }

  function HotelManager() {
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
      const loadData = async () => {
        const roomsData = await fetchRooms();
        const bookingsData = await fetchBookings();

        setRooms(roomsData);
        setBookings(bookingsData);
      };

      loadData();
    }, []);

    // Sử dụng biến rooms và bookings để render giao diện
  }

  // const INIT_BOOKINGS = [
  //     { id: 1, code: "BK001", customer: "Nguyễn Văn A", customerId: 1, room: "Deluxe", roomId: 1, checkin: "2024-03-20", checkout: "2024-03-22", guests: 2, status: "confirmed", total: 2400000, note: "" },
  //     { id: 2, code: "BK002", customer: "Trần Thị B", customerId: 2, room: "Standard", roomId: 2, checkin: "2024-03-21", checkout: "2024-03-23", guests: 2, status: "pending", total: 1700000, note: "" },
  //     { id: 3, code: "BK003", customer: "Lê Văn C", customerId: 3, room: "Suite", roomId: 3, checkin: "2024-03-22", checkout: "2024-03-24", guests: 2, status: "completed", total: 4400000, note: "" },
  // ];

  // const INIT_ROOMS = [
  //     { id: 1, number: "101", name: "Deluxe City View", type: "Deluxe", price: 1200000, area: 35, capacity: 2, status: "available", amenities: ["wifi", "tv", "ac"], desc: "" },
  //     { id: 2, number: "102", name: "Standard Double", type: "Standard", price: 850000, area: 25, capacity: 2, status: "available", amenities: ["wifi", "tv"], desc: "" },
  //     { id: 3, number: "103", name: "Suite Premium", type: "Suite", price: 2200000, area: 50, capacity: 4, status: "occupied", amenities: ["wifi", "tv", "ac", "bath"], desc: "" },
  //     { id: 4, number: "104", name: "Family Room", type: "Family", price: 1800000, area: 45, capacity: 4, status: "maintenance", amenities: ["wifi", "tv", "ac"], desc: "" },
  // ];

  const INIT_CUSTOMERS = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0901123456",
      address: "Hà Nội",
      bookings: 3,
      totalSpent: 5000000,
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@email.com",
      phone: "0902123456",
      address: "TP.HCM",
      bookings: 2,
      totalSpent: 3000000,
      joinDate: "2024-02-10",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@email.com",
      phone: "0903123456",
      address: "Đà Nẵng",
      bookings: 5,
      totalSpent: 12000000,
      joinDate: "2024-01-05",
    },
  ];

  const INIT_STAFFS = [
    {
      id: 1,
      name: "Admin System",
      email: "admin@lortel.com",
      phone: "0901123456",
      role: "admin",
      status: "active",
      joinDate: "2024-01-01",
    },
    {
      id: 2,
      name: "Nguyễn Thị Lễ Tân",
      email: "letan@lortel.com",
      phone: "0902123456",
      role: "receptionist",
      status: "active",
      joinDate: "2024-02-15",
    },
  ];

  const INIT_PROMOTIONS = [
    {
      id: 1,
      name: "Giảm 30% mùa hè",
      code: "SUMMER30",
      type: "percent",
      value: 30,
      start: "2024-06-01",
      end: "2024-08-31",
      status: "active",
    },
    {
      id: 2,
      name: "Giảm 200k cho khách mới",
      code: "NEW200",
      type: "fixed",
      value: 200000,
      start: "2024-01-01",
      end: "2024-12-31",
      status: "active",
    },
  ];

  const INIT_MESSAGES = [
    {
      id: 1,
      sender: "Nguyễn Văn A",
      avatar: "NA",
      lastMsg: "Phòng Deluxe còn không ạ?",
      time: "10:30",
      unread: 2,
      messages: [
        { from: "customer", text: "Phòng Deluxe còn không ạ?", time: "10:30" },
        {
          from: "admin",
          text: "Dạ còn ạ, anh/chị muốn đặt ngày nào?",
          time: "10:32",
        },
      ],
    },
    {
      id: 2,
      sender: "Trần Thị B",
      avatar: "TB",
      lastMsg: "Cho tôi hủy đặt phòng",
      time: "09:15",
      unread: 1,
      messages: [],
    },
  ];

  const INIT_NOTIFICATIONS = [
    { id: 1, title: "Đặt phòng mới #BK001", time: "5 phút trước", read: false },
    {
      id: 2,
      title: "Khách hàng cần hỗ trợ",
      time: "15 phút trước",
      read: false,
    },
  ];

  const INIT_ACTIVITIES = [
    { text: "Nguyễn Văn A đặt phòng Deluxe", time: "5 phút trước" },
    { text: "Xác nhận thanh toán #BK002", time: "15 phút trước" },
  ];

  // ---------- Helper functions ----------
  const formatCurrency = (amount: number) => {
    if (isNaN(amount)) return "0đ";
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };
  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  // Auth & UI states
  const [admin, setAdmin] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Data states
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState(INIT_CUSTOMERS);
  const [staffs, setStaffs] = useState(INIT_STAFFS);
  const [promotions, setPromotions] = useState(INIT_PROMOTIONS);
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [notifications, setNotifications] = useState(INIT_NOTIFICATIONS);
  const [activities] = useState(INIT_ACTIVITIES);

  // Modal open states
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Edit IDs
  const [editBookingId, setEditBookingId] = useState<number | null>(null);
  const [editRoomId, setEditRoomId] = useState<number | null>(null);
  const [editCustomerId, setEditCustomerId] = useState<number | null>(null);
  const [editStaffId, setEditStaffId] = useState<number | null>(null);
  const [editPromoId, setEditPromoId] = useState<number | null>(null);

  // Chat state
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState("");

  // Toast
  const [toast, setToast] = useState({
    message: "",
    type: "success" as "success" | "error" | "info",
    visible: false,
  });

  // Form refs
  const bookingFormRef = useRef<HTMLDivElement>(null);
  const roomFormRef = useRef<HTMLDivElement>(null);
  const customerFormRef = useRef<HTMLDivElement>(null);
  const staffFormRef = useRef<HTMLDivElement>(null);
  const promoFormRef = useRef<HTMLDivElement>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  // Auth check
  useEffect(() => {
    const adminData =
      localStorage.getItem("admin_data") ||
      sessionStorage.getItem("admin_data");
    if (!adminData) {
      router.replace("/login");
      return;
    }
    setAdmin(JSON.parse(adminData));
    setIsChecking(false);

    const timer = setInterval(
      () => setCurrentTime(new Date().toLocaleString("vi-VN")),
      1000,
    );
    const darkPref = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkPref);
    if (darkPref) document.body.classList.add("dark-mode");

    return () => clearInterval(timer);
  }, [router]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    newMode
      ? document.body.classList.add("dark-mode")
      : document.body.classList.remove("dark-mode");
  };

  const handleLogout = () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("admin_data");
      sessionStorage.removeItem("admin_data");
      router.replace("/login");
    }
  };

  const updateBadges = () => {
    // Used for badge counts
  };

  // Global search
  const searchResults = (() => {
    if (!globalSearch.trim()) return [];
    const q = globalSearch.toLowerCase();
    const bk = bookings
      .filter(
        (b) =>
          b.code.toLowerCase().includes(q) ||
          b.customer.toLowerCase().includes(q),
      )
      .map((b) => ({ type: "Đặt phòng", title: `${b.code} - ${b.customer}` }));
    const cus = customers
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
      )
      .map((c) => ({ type: "Khách hàng", title: `${c.name} - ${c.email}` }));
    const rm = rooms
      .filter((r) => r.name.toLowerCase().includes(q) || r.number.includes(q))
      .map((r) => ({ type: "Phòng", title: `${r.name} (${r.number})` }));
    return [...bk, ...cus, ...rm].slice(0, 5);
  })();
  return {
    // UI States
    admin,
    isChecking,
    activeTab,
    setActiveTab,
    isDarkMode,
    toggleDarkMode,
    isUserMenuOpen,
    setIsUserMenuOpen,
    isNotifDropdownOpen,
    setIsNotifDropdownOpen,
    currentTime,
    globalSearch,
    setGlobalSearch,
    showSearchResults,
    setShowSearchResults,

    // Data States
    bookings,
    setBookings,
    rooms,
    setRooms,
    customers,
    setCustomers,
    staffs,
    setStaffs,
    promotions,
    setPromotions,
    messages,
    setMessages,
    notifications,
    setNotifications,
    activities,

    // Modal States
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

    // Edit IDs
    editBookingId,
    setEditBookingId,
    editRoomId,
    setEditRoomId,
    editCustomerId,
    setEditCustomerId,
    editStaffId,
    setEditStaffId,
    editPromoId,
    setEditPromoId,

    //form ref
    bookingFormRef,
        roomFormRef,
        customerFormRef,
        staffFormRef,
        promoFormRef,

    // Chat & Others
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
  };
};
