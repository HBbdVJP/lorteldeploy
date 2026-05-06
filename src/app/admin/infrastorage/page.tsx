// src/app/admin/infrastorage/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Branch as BranchRow,
  Building as BuildingRow,
  Floor as FloorRow,
  Room as RoomRow,
  RoomType as RoomTypeRow,
  RoomStatus as RoomStatusRow,
  ServiceCategory as ServiceCategoryRow,
  ServiceInventory as ServiceInventoryRow,
  ServiceItem as ServiceItemRow,
} from "@/types/mastertype";

type InfrastorageTab = "overview" | "infrastructure" | "storage" | "services";
type BuildingStatus = "Active" | "Maintenance" | "Closed";
type RoomStatus = "Available" | "Occupied" | "Maintenance" | "Reserved";
type StorageItemStatus = "InStock" | "LowStock" | "OutOfStock";
type ServiceStatus = "Active" | "Inactive";
type BuildingType = "Hotel" | "Resort" | "Villa" | "Apartment" | "MixedUse";

type RoomType = "Standard" | "Deluxe" | "Suite" | "Conference" | "ServiceRoom";

interface Branch {
  id: string;
  name: string;
  type: BuildingType;
  starRating: number;
  address: string;
  city: string;
  country: string;
  totalFloors: number;
  totalRooms: number;
  totalArea: number;
  elevatorCount: number;
  parkingCapacity: number;
  managedBy: string;
  staffCount: number;
  status: BuildingStatus;
  openingDate: string;
}

interface Infrastructure {
  id: string;
  branchId: string;
  name: string;
  type: RoomType;
  floor: number;
  area: number;
  capacity: number;
  pricePerNight: number;
  status: RoomStatus;
  hasWifi: boolean;
  hasAC: boolean;
  hasBathroom: boolean;
}

interface Storage {
  id: string;
  branchId: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  importDate: string;
  expiryDate: string | null;
  minThreshold: number;
  status: StorageItemStatus;
}

interface Service {
  id: string;
  branchId: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  available24h: boolean;
  status: ServiceStatus;
  description?: string;
}

interface MasterData {
  Branch: BranchRow[];
  Building: BuildingRow[];
  Floor: FloorRow[];
  Room: RoomRow[];
  RoomType: RoomTypeRow[];
  RoomStatus: RoomStatusRow[];
  ServiceCategory: ServiceCategoryRow[];
  ServiceInventory: ServiceInventoryRow[];
  ServiceItem: ServiceItemRow[];
}

export default function InfrastoragePage() {
  const [activeTab, setActiveTab] = useState<InfrastorageTab>("overview");
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [pendingImports, setPendingImports] = useState<any[]>([]);
  const [importFormData, setImportFormData] = useState({
    itemName: "",
    itemQty: "",
    itemSupplier: "",
  });
  const [showImportModal, setShowImportModal] = useState(false);
  const [branches, setBranches] = useState<BranchRow[]>([]);
  const [buildings, setBuildings] = useState<BuildingRow[]>([]);
  const [floors, setFloors] = useState<FloorRow[]>([]);
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeRow[]>([]);
  const [roomStatuses, setRoomStatuses] = useState<RoomStatusRow[]>([]);
  const [storageItems, setStorageItems] = useState<Storage[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/masterdata");
        if (!response.ok) {
          throw new Error(`Failed to load masterdata: ${response.status}`);
        }

        const data: MasterData = await response.json();
        const branchRows = data.Branch ?? [];
        const buildingRows = data.Building ?? [];
        const floorRows = data.Floor ?? [];
        const roomRows = data.Room ?? [];
        const roomTypeRows = data.RoomType ?? [];
        const roomStatusRows = data.RoomStatus ?? [];
        const serviceItems = data.ServiceItem ?? [];
        const serviceInventory = data.ServiceInventory ?? [];
        const serviceCategories = data.ServiceCategory ?? [];

        setBranches(branchRows);
        setBuildings(buildingRows);
        setFloors(floorRows);
        setRooms(roomRows);
        setRoomTypes(roomTypeRows);
        setRoomStatuses(roomStatusRows);

        const defaultBranchId = branchRows?.[0]?.BranchID ?? null;
        setSelectedBranch((currentSelected) => currentSelected ?? defaultBranchId);

        const inventoryItems = serviceInventory.map((inv) => {
          const item = serviceItems.find((service) => service.ItemID === inv.ItemID);
          const category = serviceCategories.find((category) => category.CatID === item?.CategoryID);
          return {
            id: String(inv.InvID),
            branchId: String(inv.BranchID),
            name: item?.ItemName ?? "Unknown Item",
            category: category?.Name ?? "General",
            quantity: inv.StockQuantity,
            unit: item?.Unit ?? "unit",
            importDate: "2025-01-01",
            expiryDate: null,
            minThreshold: inv.MinStockLevel ?? 0,
            status:
              inv.StockQuantity === 0
                ? "OutOfStock"
                : inv.StockQuantity <= inv.MinStockLevel
                ? "LowStock"
                : "InStock",
          } as Storage;
        });

        setStorageItems(inventoryItems);
        setServices(
          inventoryItems
            .filter((item) => item.branchId === String(defaultBranchId))
            .map((item) => ({
              id: item.id,
              branchId: item.branchId,
              name: item.name,
              category: item.category,
              price: 100000,
              unit: item.unit,
              available24h: true,
              status: item.status === "OutOfStock" ? "Inactive" : "Active",
              description: `Dịch vụ ${item.name}`,
            })),
        );
      } catch (error) {
        console.error("Failed to load infrastructure masterdata:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedBranch === null) return;

    setServices(
      storageItems
        .filter((item) => item.branchId === String(selectedBranch))
        .map((item) => ({
          id: item.id,
          branchId: item.branchId,
          name: item.name,
          category: item.category,
          price: 100000,
          unit: item.unit,
          available24h: true,
          status: item.status === "OutOfStock" ? "Inactive" : "Active",
          description: `Dịch vụ ${item.name}`,
        })),
    );
  }, [selectedBranch, storageItems]);

  const branchBuildingIds = buildings
    .filter((b) => b.BranchID === selectedBranch)
    .map((b) => b.BuildingID);

  const branchFloorIds = floors
    .filter((f) => branchBuildingIds.includes(f.BuildingID))
    .map((f) => f.FloorID);

  const getCurrentBranchData = (): Branch | null => {
    const branchRow = branches.find((b) => b.BranchID === selectedBranch);
    if (!branchRow) return null;
    return {
      id: String(branchRow.BranchID),
      name: branchRow.BranchName,
      type: "Hotel",
      starRating: 4,
      address: branchRow.Address ?? "",
      city: branchRow.City ?? "",
      country: "Vietnam",
      totalFloors: buildings.filter((b) => b.BranchID === branchRow.BranchID).reduce((sum, b) => sum + (b.FloorsCount ?? 0), 0),
      totalRooms: rooms.filter((r) => branchFloorIds.includes(r.FloorID)).length,
      totalArea: 0,
      elevatorCount: 2,
      parkingCapacity: 40,
      managedBy: String(branchRow.ManagerEmployeeID ?? "Quản lý"),
      staffCount: 0,
      status: "Active",
      openingDate: "2025-01-01",
    };
  };

  const getCurrentInfrastructures = (): Infrastructure[] =>
    rooms
      .filter((r) => branchFloorIds.includes(r.FloorID))
      .map((room) => {
        const floor = floors.find((f) => f.FloorID === room.FloorID);
        const roomType = roomTypes.find((type) => type.RoomTypeID === room.RoomTypeID);
        const roomStatus = roomStatuses.find((status) => status.StatusID === room.StatusID);
        return {
          id: String(room.RoomID),
          branchId: String(selectedBranch ?? 0),
          name: room.RoomNumber,
          type: (roomType?.TypeName as RoomType) ?? "Standard",
          floor: floor?.FloorNumber ?? 0,
          area: 25,
          capacity: roomType?.BaseCapacity ?? 2,
          pricePerNight: Number(roomType?.StandardRate ?? 0),
          status:
            roomStatus?.StatusName === "Available"
              ? "Available"
              : roomStatus?.StatusName === "Occupied"
              ? "Occupied"
              : roomStatus?.StatusName === "Maintenance"
              ? "Maintenance"
              : roomStatus?.StatusName === "Reserved"
              ? "Reserved"
              : "Available",
          hasWifi: true,
          hasAC: true,
          hasBathroom: true,
        };
      });

  const getCurrentStorageItems = () =>
    storageItems.filter((s) => s.branchId === String(selectedBranch));
  const getCurrentServices = () =>
    services.filter((s) => s.branchId === String(selectedBranch));

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
    <div className="bg-slate-900 transition-colors duration-300 h-screen flex flex-col">
      <header className="bg-slate-900 px-6 py-3 flex sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-4">
          <div className="border-l border-slate-700 pl-4">
            <h1 className="text-sm font-black text-white uppercase">
              Quản lý hạ tầng & Dịch vụ
            </h1>
          </div>
        </div>
      </header>

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

      <main className="flex-1 flex overflow-hidden bg-slate-800/50">
        <section className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Chi nhánh đang xem
            </h3>
            <select
              value={selectedBranch ?? ""}
              onChange={(e) => setSelectedBranch(Number(e.target.value))}
              className="w-full max-w-sm bg-slate-800 border border-slate-700 text-slate-100 text-[11px] font-bold uppercase rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
            >
              {branches.map((branch) => (
                <option key={branch.BranchID} value={branch.BranchID}>
                  {branch.BranchName}
                </option>
              ))}
            </select>
          </div>

          {activeTab === "overview" && getCurrentBranchData() && (
            <div className="space-y-6 max-w-5xl">
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
                      <th className="p-4 border-b dark:border-slate-600">Tên phòng</th>
                      <th className="p-4 border-b dark:border-slate-600">Loại</th>
                      <th className="p-4 border-b dark:border-slate-600 text-center">Sức chứa</th>
                      <th className="p-4 border-b dark:border-slate-600">Trạng thái</th>
                      <th className="p-4 border-b dark:border-slate-600 text-right">Giá/đêm</th>
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
                          <td className="p-4 text-slate-300">{item.type}</td>
                          <td className="p-4 text-center font-mono text-slate-300">{item.capacity}</td>
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
                        <td colSpan={5} className="p-4 text-center text-gray-500 dark:text-gray-400">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
                      <th className="p-4 border-b dark:border-slate-600">Vật phẩm</th>
                      <th className="p-4 border-b dark:border-slate-600">Danh mục</th>
                      <th className="p-4 border-b dark:border-slate-600 text-center">Số lượng</th>
                      <th className="p-4 border-b dark:border-slate-600 text-center">Ngưỡng tối thiểu</th>
                      <th className="p-4 border-b dark:border-slate-600 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-600">
                    {getCurrentStorageItems().length > 0 ? (
                      getCurrentStorageItems().map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-600 transition">
                          <td className="p-4 font-bold uppercase text-slate-700 dark:text-slate-200">{item.name}</td>
                          <td className="p-4 text-slate-300">{item.category}</td>
                          <td className="p-4 text-center font-mono text-lg text-slate-300">{item.quantity} {item.unit}</td>
                          <td className="p-4 text-center text-gray-400 dark:text-gray-500 font-bold uppercase">{item.minThreshold}</td>
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
                        <td colSpan={5} className="p-4 text-center text-gray-500 dark:text-gray-400">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
                      <th className="p-4 border-b dark:border-slate-600">Tên dịch vụ</th>
                      <th className="p-4 border-b dark:border-slate-600">Danh mục</th>
                      <th className="p-4 border-b dark:border-slate-600">Đơn giá</th>
                      <th className="p-4 border-b dark:border-slate-600 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-600">
                    {getCurrentServices().length > 0 ? (
                      getCurrentServices().map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-600 transition">
                          <td className="p-4 font-bold uppercase text-slate-700 dark:text-slate-200">{item.name}</td>
                          <td className="p-4 text-slate-300">{item.category}</td>
                          <td className="p-4 font-bold text-blue-600 dark:text-blue-400">${item.price} {item.unit}</td>
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
                        <td colSpan={4} className="p-4 text-center text-gray-500 dark:text-gray-400">
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
