// src/app/admin/infastorage/page.tsx
"use client";

import { useState, useEffect } from "react";

// ─── TYPES ───────────────────────────────────────────────────────────────
type InfrastorageTab =
  | "overview"
  | "infrastructure"
  | "storage"
  | "services";
type BuildingStatus = "Active" | "Maintenance" | "Closed";
type RoomStatus = "Available" | "Occupied" | "Maintenance" | "Reserved";
type StorageItemStatus = "InStock" | "LowStock" | "OutOfStock";
type ServiceStatus = "Active" | "Inactive";
type BuildingType = "Hotel" | "Resort" | "Villa" | "Apartment" | "MixedUse";

type RoomType = "Standard" | "Deluxe" | "Suite" | "Conference" | "ServiceRoom";

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

// ─── STATIC DATA ─────────────────────────────────────────────────────────
import data from "@/data/infrastorageDummyData.json";

const infraData = data as InfraStorageData;
// ─── MAIN COMPONENT ──────────────────────────────────────────────────────
export default function InfastoragePage() {
  const [activeTab, setActiveTab] = useState<InfrastorageTab>("overview");
  const [selectedBranch, setSelectedBranch] = useState(
    infraData.branches[0]?.id || "",
  );
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
    <div
      className="bg-slate-900 transition-colors duration-300 h-screen flex flex-col"
    >
      {/* HEADER */}
      <header className="bg-slate-900 px-6 py-3 flex sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-4">
          <div className="border-l border-slate-700 pl-4">
            <h1 className="text-sm font-black text-white uppercase">
              Quản lý hạ tầng & Dịch vụ
            </h1>
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
              className="w-full max-w-sm bg-slate-800 border border-slate-700 text-slate-800 dark:text-slate-100 text-[11px] font-bold uppercase rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
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
            <div className="space-y-6 max-w-5xl">
              {/* Branch Header Card */}
              <div className="bg-slate-800 p-6 rounded-xl shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-1">
                      {getCurrentBranchData()?.name}
                    </h2>
                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      {getCurrentBranchData()?.status}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                      getCurrentBranchData()?.status === "Active"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    {getCurrentBranchData()?.status}
                  </span>
                </div>
              </div>

              {/* Branch Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl shadow-sm">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2">
                    Mã số
                  </label>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                    {getCurrentBranchData()?.id}
                  </p>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl shadow-sm">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2">
                    Phân loại
                  </label>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                    {getCurrentBranchData()?.type}
                  </p>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl shadow-sm">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2">
                    Số tầng
                  </label>
                  <p className="text-[13px] font-bold text-blue-600 dark:text-blue-400">
                    {getCurrentBranchData()?.totalFloors}
                  </p>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl shadow-sm">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2">
                    Số phòng
                  </label>
                  <p className="text-[13px] font-bold text-blue-600 dark:text-blue-400">
                    {getCurrentBranchData()?.totalRooms}
                  </p>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl shadow-sm">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2">
                    Nhân sự
                  </label>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                    {getCurrentBranchData()?.staffCount}
                  </p>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl shadow-sm">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2">
                    Diện tích
                  </label>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                    {getCurrentBranchData()?.totalArea} m²
                  </p>
                </div>
              </div>

              {/* Extended Info Cards */}
              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-xl shadow-sm">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2">
                    Người quản lý
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full animate-pulse bg-green-500" />
                    <p className="text-[13px] font-bold text-green-600 dark:text-green-400 uppercase">
                      {getCurrentBranchData()?.managedBy}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl shadow-sm">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2">
                    Địa chỉ
                  </label>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                    {getCurrentBranchData()?.address},{" "}
                    {getCurrentBranchData()?.city},{" "}
                    {getCurrentBranchData()?.country}
                  </p>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-green-500">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2">
                    Ngày khai trương
                  </label>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                    {getCurrentBranchData()?.openingDate}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Cơ sở hạ tầng */}
          {activeTab === "infrastructure" && (
            <div className="bg-slate-800 rounded border dark:border-slate-600 h-full flex flex-col overflow-hidden">
              <div className="p-4 border-b dark:border-slate-600 bg-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase tracking-tighter text-slate-800 dark:text-slate-100">
                  Danh sách phòng & cơ sở hạ tầng
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-800 text-slate-300 sticky top-0 uppercase font-black">
                    <tr>
                      <th className="p-4 border-b dark:border-slate-600">
                        Tên phòng
                      </th>
                      <th className="p-4 border-b dark:border-slate-600">
                        Loại
                      </th>
                      <th className="p-4 border-b dark:border-slate-600 text-center">
                        Sức chứa
                      </th>
                      <th className="p-4 border-b dark:border-slate-600">
                        Trạng thái
                      </th>
                      <th className="p-4 border-b dark:border-slate-600 text-right">
                        Giá/đêm
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-600">
                    {getCurrentInfrastructures().length > 0 ? (
                      getCurrentInfrastructures().map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-600 transition"
                        >
                          <td className="p-4 font-bold uppercase text-slate-700 dark:text-slate-200">
                            {item.name}
                          </td>
                          <td className="p-4 text-slate-300">
                            {item.type}
                          </td>
                          <td className="p-4 text-center font-mono text-slate-300">
                            {item.capacity}
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                item.status === "Available"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                  : item.status === "Occupied"
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                    : item.status === "Maintenance"
                                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                      : "bg-slate-700 text-slate-300"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold text-blue-600 dark:text-blue-400">
                            ${item.pricePerNight}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-4 text-center text-gray-500 dark:text-gray-400"
                        >
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
            <div className="bg-slate-800 rounded border dark:border-slate-600 h-full flex flex-col overflow-hidden">
              <div className="p-4 border-b dark:border-slate-600 bg-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase tracking-tighter text-slate-800 dark:text-slate-100">
                  Quản lý vật phẩm & Kho bãi
                </h3>
                <div className="space-x-2">
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="bg-slate-700 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-slate-700 dark:hover:bg-slate-500"
                  >
                    Nhập kho
                  </button>
                  <button className="bg-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-slate-500">
                    Xuất báo cáo
                  </button>
                </div>
              </div>

              {pendingImports.length > 0 && (
                <div className="p-4 space-y-2 bg-slate-800 border-b dark:border-slate-600">
                  <h4 className="text-[9px] font-black text-slate-400 dark:text-slate-400 uppercase mb-2">
                    Yêu cầu nhập kho đang chờ
                  </h4>
                  {pendingImports.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-amber-900/30 border border-amber-700 p-3 rounded-lg shadow-sm animate-pulse mb-2"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-amber-500 rounded-full" />
                        <div>
                          <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase">
                            {item.name}
                          </h4>
                          <p className="text-[9px] text-amber-700 dark:text-amber-400 font-bold uppercase">
                            Số lượng: {item.qty} | NCC: {item.supplier}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-800 text-slate-300 sticky top-0 uppercase font-black">
                    <tr>
                      <th className="p-4 border-b dark:border-slate-600">
                        Vật phẩm
                      </th>
                      <th className="p-4 border-b dark:border-slate-600">
                        Danh mục
                      </th>
                      <th className="p-4 border-b dark:border-slate-600 text-center">
                        Số lượng
                      </th>
                      <th className="p-4 border-b dark:border-slate-600 text-center">
                        Ngưỡng tối thiểu
                      </th>
                      <th className="p-4 border-b dark:border-slate-600 text-center">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-600">
                    {getCurrentStorageItems().length > 0 ? (
                      getCurrentStorageItems().map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-600 transition"
                        >
                          <td className="p-4 font-bold uppercase text-slate-700 dark:text-slate-200">
                            {item.name}
                          </td>
                          <td className="p-4 text-slate-300">
                            {item.category}
                          </td>
                          <td className="p-4 text-center font-mono text-lg text-slate-300">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="p-4 text-center text-gray-400 dark:text-gray-500 font-bold uppercase">
                            {item.minThreshold}
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                                item.status === "InStock"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                  : item.status === "LowStock"
                                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
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
                        <td
                          colSpan={5}
                          className="p-4 text-center text-gray-500 dark:text-gray-400"
                        >
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
            <div className="bg-slate-800 rounded border dark:border-slate-600 h-full flex flex-col overflow-hidden">
              <div className="p-4 border-b dark:border-slate-600 bg-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase tracking-tighter text-slate-800 dark:text-slate-100">
                  Danh sách dịch vụ hoạt động
                </h3>
                <button className="bg-blue-600 dark:bg-blue-600 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-blue-700 dark:hover:bg-blue-700">
                  Cập nhật dịch vụ
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-800 text-slate-300 sticky top-0 uppercase font-black">
                    <tr>
                      <th className="p-4 border-b dark:border-slate-600">
                        Tên dịch vụ
                      </th>
                      <th className="p-4 border-b dark:border-slate-600">
                        Danh mục
                      </th>
                      <th className="p-4 border-b dark:border-slate-600">
                        Đơn giá
                      </th>
                      <th className="p-4 border-b dark:border-slate-600 text-center">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-600">
                    {getCurrentServices().length > 0 ? (
                      getCurrentServices().map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-600 transition"
                        >
                          <td className="p-4 font-bold uppercase text-slate-700 dark:text-slate-200">
                            {item.name}
                          </td>
                          <td className="p-4 text-slate-300">
                            {item.category}
                          </td>
                          <td className="p-4 font-bold text-blue-600 dark:text-blue-400">
                            ${item.price} {item.unit}
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                item.status === "Active"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                  : "bg-slate-700 text-slate-400"
                              }`}
                            >
                              {item.status === "Active" ? "Hoạt động" : "Ngưng"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-4 text-center text-gray-500 dark:text-gray-400"
                        >
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
          <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b dark:border-slate-600 bg-slate-800 flex justify-between items-center">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-800 dark:text-slate-100">
                Phiếu nhập kho mới
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase mb-1">
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
                  className="w-full border border-slate-700 bg-slate-700 text-slate-900 dark:text-slate-100 rounded p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="VD: Khăn tắm loại A"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase mb-1">
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
                    className="w-full border border-slate-700 bg-slate-700 text-slate-900 dark:text-slate-100 rounded p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase mb-1">
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
                    className="w-full border border-slate-700 bg-slate-700 text-slate-900 dark:text-slate-100 rounded p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Tên NCC"
                  />
                </div>
              </div>
              <button
                onClick={handleImportSubmit}
                className="w-full bg-blue-600 dark:bg-blue-600 text-white font-black py-3 rounded uppercase text-xs tracking-widest hover:bg-blue-700 dark:hover:bg-blue-700 transition"
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