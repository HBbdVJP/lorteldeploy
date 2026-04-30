"use client";

import { useDarkMode } from "@/contexts/DarkModeContext"; // thay useAdminDashboard bằng context
import { useState, useEffect, useRef, useCallback } from "react";
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
  Legend,
);
import { useAdminDashboard } from "@/components/useAdminDashboard"; // Đảm bảo đúng đường dẫn

// ─── TYPES ───────────────────────────────────────────────────────────────────
type FinanceTab = "overview" | "salary" | "taxes" | "sheets" | "forum";

interface SalaryDept {
  dept: string;
  count: number;
  total: string;
  avg: string;
  status: string;
}

interface TaxBill {
  id: string;
  type: string;
  issuer: string;
  amount: string;
  due: string;
  status: "Quá hạn" | "Sắp đến hạn" | "Đã thanh toán" | "Chờ thanh toán";
}

interface RefSheet {
  title: string;
  cat: "Thuế" | "Lương" | "Bảo hiểm" | "Quyết toán";
  updated: string;
  desc: string;
}

interface ForumPost {
  id: number;
  tag: string;
  pinned: boolean;
  badge: string;
  date: string;
  author: string;
  title: string;
  body: string;
}

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const salaryDepts: SalaryDept[] = [
  {
    dept: "Lễ tân & Front Office",
    count: 28,
    total: "432M",
    avg: "15.4M",
    status: "Hoàn tất",
  },
  {
    dept: "Ẩm thực & F&B",
    count: 35,
    total: "578M",
    avg: "16.5M",
    status: "Hoàn tất",
  },
  {
    dept: "Kỹ thuật & Hạ tầng",
    count: 18,
    total: "396M",
    avg: "22.0M",
    status: "Hoàn tất",
  },
  {
    dept: "Kinh doanh & Marketing",
    count: 12,
    total: "312M",
    avg: "26.0M",
    status: "Hoàn tất",
  },
  {
    dept: "Tài vụ & Kế toán",
    count: 8,
    total: "248M",
    avg: "31.0M",
    status: "Hoàn tất",
  },
  {
    dept: "Nhân sự & Hành chính",
    count: 10,
    total: "210M",
    avg: "21.0M",
    status: "Đang xử lý",
  },
  {
    dept: "Bảo vệ & An ninh",
    count: 13,
    total: "195M",
    avg: "15.0M",
    status: "Hoàn tất",
  },
];

const initialTaxBills: TaxBill[] = [
  {
    id: "INV-2026-061",
    type: "Thuế GTGT",
    issuer: "Cục Thuế Q4",
    amount: "185,200,000",
    due: "28/06/2026",
    status: "Sắp đến hạn",
  },
  {
    id: "INV-2026-062",
    type: "BHXH",
    issuer: "BHXH TP. HCM",
    amount: "423,500,000",
    due: "25/06/2026",
    status: "Quá hạn",
  },
  {
    id: "INV-2026-063",
    type: "Điện",
    issuer: "EVN TP. HCM",
    amount: "48,750,000",
    due: "30/06/2026",
    status: "Sắp đến hạn",
  },
  {
    id: "INV-2026-064",
    type: "Thuế TNCN",
    issuer: "Cục Thuế Q4",
    amount: "62,300,000",
    due: "20/06/2026",
    status: "Quá hạn",
  },
  {
    id: "INV-2026-065",
    type: "Nước",
    issuer: "SAWACO",
    amount: "12,400,000",
    due: "05/07/2026",
    status: "Chờ thanh toán",
  },
  {
    id: "INV-2026-066",
    type: "Thuế GTGT",
    issuer: "Cục Thuế Q4",
    amount: "198,000,000",
    due: "28/05/2026",
    status: "Đã thanh toán",
  },
  {
    id: "INV-2026-067",
    type: "BHYT",
    issuer: "BHXH TP. HCM",
    amount: "89,100,000",
    due: "25/05/2026",
    status: "Đã thanh toán",
  },
  {
    id: "INV-2026-068",
    type: "Môn bài",
    issuer: "Cục Thuế Q4",
    amount: "3,000,000",
    due: "30/01/2026",
    status: "Đã thanh toán",
  },
  {
    id: "INV-2026-069",
    type: "Internet",
    issuer: "VNPT",
    amount: "8,250,000",
    due: "15/06/2026",
    status: "Quá hạn",
  },
  {
    id: "INV-2026-070",
    type: "Bảo hiểm TS",
    issuer: "Bảo Việt",
    amount: "156,000,000",
    due: "10/07/2026",
    status: "Chờ thanh toán",
  },
];

const refSheets: RefSheet[] = [
  {
    title: "Biểu thuế TNCN lũy tiến 2026",
    cat: "Thuế",
    updated: "01/01/2026",
    desc: "Bảng thuế suất từng bậc thu nhập theo TT 111/2013 cập nhật.",
  },
  {
    title: "Bảng lương tối thiểu vùng 2026",
    cat: "Lương",
    updated: "01/01/2026",
    desc: "Mức lương tối thiểu vùng I–IV áp dụng từ 01/01/2026.",
  },
  {
    title: "Tỷ lệ đóng BHXH / BHYT / BHTN",
    cat: "Bảo hiểm",
    updated: "01/03/2026",
    desc: "Tỷ lệ đóng góp của NLĐ và NSDLĐ theo Luật BHXH sửa đổi.",
  },
  {
    title: "Mẫu quyết toán thuế TNCN (02/QTT)",
    cat: "Thuế",
    updated: "15/02/2026",
    desc: "Tờ khai quyết toán thuế TNCN cá nhân ủy quyền cho DN.",
  },
  {
    title: "Phụ cấp không tính thuế 2026",
    cat: "Lương",
    updated: "01/01/2026",
    desc: "Danh sách các khoản phụ cấp được miễn thuế TNCN.",
  },
  {
    title: "Mẫu phiếu lương nhân viên chuẩn",
    cat: "Lương",
    updated: "01/06/2026",
    desc: "Template phiếu lương đầy đủ khấu trừ BH và thuế.",
  },
  {
    title: "Biểu mẫu đăng ký MST người phụ thuộc",
    cat: "Thuế",
    updated: "01/04/2026",
    desc: "Hướng dẫn đăng ký giảm trừ gia cảnh theo TT 105/2020.",
  },
  {
    title: "Quy định làm thêm giờ & hệ số lương",
    cat: "Lương",
    updated: "01/01/2026",
    desc: "Cách tính lương OT theo BLLĐ 2019 điều 107, 108.",
  },
  {
    title: "Bảng hệ số lương nhà nước 2026",
    cat: "Quyết toán",
    updated: "01/01/2026",
    desc: "Dành cho đơn vị có vốn nhà nước hoặc tham chiếu.",
  },
];

const forumPosts: ForumPost[] = [
  {
    id: 1,
    tag: "salary",
    pinned: true,
    badge: "Mới",
    date: "20/06/2026",
    author: "Bộ LĐTB&XH",
    title: "Tăng lương tối thiểu vùng từ 01/07/2026 – Mức cụ thể từng vùng",
    body: "Chính phủ ban hành NĐ 73/2026 điều chỉnh lương tối thiểu vùng tăng bình quân 6%.",
  },
  {
    id: 2,
    tag: "tax",
    pinned: true,
    badge: "Cập nhật",
    date: "18/06/2026",
    author: "Tổng Cục Thuế",
    title: "Hướng dẫn quyết toán thuế TNCN 2025 – Gia hạn đến 31/08/2026",
    body: "Thông tư 35/2026 gia hạn thời hạn quyết toán thuế TNCN cho cá nhân và tổ chức trả thu nhập.",
  },
  {
    id: 3,
    tag: "insurance",
    pinned: false,
    badge: "Thảo luận",
    date: "16/06/2026",
    author: "HRM Forum VN",
    title: "BHXH điện tử: Doanh nghiệp cần làm gì trước 30/06?",
    body: "Các bước chuẩn bị hồ sơ điện tử, kê khai và nộp BHXH qua cổng BHXH số.",
  },
  {
    id: 4,
    tag: "policy",
    pinned: false,
    badge: "Chính sách",
    date: "14/06/2026",
    author: "Bộ Tài chính",
    title: "Sửa đổi biểu thuế suất thuế GTGT – Dự thảo Luật mới nhất",
    body: "Bộ Tài chính lấy ý kiến về việc điều chỉnh thuế suất GTGT từ 10% xuống 8% cho một số ngành.",
  },
  {
    id: 5,
    tag: "salary",
    pinned: false,
    badge: "Hỏi đáp",
    date: "12/06/2026",
    author: "Cộng đồng HR",
    title: "Tính lương thử việc đúng luật – Tối thiểu 85% hay 100%?",
    body: "Thảo luận về quy định tính lương trong thời gian thử việc theo điều 27 BLLĐ 2019.",
  },
  {
    id: 6,
    tag: "tax",
    pinned: false,
    badge: "Hướng dẫn",
    date: "10/06/2026",
    author: "Tổng Cục Thuế",
    title: "Hoá đơn điện tử khởi tạo từ máy tính tiền – lộ trình bắt buộc 2026",
    body: "Các cơ sở kinh doanh dịch vụ bắt buộc dùng HĐĐT từ máy tính tiền từ 01/07/2026.",
  },
  {
    id: 7,
    tag: "insurance",
    pinned: false,
    badge: "Tin tức",
    date: "08/06/2026",
    author: "BHXH VN",
    title: "Quỹ hưu trí 2026: Mức đóng tối đa tăng lên 36 triệu/tháng",
    body: "Điều chỉnh mức thu nhập tính đóng BHXH tối đa theo lương cơ sở mới.",
  },
  {
    id: 8,
    tag: "policy",
    pinned: false,
    badge: "Phân tích",
    date: "05/06/2026",
    author: "Tax Experts VN",
    title: "So sánh chính sách thuế doanh nghiệp Việt Nam vs ASEAN 2026",
    body: "Góc nhìn phân tích thuế suất TNDN Việt Nam (20%) so với Singapore (17%), Thái Lan (20%).",
  },
];
const monthlyData = [
  850, 920, 1100, 980, 1250, 1400, 1350, 1420, 1380, 1450, 1520, 1680,
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const statusColor = (s: TaxBill["status"]) => {
  if (s === "Quá hạn") return "bg-red-100 text-red-700";
  if (s === "Sắp đến hạn") return "bg-amber-100 text-amber-700";
  if (s === "Đã thanh toán") return "bg-green-100 text-green-700";
  return "bg-slate-100 text-slate-600";
};

const catColor = (c: RefSheet["cat"]) =>
  ({
    Thuế: "bg-red-100 text-red-700",
    Lương: "bg-blue-100 text-blue-700",
    "Bảo hiểm": "bg-purple-100 text-purple-700",
    "Quyết toán": "bg-amber-100 text-amber-700",
  })[c] ?? "bg-slate-100 text-slate-600";

const badgeColor = (b: string) =>
  ({
    Mới: "bg-green-100 text-green-700",
    "Cập nhật": "bg-blue-100 text-blue-700",
    "Thảo luận": "bg-purple-100 text-purple-700",
    "Chính sách": "bg-slate-200 text-slate-600",
    "Hỏi đáp": "bg-amber-100 text-amber-700",
    "Hướng dẫn": "bg-teal-100 text-teal-700",
    "Tin tức": "bg-orange-100 text-orange-700",
    "Phân tích": "bg-rose-100 text-rose-700",
  })[b] ?? "bg-slate-100 text-slate-600";

const salaryChartData = {
  labels: ["T1", "T2", "T3", "T4", "T5", "T6"],
  datasets: [
    {
      label: "Quỹ lương (M VND)",
      data: [4120, 4250, 4310, 4550, 4670, 4820],
      backgroundColor: "#1e293b",
      borderRadius: 4,
    },
  ],
};

const salaryChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      grid: { color: "#f1f5f9" },
      ticks: { font: { family: "IBM Plex Mono", size: 9 }, color: "#94a3b8" },
    },
    x: {
      grid: { display: false },
      ticks: { font: { family: "IBM Plex Mono", size: 9 }, color: "#94a3b8" },
    },
  },
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<FinanceTab>("overview");
  const [taxBills, setTaxBills] = useState<TaxBill[]>(initialTaxBills);
  const [sheetSearch, setSheetSearch] = useState("");
  const [forumFilter, setForumFilter] = useState("all");
  const [currentTime, setCurrentTime] = useState("");
  const [branch, setBranch] = useState("br-001");
  const { isDarkMode } = useDarkMode();
  const { customers, bookings, formatCurrency } = useAdminDashboard();
  const statusData = [
    bookings.filter((b) => b.status === "confirmed").length,
    bookings.filter((b) => b.status === "pending").length,
    bookings.filter((b) => b.status === "completed").length,
  ];

  // Bill Modal
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [billForm, setBillForm] = useState({
    type: "Thuế TNCN",
    issuer: "",
    amount: "",
    due: "",
  });

  // Toast
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((message: string, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  // Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        `${now.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })} - ${now.toLocaleTimeString("vi-VN", { hour12: false })}`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const markPaid = (id: string) => {
    setTaxBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Đã thanh toán" } : b)),
    );
    showToast("Đã đánh dấu thanh toán");
  };

  const addBill = () => {
    if (!billForm.amount) {
      showToast("Vui lòng nhập số tiền", "error");
      return;
    }
    const newId = `INV-2026-${String(taxBills.length + 61).padStart(3, "0")}`;
    const formatted = Number(billForm.amount).toLocaleString("vi-VN");
    const due = billForm.due
      ? new Date(billForm.due).toLocaleDateString("vi-VN")
      : "—";
    setTaxBills((prev) => [
      {
        id: newId,
        type: billForm.type,
        issuer: billForm.issuer || "—",
        amount: formatted,
        due,
        status: "Chờ thanh toán",
      },
      ...prev,
    ]);
    setBillForm({ type: "Thuế TNCN", issuer: "", amount: "", due: "" });
    setIsBillModalOpen(false);
    showToast("Đã thêm hóa đơn mới");
  };

  const filteredSheets = refSheets.filter(
    (s) =>
      s.title.toLowerCase().includes(sheetSearch.toLowerCase()) ||
      s.cat.toLowerCase().includes(sheetSearch.toLowerCase()),
  );

  const filteredForum =
    forumFilter === "all"
      ? forumPosts
      : forumPosts.filter((p) => p.tag === forumFilter);
  const pinnedPosts = forumPosts.filter((p) => p.pinned);

  const overdueCount = taxBills.filter((b) => b.status === "Quá hạn").length;
  const upcomingCount = taxBills.filter(
    (b) => b.status === "Sắp đến hạn",
  ).length;
  const paidCount = taxBills.filter((b) => b.status === "Đã thanh toán").length;

  // Nav items
  const navItems: { id: FinanceTab; label: string }[] = [
    { id: "overview", label: "Báo cáo tài chính" },
    { id: "salary", label: "Thống kê lương" },
    { id: "taxes", label: "Thuế & Hóa đơn" },
    { id: "sheets", label: "Biểu mẫu tham chiếu" },
    { id: "forum", label: "Diễn đàn / Tin tức" },
  ];

  return (
    <div
      className={`${isDarkMode ? "dark" : ""} bg-main transition-colors duration-300`}
    >
      {/* HEADER */}
      <header className=" bg-slate-900 px-6 py-3 flex sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <div className="border-l pl-4 text-sm font-black text-white uppercase">
            Tài vụ &amp; Kế toán
          </div>
        </div>
      </header>
      {/* Tabs Navigation - Fixed dưới header */}

      <div className="tab-container overflow-x-auto no-scrollbar">
        {[
          { id: "overview", label: "Báo cáo tài chính", icon: "fa-chart-line" },
          { id: "salary", label: "Bảng lương", icon: "fa-money-bill-wave" },
          {
            id: "taxes",
            label: "Thuế & Hoá đơn",
            icon: "fa-file-invoice-dollar",
          },
          { id: "sheets", label: "Tài liệu tham khảo", icon: "fa-book" },
          { id: "forum", label: "Thảo luận nội bộ", icon: "fa-users" },
        ].map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id as FinanceTab)}
            className={`tab-item flex items-center gap-2 ${
              activeTab === tab.id ? "tab-item-active" : "tab-item-inactive"
            }`}
          >
            <i className={`fas ${tab.icon} text-xs`}></i>
            {tab.label}
          </div>
        ))}
      </div>
      {/* MAIN BODY */}
      <main className=" bg-slate-800/50 flex-1 flex overflow-hidden">
        {/* CONTENT */}
        <section className="flex-1 overflow-hidden p-5 flex flex-col gap-4">
          {/* Branch Selector */}
          <div className="shrink-0">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Chi nhánh đang xem
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-72 bg-slate-800 border border-slate-700 text-slate-700 text-[11px] font-bold uppercase rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="br-001">Riverside Premium</option>
              <option value="br-002">City Center Luxury</option>
              <option value="br-003">Beachfront Resort</option>
            </select>
          </div>

          {/* ─── TAB 0: OVERVIEW ─── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Báo cáo & Thống kê</h1>
              <div className="bg-white p-4 rounded-xl shadow-sm dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select className="border border-slate-700 rounded-lg px-2">
                    <option value="revenue">Doanh thu</option>
                    <option value="bookings">Đặt phòng</option>
                  </select>
                  <select
                    defaultValue="month"
                    className="border border-slate-700 rounded-lg px-2"
                  >
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    <option value="year">Năm này</option>
                  </select>
                  <button
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm"
                    onClick={() => showToast("Đang tạo báo cáo...", "info")}
                  >
                    <i className="fas fa-chart-line mr-2"></i>Tạo báo cáo
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm dark:bg-gray-800">
                  <h3 className="font-bold mb-3">
                    Doanh thu theo tháng (Triệu VNĐ)
                  </h3>
                  <div className="h-50">
                    <Bar
                      data={{
                        labels: [
                          "T1",
                          "T2",
                          "T3",
                          "T4",
                          "T5",
                          "T6",
                          "T7",
                          "T8",
                          "T9",
                          "T10",
                          "T11",
                          "T12",
                        ],
                        datasets: [
                          {
                            label: "Doanh thu",
                            data: monthlyData,
                            backgroundColor: "#10b981",
                          },
                        ],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm dark:bg-gray-800">
                  <h3 className="font-bold mb-3">Trạng thái đặt phòng</h3>
                  <div className="h-50">
                    <Doughnut
                      data={{
                        labels: ["Đã xác nhận", "Chờ xác nhận", "Hoàn thành"],
                        datasets: [
                          {
                            data: statusData,
                            backgroundColor: ["#10b981", "#f59e0b", "#3b82f6"],
                          },
                        ],
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
                      <div
                        key={c.id}
                        className="flex justify-between items-center"
                      >
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
                  <button
                    className="px-4 py-2 border rounded-lg hover:bg-slate-700"
                    onClick={() => showToast("Đang xuất PDF...", "info")}
                  >
                    <i className="fas fa-file-pdf text-red-500 mr-2"></i>PDF
                  </button>
                  <button
                    className="px-4 py-2 border rounded-lg hover:bg-slate-700"
                    onClick={() => showToast("Đang xuất Excel...", "info")}
                  >
                    <i className="fas fa-file-excel text-green-500 mr-2"></i>
                    Excel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 1: SALARY ─── */}
          {activeTab === "salary" && (
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {/* KPI Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
                <div className="bg-slate-800 rounded border border-slate-700 p-4 hover:-translate-y-0.5 hover:shadow-md transition-all">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Tổng quỹ lương T6
                  </p>
                  <p className="font-mono font-bold text-2xl text-slate-900 tracking-tight">
                    4.82 Tỷ
                  </p>
                  <p className="text-[10px] text-green-600 mt-1 font-bold">
                    ▲ +3.2% so tháng trước
                  </p>
                </div>
                <div className="bg-slate-800 rounded border border-slate-700 p-4 hover:-translate-y-0.5 hover:shadow-md transition-all">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Lương TB / nhân viên
                  </p>
                  <p className="font-mono font-bold text-2xl text-slate-900 tracking-tight">
                    18.9 Triệu
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-bold">
                    124 nhân sự active
                  </p>
                </div>
                <div className="bg-slate-800 rounded border border-slate-700 p-4 hover:-translate-y-0.5 hover:shadow-md transition-all">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Thưởng KPI tháng
                  </p>
                  <p className="font-mono font-bold text-2xl text-amber-600 tracking-tight">
                    312 Triệu
                  </p>
                  <p className="text-[10px] text-green-600 mt-1 font-bold">
                    ▲ +8.5% vs T5
                  </p>
                </div>
                <div className="bg-slate-800 rounded border border-slate-700 p-4 hover:-translate-y-0.5 hover:shadow-md transition-all">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Trạng thái chi trả
                  </p>
                  <p className="font-mono font-bold text-2xl text-green-600 tracking-tight">
                    Hoàn tất
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-bold">
                    Ngày 25/06/2026
                  </p>
                </div>
              </div>

              {/* Chart + Table */}
              <div className="flex gap-4 flex-1 overflow-hidden min-h-0">
                {/* Bar chart */}
                <div className="bg-slate-800 rounded border border-slate-700 p-4 flex flex-col w-72 shrink-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Lương 6 tháng gần nhất (triệu VND)
                  </p>
                  <div className="flex-1 min-h-0 relative">
                    <Bar data={salaryChartData} options={salaryChartOptions} />
                  </div>
                </div>

                {/* Department Table */}
                <div className="bg-slate-800 rounded border border-slate-700 flex-1 flex flex-col overflow-hidden">
                  <div className="p-3 border-b border-slate-700 bg-slate-800 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-xs uppercase tracking-tighter text-slate-700">
                      Chi tiết lương theo phòng ban
                    </h3>
                    <button
                      onClick={() => showToast("Đang xuất Excel...", "info")}
                      className="bg-slate-800 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-slate-700 transition"
                    >
                      Xuất Excel
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-slate-100 text-slate-600 sticky top-0 uppercase font-black">
                        <tr>
                          <th className="p-3 border-b">Phòng ban</th>
                          <th className="p-3 border-b text-center">Nhân sự</th>
                          <th className="p-3 border-b text-right">
                            Tổng lương
                          </th>
                          <th className="p-3 border-b text-right">Lương TB</th>
                          <th className="p-3 border-b text-center">
                            Trạng thái
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {salaryDepts.map((d, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition">
                            <td className="p-3 font-bold text-slate-700">
                              {d.dept}
                            </td>
                            <td className="p-3 text-center font-mono text-slate-600">
                              {d.count}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-blue-600">
                              {d.total}
                            </td>
                            <td className="p-3 text-right font-mono text-slate-600">
                              {d.avg}
                            </td>
                            <td className="p-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${d.status === "Hoàn tất" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                              >
                                {d.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 2: TAXES & BILLS ─── */}
          {activeTab === "taxes" && (
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {/* Summary pills */}
              <div className="grid grid-cols-3 gap-3 shrink-0">
                <div className="bg-slate-800 rounded border border-slate-700 p-4 border-l-4 border-l-red-500 hover:-translate-y-0.5 hover:shadow-md transition-all">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Hóa đơn quá hạn
                  </p>
                  <p className="font-mono font-bold text-3xl text-red-600">
                    {overdueCount}
                  </p>
                </div>
                <div className="bg-slate-800 rounded border border-slate-700 p-4 border-l-4 border-l-amber-500 hover:-translate-y-0.5 hover:shadow-md transition-all">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Đến hạn trong 7 ngày
                  </p>
                  <p className="font-mono font-bold text-3xl text-amber-600">
                    {upcomingCount}
                  </p>
                </div>
                <div className="bg-slate-800 rounded border border-slate-700 p-4 border-l-4 border-l-green-500 hover:-translate-y-0.5 hover:shadow-md transition-all">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Đã thanh toán T6
                  </p>
                  <p className="font-mono font-bold text-3xl text-green-600">
                    {paidCount}
                  </p>
                </div>
              </div>

              {/* Bills Table */}
              <div className="bg-slate-800 rounded border border-slate-700 flex-1 flex flex-col overflow-hidden">
                <div className="p-3 border-b border-slate-700 bg-slate-800 flex justify-between items-center shrink-0">
                  <h3 className="font-bold text-xs uppercase tracking-tighter text-slate-700">
                    Danh sách thuế &amp; hoá đơn
                  </h3>
                  <div className="flex items-center gap-2">
                    <select className="border rounded text-[10px] font-bold px-2 py-1 text-slate-600 outline-none">
                      <option>Tất cả trạng thái</option>
                      <option>Quá hạn</option>
                      <option>Sắp đến hạn</option>
                      <option>Đã thanh toán</option>
                    </select>
                    <button
                      onClick={() => setIsBillModalOpen(true)}
                      className="bg-amber-500 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-amber-600 transition"
                    >
                      + Thêm hóa đơn
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 text-slate-600 sticky top-0 uppercase font-black">
                      <tr>
                        <th className="p-3 border-b">Mã HĐ</th>
                        <th className="p-3 border-b">Loại</th>
                        <th className="p-3 border-b">Đơn vị phát hành</th>
                        <th className="p-3 border-b text-right">Số tiền</th>
                        <th className="p-3 border-b text-center">Hạn nộp</th>
                        <th className="p-3 border-b text-center">Trạng thái</th>
                        <th className="p-3 border-b text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {taxBills.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 font-mono text-slate-500">
                            {d.id}
                          </td>
                          <td className="p-3 font-bold text-slate-700">
                            {d.type}
                          </td>
                          <td className="p-3 text-slate-600">{d.issuer}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-800">
                            {d.amount} ₫
                          </td>
                          <td className="p-3 text-center font-mono text-slate-600">
                            {d.due}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${statusColor(d.status)}`}
                            >
                              {d.status}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {d.status !== "Đã thanh toán" ? (
                              <button
                                onClick={() => markPaid(d.id)}
                                className="text-[9px] font-black uppercase bg-slate-800 text-white px-2 py-1 rounded hover:bg-slate-600 transition"
                              >
                                Đã nộp
                              </button>
                            ) : (
                              <span className="text-[9px] text-slate-300 font-bold uppercase">
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 3: REFERENCE SHEETS ─── */}
          {activeTab === "sheets" && (
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {/* Search bar */}
              <div className="flex items-center gap-3 shrink-0">
                <input
                  type="text"
                  placeholder="Tìm kiếm biểu mẫu..."
                  value={sheetSearch}
                  onChange={(e) => setSheetSearch(e.target.value)}
                  className="flex-1 border rounded p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 bg-white"
                />
                <select className="border rounded text-[10px] font-bold px-3 py-2 text-slate-600 outline-none bg-white">
                  <option>Tất cả loại</option>
                  <option>Lương</option>
                  <option>Thuế</option>
                  <option>Bảo hiểm</option>
                  <option>Quyết toán</option>
                </select>
              </div>

              {/* Sheets Grid */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredSheets.map((s, i) => (
                    <div
                      key={i}
                      className="bg-slate-800 rounded border border-slate-700 p-4 flex flex-col gap-2 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[11px] font-black text-slate-800 leading-snug">
                          {s.title}
                        </p>
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-black uppercase ${catColor(s.cat)}`}
                        >
                          {s.cat}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        {s.desc}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t">
                        <span className="text-[9px] font-mono text-slate-400">
                          Cập nhật: {s.updated}
                        </span>
                        <button
                          onClick={() =>
                            showToast(`Đang tải: ${s.title}`, "info")
                          }
                          className="text-[9px] font-black text-blue-600 uppercase hover:underline"
                        >
                          Tải xuống ↓
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredSheets.length === 0 && (
                    <p className="text-[11px] text-slate-400 font-bold col-span-3 py-8 text-center">
                      Không tìm thấy biểu mẫu nào.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 4: FORUM / NEWS ─── */}
          {activeTab === "forum" && (
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {/* Filter chips */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <span className="text-[10px] font-black text-slate-400 uppercase mr-1">
                  Lọc:
                </span>
                {[
                  { key: "all", label: "Tất cả" },
                  { key: "salary", label: "Luật lương" },
                  { key: "tax", label: "Thuế" },
                  { key: "insurance", label: "Bảo hiểm" },
                  { key: "policy", label: "Chính sách" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setForumFilter(f.key)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                      forumFilter === f.key
                        ? "bg-slate-800 text-white"
                        : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 flex-1 overflow-hidden min-h-0">
                {/* News Feed */}
                <div className="flex-1 overflow-y-auto space-y-2">
                  {filteredForum.length === 0 && (
                    <p className="text-[11px] text-slate-400 font-bold p-4">
                      Không có bài viết nào.
                    </p>
                  )}
                  {filteredForum.map((p) => (
                    <div
                      key={p.id}
                      className="bg-slate-800 rounded border border-slate-700 p-4 cursor-pointer border-l-[3px] border-l-transparent hover:bg-slate-50 hover:border-l-blue-500 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${badgeColor(p.badge)}`}
                        >
                          {p.badge}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                          {p.author}
                        </span>
                        <span className="text-[9px] font-mono text-slate-300 ml-auto">
                          {p.date}
                        </span>
                      </div>
                      <h4 className="text-[12px] font-black text-slate-800 mb-1">
                        {p.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        {p.body}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Sidebar: Pinned + Deadlines */}
                <div className="w-64 shrink-0 space-y-4 overflow-y-auto">
                  <div className="bg-slate-800 rounded border border-slate-700 p-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      📌 Ghim quan trọng
                    </p>
                    <div className="space-y-2">
                      {pinnedPosts.map((p) => (
                        <div
                          key={p.id}
                          className="border-b pb-2 last:border-0 cursor-pointer"
                        >
                          <p className="text-[10px] font-bold text-slate-700 hover:text-blue-600 leading-snug transition">
                            {p.title}
                          </p>
                          <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                            {p.date}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded p-4 text-white">
                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-3">
                      Hiệu lực sắp tới
                    </p>
                    <ul className="space-y-2 text-[10px] text-slate-300 font-bold">
                      <li className="flex justify-between">
                        <span>Lương tối thiểu mới</span>
                        <span className="text-amber-400">01/07/2026</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Điều chỉnh BHXH</span>
                        <span className="text-amber-400">01/01/2027</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Quyết toán thuế TNCN</span>
                        <span className="text-amber-400">31/03/2027</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ─── BILL MODAL ─── */}
      {isBillModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 w-full max-w-md overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">
                Thêm hoá đơn / Khoản thuế mới
              </h3>
              <button
                onClick={() => setIsBillModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Loại
                  </label>
                  <select
                    value={billForm.type}
                    onChange={(e) =>
                      setBillForm((f) => ({ ...f, type: e.target.value }))
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>Thuế TNCN</option>
                    <option>Thuế GTGT</option>
                    <option>BHXH</option>
                    <option>Điện / Nước</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Đơn vị phát hành
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Cục thuế Q4"
                    value={billForm.issuer}
                    onChange={(e) =>
                      setBillForm((f) => ({ ...f, issuer: e.target.value }))
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Số tiền (VND)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={billForm.amount}
                    onChange={(e) =>
                      setBillForm((f) => ({ ...f, amount: e.target.value }))
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Hạn nộp
                  </label>
                  <input
                    type="date"
                    value={billForm.due}
                    onChange={(e) =>
                      setBillForm((f) => ({ ...f, due: e.target.value }))
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={addBill}
                className="w-full bg-amber-500 text-white font-black py-3 rounded uppercase text-xs tracking-widest hover:bg-amber-600 transition"
              >
                Xác nhận thêm hoá đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.visible && (
        <div
          className={`fixed bottom-5 right-5 px-6 py-3 rounded-xl text-white shadow-2xl z-1000 text-sm font-bold transition-all ${
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
