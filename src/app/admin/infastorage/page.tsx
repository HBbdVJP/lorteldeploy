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
type InfrastorageTab = "overview" | "branch" | "infrastructure" | "storage" | "services";
type BuildingStatus = "Active" | "Maintenance" | "Closed";
type RoomStatus = "Available" | "Occupied" | "Maintenance" | "Reserved";
type StorageItemStatus = "InStock" | "LowStock" | "OutOfStock";
type ServiceStatus = "Active" | "Inactive";
type BuildingType =
  | "Hotel"
  | "Resort"
  | "Villa"
  | "Apartment"
  | "MixedUse";

type RoomType =
  | "Standard"
  | "Deluxe"
  | "Suite"
  | "Conference"
  | "ServiceRoom";


//---- Interface Building

interface Branch {
  id: string;

  // identity
  name: string;
  type: BuildingType;
  starRating: number;

  // location
  address: string;
  city: string;
  country: string;

  // scale
  totalFloors: number;
  totalRooms: number;
  totalArea: number; // m2

  // infrastructure
  elevatorCount: number;
  parkingCapacity: number;

  // management
  managedBy: string;
  staffCount: number;

  // operational
  status: BuildingStatus;
  openingDate: string;
}

// ---- Interface Room
interface Infrastructure {
  id: string;

  branchId: string; // FK -> Branch

  name: string;
  type: RoomType;

  floor: number;
  area: number; // m2
  capacity: number;

  pricePerNight: number;

  status: RoomStatus;

  hasWifi: boolean;
  hasAC: boolean;
  hasBathroom: boolean;
}

// ---- Interface Storage Item
interface Storage {
  id: string;

  branchId: string; // FK -> Branch

  name: string;
  category: string; // khăn, chăn, minibar, vệ sinh...

  quantity: number;
  unit: string; // pcs, box, set...

  importDate: string;
  expiryDate?: string | null;

  minThreshold: number;

  status: StorageItemStatus;
}

// ---- Interface Service
interface Service {
  id: string;

  branchId: string; // FK -> Branch

  name: string;
  category: "Basic" | "Premium" | "Facility";

  price: number;
  unit: string; // per day, per use...

  available24h: boolean;

  status: ServiceStatus;

  description?: string;
}

interface InfraStorageData {
  branches: Branch[];
  infrastructures: Infrastructure[];
  storageItems: Storage[];
  services: Service[];
}

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
import data from "@/data/infrastorageDummyData.json";

const infraData = data as InfraStorageData;
// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function InfastoragePage() {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<InfrastorageTab>("overview");
  const [selectedBranch, setSelectedBranch] = useState(infraData.branches[0]?.id || "");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [pendingImports, setPendingImports] = useState<any[]>([]);
  const [importFormData, setImportFormData] = useState({
    itemName: "",
    itemQty: "",
    itemSupplier: "",
  });
  const [showImportModal, setShowImportModal] = useState(false);

  // Get data for current branch
  const getCurrentBranchData = () =>
    infraData.branches.find((b) => b.id === selectedBranch);
  const getCurrentInfrastructures = () =>
    infraData.infrastructures.filter((i) => i.branchId === selectedBranch);
  const getCurrentStorageItems = () =>
    infraData.storageItems.filter((s) => s.branchId === selectedBranch);
  const getCurrentServices = () =>
    infraData.services.filter((s) => s.branchId === selectedBranch);

  // Update date time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("vi-VN", { hour12: false });
      setCurrentDateTime(`${dateStr} - ${timeStr}`);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleImportSubmit = () => {
    if (!importFormData.itemName || !importFormData.itemQty) return;

    const newImport = {
      id: Date.now(),
      name: importFormData.itemName,
      qty: importFormData.itemQty,
      supplier: importFormData.itemSupplier,
    };

    setPendingImports([...pendingImports, newImport]);
    setImportFormData({ itemName: "", itemQty: "", itemSupplier: "" });
    setShowImportModal(false);
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""} bg-slate-100 dark:bg-slate-900 transition-colors duration-300 h-screen flex flex-col`}>
      {/* HEADER */}
      <header className="bg-slate-900 px-6 py-3 flex sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-4">
          <div className="border-l border-slate-700 pl-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              {currentDateTime}
            </span>
            <h1 className="text-sm font-black text-white uppercase">
              Quản lý hạ tầng & Dịch vụ
            </h1>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-300">Admin</span>
          <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold">
            INF
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="tab-container overflow-x-auto no-scrollbar bg-slate-800 border-b border-slate-700 px-6 flex">
        {[
          { id: "overview", label: "Tổng quan chi nhánh" },
          { id: "infrastructure", label: "Cơ sở hạ tầng" },
          { id: "storage", label: "Kho bãi" },
          { id: "services", label: "Dịch vụ" },
        ].map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id as InfrastorageTab)}
            className={`tab-item flex items-center gap-2 px-4 py-3 cursor-pointer border-b-2 transition-colors text-[12px] font-bold uppercase whitespace-nowrap ${
              activeTab === tab.id
                ? "text-amber-400 border-amber-400 bg-slate-900/30"
                : "text-slate-400 border-transparent hover:text-slate-300"
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* MAIN BODY */}
      <main className="flex-1 flex overflow-hidden bg-slate-800/50">
        {/* CONTENT */}
        <section className="flex-1 overflow-y-auto p-6">
          {/* Branch Selector */}
          <div className="mb-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Chi nhánh đang xem
            </h3>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-[11px] font-bold uppercase rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
            >
              {infraData.branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tab: Tổng quan chi nhánh */}
          {activeTab === "overview" && getCurrentBranchData() && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                      {getCurrentBranchData()?.name}
                    </h2>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                      {getCurrentBranchData()?.status}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-[11px]">
                    <p className="flex items-center">
                      <span className="text-gray-400 font-bold uppercase text-[9px] w-24 shrink-0">
                        Mã số:
                      </span>
                      <b className="text-slate-700">{getCurrentBranchData()?.id}</b>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-400 font-bold uppercase text-[9px] w-24 shrink-0">
                        Phân loại:
                      </span>
                      <b className="text-slate-700">{getCurrentBranchData()?.type}</b>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-400 font-bold uppercase text-[9px] w-24 shrink-0">
                        Số tầng:
                      </span>
                      <b className="text-blue-600 font-black">
                        {getCurrentBranchData()?.totalFloors}
                      </b>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-400 font-bold uppercase text-[9px] w-24 shrink-0">
                        Số phòng:
                      </span>
                      <b className="text-blue-600 font-black">
                        {getCurrentBranchData()?.totalRooms}
                      </b>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-400 font-bold uppercase text-[9px] w-24 shrink-0">
                        Nhân sự:
                      </span>
                      <b className="text-slate-700">{getCurrentBranchData()?.staffCount}</b>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-400 font-bold uppercase text-[9px] w-24 shrink-0">
                        Diện tích:
                      </span>
                      <b className="text-slate-700">{getCurrentBranchData()?.totalArea} m²</b>
                    </p>
                    <p className="flex items-center col-span-full">
                      <span className="text-gray-400 font-bold uppercase text-[9px] w-24 shrink-0">
                        Người quản lý:
                      </span>
                      <span className="flex items-center font-black uppercase text-[10px] text-green-600">
                        <span className="w-2 h-2 rounded-full animate-pulse mr-2 bg-green-500" />
                        {getCurrentBranchData()?.managedBy}
                      </span>
                    </p>
                    <p className="flex items-start col-span-full">
                      <span className="text-gray-400 font-bold uppercase text-[9px] w-24 shrink-0">
                        Địa chỉ:
                      </span>
                      <b className="text-slate-700">
                        {getCurrentBranchData()?.address}, {getCurrentBranchData()?.city},{" "}
                        {getCurrentBranchData()?.country}
                      </b>
                    </p>
                  </div>

                  <div className="mt-2 p-2 border-l-4 bg-green-50 border-green-500 rounded">
                    <p className="flex items-center text-green-700">
                      <span className="font-black uppercase text-[9px] mr-3">Ngày khai trương:</span>
                      <span className="font-medium text-[11px]">
                        {getCurrentBranchData()?.openingDate}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Branch Image */}
                <div className="shrink-0 group relative">
                  <div className="w-64 h-40 bg-slate-200 rounded-lg overflow-hidden border-2 border-slate-300 shadow-inner">
                    <img
                      src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop`}
                      alt={getCurrentBranchData()?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-transform active:scale-95">
                    <svg
                      className="w-3.5 h-3.5 text-slate-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Cơ sở hạ tầng */}
          {activeTab === "infrastructure" && (
            <div className="bg-white rounded border h-full flex flex-col overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase tracking-tighter">
                  Danh sách phòng & cơ sở hạ tầng
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-100 text-slate-600 sticky top-0 uppercase font-black">
                    <tr>
                      <th className="p-4 border-b">Tên phòng</th>
                      <th className="p-4 border-b">Loại</th>
                      <th className="p-4 border-b text-center">Sức chứa</th>
                      <th className="p-4 border-b">Trạng thái</th>
                      <th className="p-4 border-b text-right">Giá/đêm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {getCurrentInfrastructures().length > 0 ? (
                      getCurrentInfrastructures().map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="p-4 font-bold uppercase text-slate-700">
                            {item.name}
                          </td>
                          <td className="p-4">{item.type}</td>
                          <td className="p-4 text-center font-mono">{item.capacity}</td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                item.status === "Available"
                                  ? "bg-green-100 text-green-700"
                                  : item.status === "Occupied"
                                    ? "bg-blue-100 text-blue-700"
                                    : item.status === "Maintenance"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold text-blue-600">
                            ${item.pricePerNight}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Kho bãi */}
          {activeTab === "storage" && (
            <div className="bg-white rounded border h-full flex flex-col overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase tracking-tighter">
                  Quản lý vật phẩm & Kho bãi
                </h3>
                <div className="space-x-2">
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="bg-slate-800 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-slate-700"
                  >
                    Nhập kho
                  </button>
                  <button className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-slate-300">
                    Xuất báo cáo
                  </button>
                </div>
              </div>

              {pendingImports.length > 0 && (
                <div className="p-4 space-y-2 bg-slate-50 border-b">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase mb-2">
                    Yêu cầu nhập kho đang chờ
                  </h4>
                  {pendingImports.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-amber-50 border border-amber-200 p-3 rounded-lg shadow-sm animate-pulse mb-2"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-amber-500 rounded-full" />
                        <div>
                          <h4 className="text-[11px] font-black text-slate-800 uppercase">
                            {item.name}
                          </h4>
                          <p className="text-[9px] text-amber-700 font-bold uppercase">
                            Số lượng: {item.qty} | NCC: {item.supplier}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-100 text-slate-600 sticky top-0 uppercase font-black">
                    <tr>
                      <th className="p-4 border-b">Vật phẩm</th>
                      <th className="p-4 border-b">Danh mục</th>
                      <th className="p-4 border-b text-center">Số lượng</th>
                      <th className="p-4 border-b text-center">Ngưỡng tối thiểu</th>
                      <th className="p-4 border-b text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {getCurrentStorageItems().length > 0 ? (
                      getCurrentStorageItems().map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="p-4 font-bold uppercase text-slate-700">
                            {item.name}
                          </td>
                          <td className="p-4 text-sm">{item.category}</td>
                          <td className="p-4 text-center font-mono text-lg">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="p-4 text-center text-gray-400 font-bold uppercase">
                            {item.minThreshold}
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                                item.status === "InStock"
                                  ? "bg-green-100 text-green-700"
                                  : item.status === "LowStock"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.status === "InStock"
                                ? "Có sẵn"
                                : item.status === "LowStock"
                                  ? "Sắp hết"
                                  : "Hết"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Dịch vụ */}
          {activeTab === "services" && (
            <div className="bg-white rounded border h-full flex flex-col overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase tracking-tighter">
                  Danh sách dịch vụ hoạt động
                </h3>
                <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-blue-700">
                  Cập nhật dịch vụ
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-100 text-slate-600 sticky top-0 uppercase font-black">
                    <tr>
                      <th className="p-4 border-b">Tên dịch vụ</th>
                      <th className="p-4 border-b">Danh mục</th>
                      <th className="p-4 border-b">Đơn giá</th>
                      <th className="p-4 border-b text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {getCurrentServices().length > 0 ? (
                      getCurrentServices().map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="p-4 font-bold uppercase text-slate-700">
                            {item.name}
                          </td>
                          <td className="p-4 text-sm">{item.category}</td>
                          <td className="p-4 font-bold text-blue-600">
                            ${item.price} {item.unit}
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                item.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {item.status === "Active" ? "Hoạt động" : "Ngưng"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-gray-500">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 z-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">
                Phiếu nhập kho mới
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Tên vật phẩm
                </label>
                <input
                  type="text"
                  value={importFormData.itemName}
                  onChange={(e) =>
                    setImportFormData({
                      ...importFormData,
                      itemName: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="VD: Khăn tắm loại A"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    value={importFormData.itemQty}
                    onChange={(e) =>
                      setImportFormData({
                        ...importFormData,
                        itemQty: e.target.value,
                      })
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Nhà phân phối
                  </label>
                  <input
                    type="text"
                    value={importFormData.itemSupplier}
                    onChange={(e) =>
                      setImportFormData({
                        ...importFormData,
                        itemSupplier: e.target.value,
                      })
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Tên NCC"
                  />
                </div>
              </div>
              <button
                onClick={handleImportSubmit}
                className="w-full bg-blue-600 text-white font-black py-3 rounded uppercase text-xs tracking-widest hover:bg-blue-700 transition"
              >
                Xác nhận nhập kho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
