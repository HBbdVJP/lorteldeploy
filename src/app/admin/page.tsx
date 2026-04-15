"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Line, Bar, Doughnut } from "react-chartjs-2";
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
    Legend
);

// ---------- Dữ liệu mẫu ----------
const INIT_BOOKINGS = [
    { id: 1, code: "BK001", customer: "Nguyễn Văn A", customerId: 1, room: "Deluxe", roomId: 1, checkin: "2024-03-20", checkout: "2024-03-22", guests: 2, status: "confirmed", total: 2400000, note: "" },
    { id: 2, code: "BK002", customer: "Trần Thị B", customerId: 2, room: "Standard", roomId: 2, checkin: "2024-03-21", checkout: "2024-03-23", guests: 2, status: "pending", total: 1700000, note: "" },
    { id: 3, code: "BK003", customer: "Lê Văn C", customerId: 3, room: "Suite", roomId: 3, checkin: "2024-03-22", checkout: "2024-03-24", guests: 2, status: "completed", total: 4400000, note: "" },
];

const INIT_ROOMS = [
    { id: 1, number: "101", name: "Deluxe City View", type: "Deluxe", price: 1200000, area: 35, capacity: 2, status: "available", amenities: ["wifi", "tv", "ac"], desc: "" },
    { id: 2, number: "102", name: "Standard Double", type: "Standard", price: 850000, area: 25, capacity: 2, status: "available", amenities: ["wifi", "tv"], desc: "" },
    { id: 3, number: "103", name: "Suite Premium", type: "Suite", price: 2200000, area: 50, capacity: 4, status: "occupied", amenities: ["wifi", "tv", "ac", "bath"], desc: "" },
    { id: 4, number: "104", name: "Family Room", type: "Family", price: 1800000, area: 45, capacity: 4, status: "maintenance", amenities: ["wifi", "tv", "ac"], desc: "" },
];

const INIT_CUSTOMERS = [
    { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@email.com", phone: "0901123456", address: "Hà Nội", bookings: 3, totalSpent: 5000000, joinDate: "2024-01-15" },
    { id: 2, name: "Trần Thị B", email: "tranthib@email.com", phone: "0902123456", address: "TP.HCM", bookings: 2, totalSpent: 3000000, joinDate: "2024-02-10" },
    { id: 3, name: "Lê Văn C", email: "levanc@email.com", phone: "0903123456", address: "Đà Nẵng", bookings: 5, totalSpent: 12000000, joinDate: "2024-01-05" },
];

const INIT_STAFFS = [
    { id: 1, name: "Admin System", email: "admin@lortel.com", phone: "0901123456", role: "admin", status: "active", joinDate: "2024-01-01" },
    { id: 2, name: "Nguyễn Thị Lễ Tân", email: "letan@lortel.com", phone: "0902123456", role: "receptionist", status: "active", joinDate: "2024-02-15" },
];

const INIT_PROMOTIONS = [
    { id: 1, name: "Giảm 30% mùa hè", code: "SUMMER30", type: "percent", value: 30, start: "2024-06-01", end: "2024-08-31", status: "active" },
    { id: 2, name: "Giảm 200k cho khách mới", code: "NEW200", type: "fixed", value: 200000, start: "2024-01-01", end: "2024-12-31", status: "active" },
];

const INIT_MESSAGES = [
    { id: 1, sender: "Nguyễn Văn A", avatar: "NA", lastMsg: "Phòng Deluxe còn không ạ?", time: "10:30", unread: 2, messages: [{ from: "customer", text: "Phòng Deluxe còn không ạ?", time: "10:30" }, { from: "admin", text: "Dạ còn ạ, anh/chị muốn đặt ngày nào?", time: "10:32" }] },
    { id: 2, sender: "Trần Thị B", avatar: "TB", lastMsg: "Cho tôi hủy đặt phòng", time: "09:15", unread: 1, messages: [] },
];

const INIT_NOTIFICATIONS = [
    { id: 1, title: "Đặt phòng mới #BK001", time: "5 phút trước", read: false },
    { id: 2, title: "Khách hàng cần hỗ trợ", time: "15 phút trước", read: false },
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

export default function AdminDashboard() {
    const router = useRouter();

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
    const [bookings, setBookings] = useState(INIT_BOOKINGS);
    const [rooms, setRooms] = useState(INIT_ROOMS);
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
    const [deleteModalData, setDeleteModalData] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

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
    const [toast, setToast] = useState({ message: "", type: "success" as "success" | "error" | "info", visible: false });

    // Form refs
    const bookingFormRef = useRef<HTMLDivElement>(null);
    const roomFormRef = useRef<HTMLDivElement>(null);
    const customerFormRef = useRef<HTMLDivElement>(null);
    const staffFormRef = useRef<HTMLDivElement>(null);
    const promoFormRef = useRef<HTMLDivElement>(null);

    const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
        setToast({ message, type, visible: true });
        setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
    };

    // Auth check
    useEffect(() => {
        const adminData = localStorage.getItem("admin_data") || sessionStorage.getItem("admin_data");
        if (!adminData) {
            router.replace("/login");
            return;
        }
        setAdmin(JSON.parse(adminData));
        setIsChecking(false);

        const timer = setInterval(() => setCurrentTime(new Date().toLocaleString("vi-VN")), 1000);
        const darkPref = localStorage.getItem("darkMode") === "true";
        setIsDarkMode(darkPref);
        if (darkPref) document.body.classList.add("dark-mode");

        return () => clearInterval(timer);
    }, [router]);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem("darkMode", String(newMode));
        newMode ? document.body.classList.add("dark-mode") : document.body.classList.remove("dark-mode");
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
        const bk = bookings.filter((b) => b.code.toLowerCase().includes(q) || b.customer.toLowerCase().includes(q)).map((b) => ({ type: "Đặt phòng", title: `${b.code} - ${b.customer}` }));
        const cus = customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)).map((c) => ({ type: "Khách hàng", title: `${c.name} - ${c.email}` }));
        const rm = rooms.filter((r) => r.name.toLowerCase().includes(q) || r.number.includes(q)).map((r) => ({ type: "Phòng", title: `${r.name} (${r.number})` }));
        return [...bk, ...cus, ...rm].slice(0, 5);
    })();

    // ---------- Modal handlers ----------
    const openDeleteModal = (title: string, message: string, onConfirm: () => void) => {
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

    // Booking CRUD
    const openBookingModal = (id: number | null = null) => {
        setEditBookingId(id);
        setIsBookingModalOpen(true);
    };

    const closeBookingModal = () => {
        setIsBookingModalOpen(false);
        setEditBookingId(null);
    };

    const saveBooking = () => {
        const form = bookingFormRef.current;
        if (!form) return;
        const customerSelect = form.querySelector("#bookingCustomer") as HTMLSelectElement;
        const roomSelect = form.querySelector("#bookingRoom") as HTMLSelectElement;
        const checkinInput = form.querySelector("#bookingCheckin") as HTMLInputElement;
        const checkoutInput = form.querySelector("#bookingCheckout") as HTMLInputElement;
        const guestsInput = form.querySelector("#bookingGuests") as HTMLInputElement;
        const notesInput = form.querySelector("#bookingNotes") as HTMLTextAreaElement;

        const customerId = parseInt(customerSelect?.value || "0");
        const roomId = parseInt(roomSelect?.value || "0");
        const checkin = checkinInput?.value || "";
        const checkout = checkoutInput?.value || "";
        const guests = parseInt(guestsInput?.value || "2");
        const note = notesInput?.value || "";

        if (!customerId || !roomId || !checkin || !checkout) {
            showToast("Vui lòng điền đầy đủ thông tin", "error");
            return;
        }

        const customer = customers.find((c) => c.id === customerId);
        const room = rooms.find((r) => r.id === roomId);
        if (!customer || !room) return;

        const days = Math.max(1, Math.ceil((new Date(checkout).getTime() - new Date(checkin).getTime()) / (1000 * 60 * 60 * 24)));
        const total = room.price * days;

        if (editBookingId) {
            setBookings((prev) => prev.map((b) => (b.id === editBookingId ? { ...b, customerId, customer: customer.name, roomId, room: room.name, checkin, checkout, guests, total, note } : b)));
            showToast("Cập nhật đặt phòng thành công");
        } else {
            const newId = Math.max(...bookings.map((b) => b.id), 0) + 1;
            const newBooking = {
                id: newId,
                code: `BK${String(newId).padStart(3, "0")}`,
                customerId,
                customer: customer.name,
                roomId,
                room: room.name,
                checkin,
                checkout,
                guests,
                total,
                note,
                status: "pending" as const,
            };
            setBookings((prev) => [...prev, newBooking]);
            showToast("Thêm đặt phòng thành công");
        }
        closeBookingModal();
    };

    const deleteBooking = (id: number) => {
        openDeleteModal("Xóa đặt phòng", "Bạn có chắc chắn muốn xóa đặt phòng này?", () => {
            setBookings((prev) => prev.filter((b) => b.id !== id));
            showToast("Đã xóa đặt phòng");
        });
    };

    // Room CRUD
    const openRoomModal = (id: number | null = null) => {
        setEditRoomId(id);
        setIsRoomModalOpen(true);
    };

    const closeRoomModal = () => {
        setIsRoomModalOpen(false);
        setEditRoomId(null);
    };

    const saveRoom = () => {
        const form = roomFormRef.current;
        if (!form) return;
        const nameInput = form.querySelector("#roomName") as HTMLInputElement;
        const numberInput = form.querySelector("#roomNumber") as HTMLInputElement;
        const typeSelect = form.querySelector("#roomType") as HTMLSelectElement;
        const priceInput = form.querySelector("#roomPrice") as HTMLInputElement;
        const areaInput = form.querySelector("#roomArea") as HTMLInputElement;
        const capacityInput = form.querySelector("#roomCapacity") as HTMLInputElement;
        const statusSelect = form.querySelector("#roomStatus") as HTMLSelectElement;
        const descInput = form.querySelector("#roomDesc") as HTMLTextAreaElement;
        const amenityWifi = form.querySelector("#amenityWifi") as HTMLInputElement;
        const amenityTv = form.querySelector("#amenityTv") as HTMLInputElement;
        const amenityAc = form.querySelector("#amenityAc") as HTMLInputElement;
        const amenityBath = form.querySelector("#amenityBath") as HTMLInputElement;

        const name = nameInput?.value || "";
        const number = numberInput?.value || "";
        const price = parseInt(priceInput?.value || "0");

        if (!name || !number || !price) {
            showToast("Vui lòng điền đầy đủ thông tin", "error");
            return;
        }

        const amenities: string[] = [];
        if (amenityWifi?.checked) amenities.push("wifi");
        if (amenityTv?.checked) amenities.push("tv");
        if (amenityAc?.checked) amenities.push("ac");
        if (amenityBath?.checked) amenities.push("bath");

        const roomData = {
            name,
            number,
            type: typeSelect?.value || "Standard",
            price,
            area: parseInt(areaInput?.value || "0"),
            capacity: parseInt(capacityInput?.value || "2"),
            status: statusSelect?.value || "available",
            amenities,
            desc: descInput?.value || "",
        };

        if (editRoomId) {
            setRooms((prev) => prev.map((r) => (r.id === editRoomId ? { ...r, ...roomData } : r)));
            showToast("Cập nhật phòng thành công");
        } else {
            const newId = Math.max(...rooms.map((r) => r.id), 0) + 1;
            setRooms((prev) => [...prev, { id: newId, ...roomData }]);
            showToast("Thêm phòng thành công");
        }
        closeRoomModal();
    };

    const deleteRoom = (id: number) => {
        openDeleteModal("Xóa phòng", "Bạn có chắc chắn muốn xóa phòng này?", () => {
            setRooms((prev) => prev.filter((r) => r.id !== id));
            showToast("Đã xóa phòng");
        });
    };

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
        const addressInput = form.querySelector("#customerAddress") as HTMLInputElement;

        const name = nameInput?.value || "";
        const email = emailInput?.value || "";

        if (!name || !email) {
            showToast("Vui lòng điền họ tên và email", "error");
            return;
        }

        if (editCustomerId) {
            setCustomers((prev) => prev.map((c) => (c.id === editCustomerId ? { ...c, name, email, phone: phoneInput?.value || "", address: addressInput?.value || "" } : c)));
            showToast("Cập nhật khách hàng thành công");
        } else {
            const newId = Math.max(...customers.map((c) => c.id), 0) + 1;
            setCustomers((prev) => [...prev, { id: newId, name, email, phone: phoneInput?.value || "", address: addressInput?.value || "", bookings: 0, totalSpent: 0, joinDate: new Date().toISOString().split("T")[0] }]);
            showToast("Thêm khách hàng thành công");
        }
        closeCustomerModal();
    };

    const deleteCustomer = (id: number) => {
        openDeleteModal("Xóa khách hàng", "Bạn có chắc chắn muốn xóa khách hàng này?", () => {
            setCustomers((prev) => prev.filter((c) => c.id !== id));
            showToast("Đã xóa khách hàng");
        });
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
        const passwordInput = form.querySelector("#staffPassword") as HTMLInputElement;

        const name = nameInput?.value || "";
        const email = emailInput?.value || "";

        if (!name || !email) {
            showToast("Vui lòng điền đầy đủ thông tin", "error");
            return;
        }

        if (editStaffId) {
            setStaffs((prev) => prev.map((s) => (s.id === editStaffId ? { ...s, name, email, phone: phoneInput?.value || "", role: roleSelect?.value || "receptionist" } : s)));
            showToast("Cập nhật nhân viên thành công");
        } else {
            if (!passwordInput?.value) {
                showToast("Vui lòng nhập mật khẩu", "error");
                return;
            }
            const newId = Math.max(...staffs.map((s) => s.id), 0) + 1;
            setStaffs((prev) => [...prev, { id: newId, name, email, phone: phoneInput?.value || "", role: roleSelect?.value || "receptionist", status: "active", joinDate: new Date().toISOString().split("T")[0] }]);
            showToast("Thêm nhân viên thành công");
        }
        closeStaffModal();
    };

    const deleteStaff = (id: number) => {
        openDeleteModal("Xóa nhân viên", "Bạn có chắc chắn muốn xóa nhân viên này?", () => {
            setStaffs((prev) => prev.filter((s) => s.id !== id));
            showToast("Đã xóa nhân viên");
        });
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
            showToast("Vui lòng điền đầy đủ thông tin", "error");
            return;
        }

        const status = new Date(end) > new Date() ? "active" : "expired";

        if (editPromoId) {
            setPromotions((prev) => prev.map((p) => (p.id === editPromoId ? { ...p, name, code, type: type as "percent" | "fixed", value, start, end, status } : p)));
            showToast("Cập nhật khuyến mãi thành công");
        } else {
            const newId = Math.max(...promotions.map((p) => p.id), 0) + 1;
            setPromotions((prev) => [...prev, { id: newId, name, code, type: type as "percent" | "fixed", value, start, end, status }]);
            showToast("Thêm khuyến mãi thành công");
        }
        closePromoModal();
    };

    const deletePromotion = (id: number) => {
        openDeleteModal("Xóa khuyến mãi", "Bạn có chắc chắn muốn xóa khuyến mãi này?", () => {
            setPromotions((prev) => prev.filter((p) => p.id !== id));
            showToast("Đã xóa khuyến mãi");
        });
    };

    // Chat
    const loadChat = (id: number) => {
        setCurrentChatId(id);
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: 0 } : m)));
    };

    const sendMessage = () => {
        if (!chatInput.trim() || !currentChatId) return;
        const time = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
        setMessages((prev) => prev.map((m) => (m.id === currentChatId ? { ...m, messages: [...m.messages, { from: "admin", text: chatInput, time }] } : m)));
        setChatInput("");
    };

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="loading-spinner" />
            </div>
        );
    }
    if (!admin) return null;

    // Tính toán cho dashboard
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.status === "confirmed" || b.status === "completed" ? b.total : 0), 0);
    const availableRooms = rooms.filter((r) => r.status === "available").length;
    const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
    const pendingBookings = bookings.filter((b) => b.status === "pending").length;
    const newCustomers = customers.filter((c) => new Date(c.joinDate) > new Date("2024-02-01")).length;

    const chartData = {
        labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
        datasets: [{ label: "Doanh thu (triệu)", data: [45, 52, 48, 70, 65, 58, 62], borderColor: "#10b981", backgroundColor: "rgba(16,185,129,0.1)", fill: true, tension: 0.3 }],
    };

    const monthlyData = [850, 920, 1100, 980, 1250, 1400, 1350, 1420, 1380, 1450, 1520, 1680];
    const statusData = [bookings.filter((b) => b.status === "confirmed").length, bookings.filter((b) => b.status === "pending").length, bookings.filter((b) => b.status === "completed").length];

    // ---------- RENDER CONTENT ----------
    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold">Tổng quan</h1>
                                <p className="text-gray-500 text-sm">Xem tổng quan hoạt động kinh doanh</p>
                            </div>
                            <button
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm"
                                onClick={() => {
                                    showToast("Đã làm mới dữ liệu");
                                }}
                            >
                                <i className="fas fa-sync-alt mr-2"></i>Làm mới
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="stat-card bg-white p-5 rounded-xl shadow-sm border dark:bg-gray-800">
                                <div className="flex justify-between">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-dollar-sign text-blue-600"></i>
                                    </div>
                                    <span className="text-green-600 text-sm">+12.5%</span>
                                </div>
                                <p className="text-gray-500 text-sm mt-2 dark:text-gray-400">Doanh thu hôm nay</p>
                                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                            </div>
                            <div className="stat-card bg-white p-5 rounded-xl shadow-sm border dark:bg-gray-800">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-calendar-check text-green-600"></i>
                                </div>
                                <p className="text-gray-500 text-sm mt-2 dark:text-gray-400">Đặt phòng mới</p>
                                <p className="text-2xl font-bold">{bookings.length}</p>
                                <p className="text-xs text-yellow-600">Chờ: {pendingBookings}</p>
                            </div>
                            <div className="stat-card bg-white p-5 rounded-xl shadow-sm border dark:bg-gray-800">
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-bed text-yellow-600"></i>
                                </div>
                                <p className="text-gray-500 text-sm mt-2 dark:text-gray-400">Phòng trống</p>
                                <p className="text-2xl font-bold">{availableRooms}</p>
                                <p className="text-xs text-gray-400">Tổng: {rooms.length}</p>
                            </div>
                            <div className="stat-card bg-white p-5 rounded-xl shadow-sm border dark:bg-gray-800">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-users text-purple-600"></i>
                                </div>
                                <p className="text-gray-500 text-sm mt-2 dark:text-gray-400">Khách hàng mới</p>
                                <p className="text-2xl font-bold">{newCustomers}</p>
                                <p className="text-xs text-gray-400">Tổng: {customers.length}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-5 rounded-xl shadow-sm dark:bg-gray-800">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold">Biểu đồ doanh thu</h3>
                                    <div className="flex gap-1">
                                        <button className="text-xs px-3 py-1 rounded bg-emerald-600 text-white">7 ngày</button>
                                        <button className="text-xs px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">30 ngày</button>
                                    </div>
                                </div>
                                <div className="h-[200px]">
                                    <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-xl shadow-sm dark:bg-gray-800">
                                <h3 className="font-bold mb-4">Phòng được đặt nhiều nhất</h3>
                                <div className="space-y-3">
                                    {rooms.slice(0, 4).map((r, idx) => (
                                        <div key={r.id}>
                                            <div className="flex justify-between text-sm">
                                                <span>{r.name}</span>
                                                <span>{Math.floor(Math.random() * 50)} lượt</span>
                                            </div>
                                            <div className="progress-bar mt-1">
                                                <div className="progress-fill" style={{ width: `${Math.floor(Math.random() * 80 + 20)}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <h4 className="font-medium text-sm mb-2">Tỉ lệ lấp đầy</h4>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between text-xs">
                                                <span>Hôm nay</span>
                                                <span>{Math.round((occupiedRooms / rooms.length) * 100)}%</span>
                                            </div>
                                            <div className="progress-bar mt-1">
                                                <div className="progress-fill" style={{ width: `${(occupiedRooms / rooms.length) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-sm dark:bg-gray-800">
                                <div className="px-6 py-4 border-b flex justify-between">
                                    <h3 className="font-bold">Đặt phòng gần đây</h3>
                                    <a href="#" onClick={() => setActiveTab("bookings")} className="text-emerald-600 text-sm">
                                        Xem tất cả
                                    </a>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
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
                                                <tr key={b.id} className="border-b dark:border-gray-700">
                                                    <td className="px-4 py-2">{b.code}</td>
                                                    <td className="px-4 py-2">{b.customer}</td>
                                                    <td className="px-4 py-2">{b.room}</td>
                                                    <td className="px-4 py-2">
                                                        <span className={`badge ${b.status === "confirmed" ? "badge-success" : b.status === "pending" ? "badge-warning" : "badge-info"}`}>
                                                            {b.status === "confirmed" ? "Đã xác nhận" : b.status === "pending" ? "Chờ" : "Hoàn thành"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-right">{formatCurrency(b.total)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm dark:bg-gray-800">
                                <div className="px-6 py-4 border-b">
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

                        <div className="grid grid-cols-4 gap-4">
                            <button onClick={() => openBookingModal(null)} className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md text-center dark:bg-gray-800">
                                <i className="fas fa-plus-circle text-emerald-600 text-2xl mb-2 block"></i>
                                <span className="text-sm">Tạo đặt phòng</span>
                            </button>
                            <button onClick={() => openRoomModal(null)} className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md text-center dark:bg-gray-800">
                                <i className="fas fa-bed text-emerald-600 text-2xl mb-2 block"></i>
                                <span className="text-sm">Thêm phòng</span>
                            </button>
                            <button onClick={() => openCustomerModal(null)} className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md text-center dark:bg-gray-800">
                                <i className="fas fa-user-plus text-emerald-600 text-2xl mb-2 block"></i>
                                <span className="text-sm">Thêm khách</span>
                            </button>
                            <button onClick={() => setActiveTab("reports")} className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md text-center dark:bg-gray-800">
                                <i className="fas fa-chart-line text-emerald-600 text-2xl mb-2 block"></i>
                                <span className="text-sm">Xem báo cáo</span>
                            </button>
                        </div>
                    </div>
                );

            case "bookings":
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between">
                            <h1 className="text-2xl font-bold">Quản lý đặt phòng</h1>
                            <button onClick={() => openBookingModal(null)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg">
                                <i className="fas fa-plus mr-2"></i>Tạo đặt phòng
                            </button>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm dark:bg-gray-800">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <input type="text" placeholder="Tìm kiếm..." className="border rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600" />
                                <select className="border rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600">
                                    <option value="all">Tất cả</option>
                                    <option value="pending">Chờ</option>
                                    <option value="confirmed">Đã xác nhận</option>
                                    <option value="completed">Hoàn thành</option>
                                </select>
                                <input type="date" className="border rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600" />
                                <input type="date" className="border rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden dark:bg-gray-800">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs">Mã</th>
                                        <th className="px-6 py-3 text-left text-xs">Khách hàng</th>
                                        <th className="px-6 py-3 text-left text-xs">Phòng</th>
                                        <th className="px-6 py-3 text-left text-xs">Ngày nhận</th>
                                        <th className="px-6 py-3 text-left text-xs">Ngày trả</th>
                                        <th className="px-6 py-3 text-left text-xs">Trạng thái</th>
                                        <th className="px-6 py-3 text-right text-xs">Tổng</th>
                                        <th className="px-6 py-3 text-center text-xs">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((b) => (
                                        <tr key={b.id} className="border-b dark:border-gray-700">
                                            <td className="px-6 py-3">{b.code}</td>
                                            <td className="px-6 py-3">{b.customer}</td>
                                            <td className="px-6 py-3">{b.room}</td>
                                            <td className="px-6 py-3">{formatDate(b.checkin)}</td>
                                            <td className="px-6 py-3">{formatDate(b.checkout)}</td>
                                            <td className="px-6 py-3">
                                                <span className={`badge ${b.status === "confirmed" ? "badge-success" : b.status === "pending" ? "badge-warning" : "badge-info"}`}>
                                                    {b.status === "confirmed" ? "Đã xác nhận" : b.status === "pending" ? "Chờ" : "Hoàn thành"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right">{formatCurrency(b.total)}</td>
                                            <td className="px-6 py-3 text-center">
                                                <button className="text-blue-600 mr-2" onClick={() => openBookingModal(b.id)}>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="text-red-600" onClick={() => deleteBooking(b.id)}>
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

            case "rooms":
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between">
                            <h1 className="text-2xl font-bold">Quản lý phòng</h1>
                            <button onClick={() => openRoomModal(null)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg">
                                <i className="fas fa-plus mr-2"></i>Thêm phòng
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-lg dark:bg-gray-800">
                                <p className="text-gray-500">Tổng số</p>
                                <p className="text-2xl font-bold">{rooms.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg dark:bg-gray-800">
                                <p className="text-gray-500">Phòng trống</p>
                                <p className="text-2xl font-bold text-green-600">{rooms.filter((r) => r.status === "available").length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg dark:bg-gray-800">
                                <p className="text-gray-500">Đang có khách</p>
                                <p className="text-2xl font-bold text-yellow-600">{rooms.filter((r) => r.status === "occupied").length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg dark:bg-gray-800">
                                <p className="text-gray-500">Bảo trì</p>
                                <p className="text-2xl font-bold text-red-600">{rooms.filter((r) => r.status === "maintenance").length}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {rooms.map((r) => (
                                <div key={r.id} className="room-card bg-white rounded-xl shadow-sm border overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                                    <div className="relative h-40 bg-gray-200">
                                        <img src={`https://picsum.photos/id/${164 + r.id}/400/200`} className="w-full h-full object-cover" alt={r.name} />
                                        <span
                                            className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full text-white ${r.status === "available" ? "bg-green-500" : r.status === "occupied" ? "bg-yellow-500" : "bg-red-500"
                                                }`}
                                        >
                                            {r.status === "available" ? "Trống" : r.status === "occupied" ? "Đã đặt" : "Bảo trì"}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between">
                                            <h3 className="font-bold">{r.name}</h3>
                                            <span className="text-emerald-600 font-bold">{formatCurrency(r.price)}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Phòng {r.number} • {r.area}m² • {r.capacity} người
                                        </p>
                                        <div className="flex gap-1 mt-2">
                                            {r.amenities.map((a) => (
                                                <span key={a} className="bg-gray-100 text-xs px-2 py-1 rounded dark:bg-gray-700">
                                                    <i className={`fas fa-${a === "wifi" ? "wifi" : a === "tv" ? "tv" : a === "ac" ? "wind" : "bath"}`}></i> {a.toUpperCase()}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex justify-between mt-3 pt-3 border-t dark:border-gray-700">
                                            <button className="text-blue-600" onClick={() => openRoomModal(r.id)}>
                                                <i className="fas fa-edit mr-1"></i>Sửa
                                            </button>
                                            <button className="text-red-600" onClick={() => deleteRoom(r.id)}>
                                                <i className="fas fa-trash mr-1"></i>Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "customers":
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between">
                            <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
                            <button onClick={() => openCustomerModal(null)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg">
                                <i className="fas fa-plus mr-2"></i>Thêm khách hàng
                            </button>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm dark:bg-gray-800">
                            <input type="text" placeholder="Tìm kiếm khách hàng..." className="w-full md:w-1/3 border rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden dark:bg-gray-800">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs">Khách hàng</th>
                                        <th className="px-6 py-3 text-left text-xs">Email</th>
                                        <th className="px-6 py-3 text-left text-xs">Điện thoại</th>
                                        <th className="px-6 py-3 text-left text-xs">Số đặt phòng</th>
                                        <th className="px-6 py-3 text-right text-xs">Tổng chi tiêu</th>
                                        <th className="px-6 py-3 text-center text-xs">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((c) => (
                                        <tr key={c.id} className="border-b dark:border-gray-700">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">{c.name.charAt(0)}</div>
                                                    <span className="font-medium">{c.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">{c.email}</td>
                                            <td className="px-6 py-3">{c.phone}</td>
                                            <td className="px-6 py-3">{c.bookings}</td>
                                            <td className="px-6 py-3 text-right">{formatCurrency(c.totalSpent)}</td>
                                            <td className="px-6 py-3 text-center">
                                                <button className="text-blue-600 mr-2" onClick={() => openCustomerModal(c.id)}>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="text-red-600" onClick={() => deleteCustomer(c.id)}>
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
                            <h1 className="text-2xl font-bold">Quản lý nhân viên</h1>
                            <button onClick={() => openStaffModal(null)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg">
                                <i className="fas fa-plus mr-2"></i>Thêm nhân viên
                            </button>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm dark:bg-gray-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input type="text" placeholder="Tìm kiếm..." className="border rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600" />
                                <select className="border rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600">
                                    <option value="all">Tất cả vai trò</option>
                                    <option value="admin">Admin</option>
                                    <option value="receptionist">Lễ tân</option>
                                    <option value="housekeeping">Dọn phòng</option>
                                    <option value="manager">Quản lý</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {staffs.map((s) => (
                                <div key={s.id} className="bg-white p-6 rounded-xl shadow-sm border dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-600">{s.name.charAt(0)}</div>
                                        <div>
                                            <h3 className="font-bold">{s.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {s.role === "admin" ? "Quản trị viên" : s.role === "receptionist" ? "Lễ tân" : s.role === "manager" ? "Quản lý" : "Dọn phòng"}
                                            </p>
                                            <span className={`badge ${s.status === "active" ? "badge-success" : "badge-warning"} text-xs`}>{s.status === "active" ? "Đang làm việc" : "Tạm nghỉ"}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2 text-sm">
                                        <p>
                                            <i className="fas fa-envelope w-5 text-gray-400"></i> {s.email}
                                        </p>
                                        <p>
                                            <i className="fas fa-phone w-5 text-gray-400"></i> {s.phone}
                                        </p>
                                        <p>
                                            <i className="fas fa-calendar w-5 text-gray-400"></i> Tham gia: {formatDate(s.joinDate)}
                                        </p>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t dark:border-gray-700">
                                        <button className="text-blue-600" onClick={() => openStaffModal(s.id)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="text-red-600" onClick={() => deleteStaff(s.id)}>
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
                            <h1 className="text-2xl font-bold">Quản lý khuyến mãi</h1>
                            <button onClick={() => openPromoModal(null)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg">
                                <i className="fas fa-plus mr-2"></i>Tạo khuyến mãi
                            </button>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm dark:bg-gray-800">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <input type="text" placeholder="Tìm kiếm..." className="border rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600" />
                                <select className="border rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600">
                                    <option value="all">Tất cả</option>
                                    <option value="active">Đang hoạt động</option>
                                    <option value="expired">Hết hạn</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {promotions.map((p) => (
                                <div key={p.id} className={`bg-gradient-to-r ${p.type === "percent" ? "from-purple-500 to-pink-500" : "from-blue-500 to-cyan-500"} rounded-xl p-5 text-white`}>
                                    <span className="text-xs bg-white/20 px-2 py-1 rounded">{p.code}</span>
                                    <h3 className="text-xl font-bold mt-2">{p.name}</h3>
                                    <p className="text-sm mt-1">{p.type === "percent" ? `Giảm ${p.value}%` : `Giảm ${formatCurrency(p.value)}`}</p>
                                    <div className="flex justify-between text-xs mt-3">
                                        <span>
                                            {formatDate(p.start)} → {formatDate(p.end)}
                                        </span>
                                        <span className={`badge ${p.status === "active" ? "bg-green-500" : "bg-gray-500"} text-white`}>{p.status === "active" ? "Đang hoạt động" : "Hết hạn"}</span>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-3">
                                        <button className="text-white hover:text-gray-200" onClick={() => openPromoModal(p.id)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="text-white hover:text-gray-200" onClick={() => deletePromotion(p.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "reports":
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl font-bold">Báo cáo & Thống kê</h1>
                        <div className="bg-white p-4 rounded-xl shadow-sm dark:bg-gray-800">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <select className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600">
                                    <option value="revenue">Doanh thu</option>
                                    <option value="bookings">Đặt phòng</option>
                                </select>
                                <select className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600">
                                    <option value="week">Tuần này</option>
                                    <option value="month" selected>Tháng này</option>
                                    <option value="year">Năm nay</option>
                                </select>
                                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm" onClick={() => showToast("Đang tạo báo cáo...", "info")}>
                                    <i className="fas fa-chart-line mr-2"></i>Tạo báo cáo
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-5 rounded-xl shadow-sm dark:bg-gray-800">
                                <h3 className="font-bold mb-3">Doanh thu theo tháng (Triệu VNĐ)</h3>
                                <div className="h-[200px]">
                                    <Bar
                                        data={{
                                            labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
                                            datasets: [{ label: "Doanh thu", data: monthlyData, backgroundColor: "#10b981" }],
                                        }}
                                        options={{ responsive: true, maintainAspectRatio: false }}
                                    />
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-xl shadow-sm dark:bg-gray-800">
                                <h3 className="font-bold mb-3">Trạng thái đặt phòng</h3>
                                <div className="h-[200px]">
                                    <Doughnut
                                        data={{
                                            labels: ["Đã xác nhận", "Chờ xác nhận", "Hoàn thành"],
                                            datasets: [{ data: statusData, backgroundColor: ["#10b981", "#f59e0b", "#3b82f6"] }],
                                        }}
                                        options={{ responsive: true, maintainAspectRatio: false }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm dark:bg-gray-800">
                            <h3 className="font-bold mb-3">Top khách hàng thân thiết</h3>
                            <div className="space-y-3">
                                {[...customers]
                                    .sort((a, b) => b.totalSpent - a.totalSpent)
                                    .slice(0, 5)
                                    .map((c, i) => (
                                        <div key={c.id} className="flex justify-between items-center">
                                            <div>
                                                <span className="w-6 inline-block">{i + 1}.</span>
                                                {c.name}
                                            </div>
                                            <span className="font-medium">
                                                {c.bookings} đặt - {formatCurrency(c.totalSpent)}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm dark:bg-gray-800">
                            <h3 className="font-bold mb-3">Xuất báo cáo</h3>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => showToast("Đang xuất PDF...", "info")}>
                                    <i className="fas fa-file-pdf text-red-500 mr-2"></i>PDF
                                </button>
                                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => showToast("Đang xuất Excel...", "info")}>
                                    <i className="fas fa-file-excel text-green-500 mr-2"></i>Excel
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case "messages":
                const currentChat = messages.find((m) => m.id === currentChatId);
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl font-bold">Tin nhắn</h1>
                        <div className="bg-white rounded-xl shadow-sm border h-[600px] dark:bg-gray-800 dark:border-gray-700">
                            <div className="grid grid-cols-3 h-full">
                                <div className="border-r dark:border-gray-700">
                                    <div className="p-4 border-b dark:border-gray-700">
                                        <input type="text" placeholder="Tìm kiếm..." className="w-full border rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600" />
                                    </div>
                                    <div className="overflow-y-auto h-[calc(100%-73px)]">
                                        {messages.map((m) => (
                                            <div
                                                key={m.id}
                                                className={`p-4 hover:bg-gray-50 cursor-pointer border-b dark:hover:bg-gray-700 dark:border-gray-700 ${m.unread > 0 ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                                                onClick={() => loadChat(m.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold">{m.avatar}</div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">{m.sender}</span>
                                                            <span className="text-xs text-gray-400">{m.time}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 truncate">{m.lastMsg}</p>
                                                    </div>
                                                    {m.unread > 0 && <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{m.unread}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-2 flex flex-col">
                                    <div className="p-4 border-b dark:border-gray-700">
                                        <h3 className="font-bold">{currentChat ? currentChat.sender : "Chọn người để chat"}</h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {currentChat?.messages.map((msg, idx) => (
                                            <div key={idx} className={`flex ${msg.from === "admin" ? "justify-end" : "justify-start"}`}>
                                                <div className={`${msg.from === "admin" ? "bg-emerald-600 text-white" : "bg-gray-100 dark:bg-gray-700"} p-3 rounded-lg max-w-md`}>
                                                    <p className="text-sm">{msg.text}</p>
                                                    <p className={`text-xs ${msg.from === "admin" ? "text-white/70" : "text-gray-400"} mt-1`}>{msg.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 border-t dark:border-gray-700">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Nhập tin nhắn..."
                                                className="flex-1 border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600"
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                            />
                                            <button onClick={sendMessage} className="bg-emerald-600 text-white px-4 py-2 rounded-lg">
                                                <i className="fas fa-paper-plane"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "settings":
                return (
                    <div className="bg-white p-6 rounded-xl dark:bg-gray-800">
                        <h1 className="text-2xl font-bold mb-4">Cài đặt hệ thống</h1>
                        <p className="text-gray-500">Tính năng đang phát triển...</p>
                    </div>
                );

            case "help":
                return (
                    <div className="bg-white p-6 rounded-xl dark:bg-gray-800">
                        <h1 className="text-2xl font-bold mb-4">Trung tâm trợ giúp</h1>
                        <p className="text-gray-500">Hướng dẫn sử dụng hệ thống quản trị LORTEL</p>
                        <div className="mt-4 space-y-2">
                            <p>
                                <i className="fas fa-check-circle text-emerald-600 mr-2"></i>Quản lý đặt phòng: Thêm/sửa/xóa đặt phòng
                            </p>
                            <p>
                                <i className="fas fa-check-circle text-emerald-600 mr-2"></i>Quản lý phòng: Thêm/sửa/xóa phòng, cập nhật trạng thái
                            </p>
                            <p>
                                <i className="fas fa-check-circle text-emerald-600 mr-2"></i>Quản lý khách hàng: Thêm/sửa/xóa thông tin khách
                            </p>
                            <p>
                                <i className="fas fa-check-circle text-emerald-600 mr-2"></i>Quản lý nhân viên: Thêm/sửa/xóa nhân viên
                            </p>
                            <p>
                                <i className="fas fa-check-circle text-emerald-600 mr-2"></i>Khuyến mãi: Tạo mã giảm giá
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };
    // ==================== RENDER CHÍNH ====================
    return (
        <div className={`flex h-screen ${isDarkMode ? "dark-mode" : "bg-gray-50"}`}>
            {/* SIDEBAR */}
            <aside className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                            <i className="fas fa-crown text-gray-900 text-xl"></i>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">LORTEL</h1>
                            <p className="text-xs text-gray-400">Hệ thống quản trị</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-b border-gray-700 relative">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-xl font-bold">
                            {admin?.name?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div className="flex-1">
                            <p className="font-bold">{admin?.name}</p>
                            <p className="text-xs text-gray-400">{admin?.email}</p>
                        </div>
                        <i className={`fas fa-chevron-${isUserMenuOpen ? "up" : "down"} text-gray-400`}></i>
                    </div>
                    {isUserMenuOpen && (
                        <div className="absolute top-full left-4 right-4 bg-gray-800 rounded-lg mt-2 shadow-xl border border-gray-700 z-50 p-2">
                            <button onClick={() => { setActiveTab("settings"); setIsUserMenuOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded-md">
                                <i className="fas fa-user mr-2"></i>Hồ sơ
                            </button>
                            <button onClick={() => { setActiveTab("settings"); setIsUserMenuOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded-md">
                                <i className="fas fa-cog mr-2"></i>Cài đặt
                            </button>
                            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-700 rounded-md">
                                <i className="fas fa-sign-out-alt mr-2"></i>Đăng xuất
                            </button>
                        </div>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 space-y-1">
                        <p className="text-xs font-bold text-gray-500 uppercase px-3 mb-2">MAIN</p>
                        {[
                            { id: "dashboard", icon: "fa-home", label: "Tổng quan" },
                            { id: "bookings", icon: "fa-calendar-check", label: "Đặt phòng", badge: bookings.filter(b => b.status === "pending").length },
                            { id: "rooms", icon: "fa-bed", label: "Quản lý phòng" },
                            { id: "customers", icon: "fa-users", label: "Khách hàng" },
                            { id: "staff", icon: "fa-user-tie", label: "Nhân viên" },
                        ].map(item => (
                            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left ${activeTab === item.id ? "active" : ""}`}>
                                <i className={`fas ${item.icon} w-5`}></i><span>{item.label}</span>
                                {item.badge ? <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">{item.badge}</span> : null}
                            </button>
                        ))}
                    </div>
                    <div className="px-4 space-y-1 mt-6">
                        <p className="text-xs font-bold text-gray-500 uppercase px-3 mb-2">QUẢN LÝ</p>
                        {[
                            { id: "promotions", icon: "fa-tags", label: "Khuyến mãi" },
                            { id: "reports", icon: "fa-chart-line", label: "Báo cáo" },
                            { id: "messages", icon: "fa-envelope", label: "Tin nhắn", badge: messages.reduce((sum, m) => sum + (m.unread || 0), 0) },
                            { id: "settings", icon: "fa-cog", label: "Cài đặt" },
                            { id: "help", icon: "fa-question-circle", label: "Trợ giúp" },
                        ].map(item => (
                            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left ${activeTab === item.id ? "active" : ""}`}>
                                <i className={`fas ${item.icon} w-5`}></i><span>{item.label}</span>
                                {item.badge ? <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">{item.badge}</span> : null}
                            </button>
                        ))}
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-700 flex justify-between items-center text-sm">
                    <span className="text-gray-400">Dark mode</span>
                    <label className="switch">
                        <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
                        <span className="slider"></span>
                    </label>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white shadow-sm z-10 p-4 px-8 flex justify-between items-center border-b dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center gap-4 flex-1">
                        <button className="lg:hidden text-gray-500" onClick={() => { }}>
                            <i className="fas fa-bars text-xl"></i>
                        </button>
                        <div className="relative flex-1 max-w-md">
                            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-emerald-500 outline-none text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                                value={globalSearch}
                                onChange={(e) => { setGlobalSearch(e.target.value); setShowSearchResults(true); }}
                                onFocus={() => setShowSearchResults(true)}
                                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                            />
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto z-20 dark:bg-gray-800 dark:border-gray-700">
                                    {searchResults.map((res, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 hover:bg-gray-50 border-b cursor-pointer dark:hover:bg-gray-700 dark:border-gray-700"
                                            onClick={() => { setGlobalSearch(res.title); setShowSearchResults(false); showToast(`Tìm thấy: ${res.title}`, "info"); }}
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
                            <button className="text-gray-500 hover:text-emerald-600 dark:text-gray-300" onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}>
                                <i className="fas fa-bell text-xl"></i>
                                {notifications.filter((n) => !n.read).length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {notifications.filter((n) => !n.read).length}
                                    </span>
                                )}
                            </button>
                            {isNotifDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-20 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="p-3 border-b flex justify-between dark:border-gray-700">
                                        <span className="font-bold">Thông báo</span>
                                        <button
                                            className="text-xs text-emerald-600"
                                            onClick={() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); showToast("Đã đánh dấu tất cả đã đọc"); }}
                                        >
                                            Đánh dấu đã đọc
                                        </button>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((n) => (
                                            <div key={n.id} className={`p-3 border-b dark:border-gray-700 ${!n.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}>
                                                <p className="text-sm">{n.title}</p>
                                                <p className="text-xs text-gray-400">{n.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="text-sm font-medium text-gray-600 border-l pl-4 dark:text-gray-300 dark:border-gray-600">{currentTime}</div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                    {renderContent()}
                </div>
            </main>

            {/* TOAST */}
            {toast.visible && (
                <div className={`fixed bottom-5 right-5 px-6 py-3 rounded-xl text-white shadow-2xl z-[1000] ${toast.type === "error" ? "bg-red-500" : toast.type === "info" ? "bg-blue-500" : "bg-emerald-500"}`}>
                    {toast.message}
                </div>
            )}

            {/* BOOKING MODAL */}
            {isBookingModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative modal-enter dark:bg-gray-800" ref={bookingFormRef}>
                        <button onClick={closeBookingModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                            <i className="fas fa-times text-2xl"></i>
                        </button>
                        <div className="p-6 border-b dark:border-gray-700">
                            <h2 className="text-xl font-bold">{editBookingId ? "Sửa đặt phòng" : "Thêm đặt phòng mới"}</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {(() => {
                                const booking = editBookingId ? bookings.find(b => b.id === editBookingId) : null;
                                return (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Khách hàng *</label>
                                                <select id="bookingCustomer" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={booking?.customerId || ""}>
                                                    <option value="">Chọn khách hàng</option>
                                                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Phòng *</label>
                                                <select id="bookingRoom" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={booking?.roomId || ""}>
                                                    <option value="">Chọn phòng</option>
                                                    {rooms.filter(r => r.status === "available" || (booking && booking.roomId === r.id)).map(r => (
                                                        <option key={r.id} value={r.id} data-price={r.price}>{r.name} - {formatCurrency(r.price)}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="block text-sm font-medium mb-2">Ngày nhận *</label><input type="date" id="bookingCheckin" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={booking?.checkin || ""} /></div>
                                            <div><label className="block text-sm font-medium mb-2">Ngày trả *</label><input type="date" id="bookingCheckout" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={booking?.checkout || ""} /></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="block text-sm font-medium mb-2">Số khách</label><input type="number" id="bookingGuests" defaultValue={booking?.guests || 2} className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" /></div>
                                            <div><label className="block text-sm font-medium mb-2">Mã khuyến mãi</label><input type="text" id="bookingPromo" placeholder="Nhập mã" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" /></div>
                                        </div>
                                        <div><label className="block text-sm font-medium mb-2">Ghi chú</label><textarea id="bookingNotes" rows={2} className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={booking?.note || ""}></textarea></div>
                                    </>
                                );
                            })()}
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3 dark:border-gray-700">
                            <button onClick={closeBookingModal} className="px-4 py-2 border rounded-lg dark:border-gray-600">Hủy</button>
                            <button onClick={saveBooking} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Lưu</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ROOM MODAL */}
            {isRoomModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative modal-enter dark:bg-gray-800" ref={roomFormRef}>
                        <button onClick={closeRoomModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <i className="fas fa-times text-2xl"></i>
                        </button>
                        <div className="p-6 border-b dark:border-gray-700">
                            <h2 className="text-xl font-bold">{editRoomId ? "Sửa phòng" : "Thêm phòng mới"}</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {(() => {
                                const room = editRoomId ? rooms.find(r => r.id === editRoomId) : null;
                                return (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="block text-sm font-medium mb-2">Tên phòng *</label><input type="text" id="roomName" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={room?.name || ""} /></div>
                                            <div><label className="block text-sm font-medium mb-2">Số phòng *</label><input type="text" id="roomNumber" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={room?.number || ""} /></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="block text-sm font-medium mb-2">Loại phòng</label><select id="roomType" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={room?.type || "Standard"}><option>Standard</option><option>Deluxe</option><option>Suite</option><option>Family</option></select></div>
                                            <div><label className="block text-sm font-medium mb-2">Giá/đêm *</label><input type="number" id="roomPrice" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={room?.price || ""} /></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="block text-sm font-medium mb-2">Diện tích (m²)</label><input type="number" id="roomArea" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={room?.area || ""} /></div>
                                            <div><label className="block text-sm font-medium mb-2">Sức chứa</label><input type="number" id="roomCapacity" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={room?.capacity || 2} /></div>
                                        </div>
                                        <div><label className="block text-sm font-medium mb-2">Tiện ích</label>
                                            <div className="flex gap-4">
                                                <label><input type="checkbox" id="amenityWifi" defaultChecked={room?.amenities.includes("wifi") ?? true} /> WiFi</label>
                                                <label><input type="checkbox" id="amenityTv" defaultChecked={room?.amenities.includes("tv") ?? true} /> TV</label>
                                                <label><input type="checkbox" id="amenityAc" defaultChecked={room?.amenities.includes("ac") ?? true} /> Điều hòa</label>
                                                <label><input type="checkbox" id="amenityBath" defaultChecked={room?.amenities.includes("bath") ?? false} /> Bồn tắm</label>
                                            </div>
                                        </div>
                                        <div><label className="block text-sm font-medium mb-2">Trạng thái</label><select id="roomStatus" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={room?.status || "available"}><option value="available">Phòng trống</option><option value="occupied">Đang có khách</option><option value="maintenance">Đang bảo trì</option></select></div>
                                        <div><label className="block text-sm font-medium mb-2">Mô tả</label><textarea id="roomDesc" rows={2} className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={room?.desc || ""}></textarea></div>
                                    </>
                                );
                            })()}
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3 dark:border-gray-700">
                            <button onClick={closeRoomModal} className="px-4 py-2 border rounded-lg dark:border-gray-600">Hủy</button>
                            <button onClick={saveRoom} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Lưu</button>
                        </div>
                    </div>
                </div>
            )}

            {/* CUSTOMER MODAL */}
            {isCustomerModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full relative modal-enter dark:bg-gray-800" ref={customerFormRef}>
                        <button onClick={closeCustomerModal} className="absolute top-4 right-4 text-gray-400"><i className="fas fa-times text-xl"></i></button>
                        <div className="p-6 border-b dark:border-gray-700"><h2 className="text-xl font-bold">{editCustomerId ? "Sửa khách hàng" : "Thêm khách hàng"}</h2></div>
                        <div className="p-6 space-y-4">
                            {(() => {
                                const customer = editCustomerId ? customers.find(c => c.id === editCustomerId) : null;
                                return (
                                    <>
                                        <div><label className="block text-sm font-medium mb-2">Họ tên *</label><input type="text" id="customerName" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={customer?.name || ""} /></div>
                                        <div><label className="block text-sm font-medium mb-2">Email *</label><input type="email" id="customerEmail" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={customer?.email || ""} /></div>
                                        <div><label className="block text-sm font-medium mb-2">Số điện thoại</label><input type="tel" id="customerPhone" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={customer?.phone || ""} /></div>
                                        <div><label className="block text-sm font-medium mb-2">Địa chỉ</label><input type="text" id="customerAddress" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={customer?.address || ""} /></div>
                                    </>
                                );
                            })()}
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3 dark:border-gray-700">
                            <button onClick={closeCustomerModal} className="px-4 py-2 border rounded-lg dark:border-gray-600">Hủy</button>
                            <button onClick={saveCustomer} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Lưu</button>
                        </div>
                    </div>
                </div>
            )}

            {/* STAFF MODAL */}
            {isStaffModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full relative modal-enter dark:bg-gray-800" ref={staffFormRef}>
                        <button onClick={closeStaffModal} className="absolute top-4 right-4 text-gray-400"><i className="fas fa-times text-xl"></i></button>
                        <div className="p-6 border-b dark:border-gray-700"><h2 className="text-xl font-bold">Thêm nhân viên</h2></div>
                        <div className="p-6 space-y-4">
                            {(() => {
                                const staff = editStaffId ? staffs.find(s => s.id === editStaffId) : null;
                                return (
                                    <>
                                        <div><label className="block text-sm font-medium mb-2">Họ tên *</label><input type="text" id="staffName" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={staff?.name || ""} /></div>
                                        <div><label className="block text-sm font-medium mb-2">Email *</label><input type="email" id="staffEmail" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={staff?.email || ""} /></div>
                                        <div><label className="block text-sm font-medium mb-2">Số điện thoại</label><input type="tel" id="staffPhone" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={staff?.phone || ""} /></div>
                                        <div><label className="block text-sm font-medium mb-2">Vai trò</label><select id="staffRole" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={staff?.role || "receptionist"}><option value="receptionist">Lễ tân</option><option value="housekeeping">Dọn phòng</option><option value="manager">Quản lý</option></select></div>
                                        {!editStaffId && <div><label className="block text-sm font-medium mb-2">Mật khẩu *</label><input type="password" id="staffPassword" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" /></div>}
                                    </>
                                );
                            })()}
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3 dark:border-gray-700">
                            <button onClick={closeStaffModal} className="px-4 py-2 border rounded-lg dark:border-gray-600">Hủy</button>
                            <button onClick={saveStaff} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Lưu</button>
                        </div>
                    </div>
                </div>
            )}

            {/* PROMOTION MODAL */}
            {isPromoModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full relative modal-enter dark:bg-gray-800" ref={promoFormRef}>
                        <button onClick={closePromoModal} className="absolute top-4 right-4 text-gray-400"><i className="fas fa-times text-xl"></i></button>
                        <div className="p-6 border-b dark:border-gray-700"><h2 className="text-xl font-bold">Thêm khuyến mãi</h2></div>
                        <div className="p-6 space-y-4">
                            {(() => {
                                const promo = editPromoId ? promotions.find(p => p.id === editPromoId) : null;
                                return (
                                    <>
                                        <div><label className="block text-sm font-medium mb-2">Tên khuyến mãi *</label><input type="text" id="promoName" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={promo?.name || ""} /></div>
                                        <div><label className="block text-sm font-medium mb-2">Mã code</label><input type="text" id="promoCode" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={promo?.code || ""} /></div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="block text-sm font-medium mb-2">Loại</label><select id="promoType" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={promo?.type || "percent"}><option value="percent">Giảm %</option><option value="fixed">Giảm tiền</option></select></div>
                                            <div><label className="block text-sm font-medium mb-2">Giá trị</label><input type="number" id="promoValue" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={promo?.value || ""} /></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="block text-sm font-medium mb-2">Ngày bắt đầu</label><input type="date" id="promoStart" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={promo?.start || ""} /></div>
                                            <div><label className="block text-sm font-medium mb-2">Ngày kết thúc</label><input type="date" id="promoEnd" className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600" defaultValue={promo?.end || ""} /></div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3 dark:border-gray-700">
                            <button onClick={closePromoModal} className="px-4 py-2 border rounded-lg dark:border-gray-600">Hủy</button>
                            <button onClick={savePromotion} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Lưu</button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRM MODAL */}
            {isDeleteModalOpen && deleteModalData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center dark:bg-gray-800">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{deleteModalData.title}</h3>
                        <p className="text-gray-500 mb-6">{deleteModalData.message}</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={closeDeleteModal} className="px-4 py-2 border rounded-lg dark:border-gray-600">Hủy</button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">Xóa</button>
                        </div>
                    </div>
                </div>
            )}

            {/* STYLES */}
            <style jsx global>{`
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 3px; }
        .sidebar-link { transition: all 0.3s ease; position: relative; overflow: hidden; }
        .sidebar-link::before { content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 0; background: rgba(255,255,255,0.1); transition: width 0.3s; }
        .sidebar-link:hover::before { width: 100%; }
        .sidebar-link.active { background: rgba(16, 185, 129, 0.2); border-left: 3px solid #10b981; }
        .stat-card { transition: all 0.3s ease; cursor: pointer; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -12px rgba(0,0,0,0.15); }
        .progress-bar { height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; background: #10b981; border-radius: 3px; transition: width 0.3s; }
        .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .badge-success { background: #d1fae5; color: #065f46; }
        .badge-warning { background: #fed7aa; color: #92400e; }
        .badge-danger { background: #fee2e2; color: #991b1b; }
        .badge-info { background: #dbeafe; color: #1e40af; }
        .switch { position: relative; display: inline-block; width: 48px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
        .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #10b981; }
        input:checked + .slider:before { transform: translateX(24px); }
        .loading-spinner { border: 3px solid #f3f3f3; border-top: 3px solid #10b981; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .modal-enter { animation: modalFadeIn 0.2s ease-out; }
        .room-card { transition: all 0.3s ease; }
        .room-card:hover { transform: translateY(-5px); box-shadow: 0 12px 20px -8px rgba(0,0,0,0.15); }
        .dark-mode { background-color: #1a202c; color: #f7fafc; }
        .dark-mode .bg-white { background-color: #2d3748; color: #f7fafc; }
        .dark-mode .bg-gray-50 { background-color: #1a202c; }
        .dark-mode .border { border-color: #4a5568; }
        .dark-mode .text-gray-500 { color: #a0aec0; }
        .dark-mode .text-gray-600 { color: #cbd5e0; }
      `}</style>
        </div>
    );
}