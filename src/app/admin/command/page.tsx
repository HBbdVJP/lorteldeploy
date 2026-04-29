"use client";

import { useState, useRef, useEffect } from "react";
import { useAdminDashboard } from "@/components/useAdminDashboard";
import infraData from "@/data/infrastorageDummyData.json";

type DeleteModalData = {
  title: string;
  message: string;
  onConfirm: () => void;
} | null;

interface Branch {
  id: string;
  name: string;
  type: string;
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
  status: "Active" | "Maintenance" | "Reconstruction" | "Unavailable";
  openingDate: string;
}

export default function CommandPage() {
  const {
    bookings,
    setBookings,
    rooms,
    setRooms,
    customers,
    promotions,
    setPromotions,
    isBookingModalOpen,
    setIsBookingModalOpen,
    isRoomModalOpen,
    setIsRoomModalOpen,
    editBookingId,
    setEditBookingId,
    editRoomId,
    setEditRoomId,
    bookingFormRef,
    roomFormRef,
    showToast,
  } = useAdminDashboard();

  const [activeTab, setActiveTab] = useState<"bookings" | "rooms" | "promotions" | "construction">("bookings");
  const [branches, setBranches] = useState<Branch[]>(infraData.branches as Branch[]);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [editPromotionId, setEditPromotionId] = useState<number | null>(null);
  const [editBranchId, setEditBranchId] = useState<string | null>(null);
  const promotionFormRef = useRef<HTMLDivElement>(null);
  const branchFormRef = useRef<HTMLDivElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState<DeleteModalData>(null);

  // Delete modal handlers
  const openDeleteModal = (
    title: string,
    message: string,
    onConfirm: () => void,
  ) => {
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

  // Utility functions
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // â”€â”€â”€ BOOKING CRUD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    const customerSelect = form.querySelector(
      "#bookingCustomer",
    ) as HTMLSelectElement;
    const roomSelect = form.querySelector("#bookingRoom") as HTMLSelectElement;
    const checkinInput = form.querySelector(
      "#bookingCheckin",
    ) as HTMLInputElement;
    const checkoutInput = form.querySelector(
      "#bookingCheckout",
    ) as HTMLInputElement;
    const guestsInput = form.querySelector(
      "#bookingGuests",
    ) as HTMLInputElement;
    const notesInput = form.querySelector(
      "#bookingNotes",
    ) as HTMLTextAreaElement;

    const customerId = parseInt(customerSelect?.value || "0");
    const roomId = parseInt(roomSelect?.value || "0");
    const checkin = checkinInput?.value || "";
    const checkout = checkoutInput?.value || "";
    const guests = parseInt(guestsInput?.value || "2");
    const note = notesInput?.value || "";

    if (!customerId || !roomId || !checkin || !checkout) {
      showToast("Vui lÃ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ thÃ´ng tin", "error");
      return;
    }

    const customer = customers.find((c) => c.id === customerId);
    const room = rooms.find((r) => r.id === roomId);
    if (!customer || !room) return;

    const days = Math.max(
      1,
      Math.ceil(
        (new Date(checkout).getTime() - new Date(checkin).getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );
    const total = room.price * days;

    if (editBookingId) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === editBookingId
            ? {
                ...b,
                customerId,
                customer: customer.name,
                roomId,
                room: room.name,
                checkin,
                checkout,
                guests,
                total,
                note,
              }
            : b,
        ),
      );
      showToast("Cáº­p nháº­t Ä‘áº·t phÃ²ng thÃ nh cÃ´ng");
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
      showToast("ThÃªm Ä‘áº·t phÃ²ng thÃ nh cÃ´ng");
    }
    closeBookingModal();
  };

  const deleteBooking = (id: number) => {
    openDeleteModal(
      "XÃ³a Ä‘áº·t phÃ²ng",
      "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a Ä‘áº·t phÃ²ng nÃ y?",
      () => {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        showToast("ÄÃ£ xÃ³a Ä‘áº·t phÃ²ng");
      },
    );
  };

  // â”€â”€â”€ ROOM CRUD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    const capacityInput = form.querySelector(
      "#roomCapacity",
    ) as HTMLInputElement;
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
      showToast("Vui lÃ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ thÃ´ng tin", "error");
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
      setRooms((prev) =>
        prev.map((r) => (r.id === editRoomId ? { ...r, ...roomData } : r)),
      );
      showToast("Cáº­p nháº­t phÃ²ng thÃ nh cÃ´ng");
    } else {
      const newId = Math.max(...rooms.map((r) => r.id), 0) + 1;
      setRooms((prev) => [...prev, { id: newId, ...roomData }]);
      showToast("ThÃªm phÃ²ng thÃ nh cÃ´ng");
    }
    closeRoomModal();
  };

  const deleteRoom = (id: number) => {
    openDeleteModal("XÃ³a phÃ²ng", "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a phÃ²ng nÃ y?", () => {
      setRooms((prev) => prev.filter((r) => r.id !== id));
      showToast("ÄÃ£ xÃ³a phÃ²ng");
    });
  };

  // â”€â”€â”€ PROMOTION CRUD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const openPromotionModal = (id: number | null = null) => {
    setEditPromotionId(id);
    setIsPromotionModalOpen(true);
  };

  const closePromotionModal = () => {
    setIsPromotionModalOpen(false);
    setEditPromotionId(null);
  };

  const savePromotion = () => {
    const form = promotionFormRef.current;
    if (!form) return;

    const nameInput = form.querySelector("#promoName") as HTMLInputElement;
    const codeInput = form.querySelector("#promoCode") as HTMLInputElement;
    const typeSelect = form.querySelector("#promoType") as HTMLSelectElement;
    const valueInput = form.querySelector("#promoValue") as HTMLInputElement;
    const startInput = form.querySelector("#promoStart") as HTMLInputElement;
    const endInput = form.querySelector("#promoEnd") as HTMLInputElement;
    const statusSelect = form.querySelector("#promoStatus") as HTMLSelectElement;

    const name = nameInput?.value || "";
    const code = codeInput?.value || "";
    const type = typeSelect?.value || "percent";
    const value = parseInt(valueInput?.value || "0");
    const start = startInput?.value || "";
    const end = endInput?.value || "";
    const status = statusSelect?.value || "active";

    if (!name || !code || !value || !start || !end) {
      showToast("Vui lÃ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ thÃ´ng tin", "error");
      return;
    }

    const promotionData = { name, code, type, value, start, end, status };

    if (editPromotionId) {
      setPromotions((prev) =>
        prev.map((p) => (p.id === editPromotionId ? { ...p, ...promotionData } : p)),
      );
      showToast("Cáº­p nháº­t khuyáº¿n mÃ£i thÃ nh cÃ´ng");
    } else {
      const newId = Math.max(...promotions.map((p) => p.id), 0) + 1;
      setPromotions((prev) => [...prev, { id: newId, ...promotionData }]);
      showToast("ThÃªm khuyáº¿n mÃ£i thÃ nh cÃ´ng");
    }
    closePromotionModal();
  };

  const deletePromotion = (id: number) => {
    openDeleteModal("XÃ³a khuyáº¿n mÃ£i", "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a khuyáº¿n mÃ£i nÃ y?", () => {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
      showToast("ÄÃ£ xÃ³a khuyáº¿n mÃ£i");
    });
  };

  // â”€â”€â”€ BRANCH CRUD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const openBranchModal = (id: string | null = null) => {
    setEditBranchId(id);
    setIsBranchModalOpen(true);
  };

  const closeBranchModal = () => {
    setIsBranchModalOpen(false);
    setEditBranchId(null);
  };

  const saveBranch = () => {
    const form = branchFormRef.current;
    if (!form) return;

    const nameInput = form.querySelector("#branchName") as HTMLInputElement;
    const typeSelect = form.querySelector("#branchType") as HTMLSelectElement;
    const starInput = form.querySelector("#branchStar") as HTMLInputElement;
    const addressInput = form.querySelector("#branchAddress") as HTMLInputElement;
    const cityInput = form.querySelector("#branchCity") as HTMLInputElement;
    const countryInput = form.querySelector("#branchCountry") as HTMLInputElement;
    const floorsInput = form.querySelector("#branchFloors") as HTMLInputElement;
    const roomsInput = form.querySelector("#branchRooms") as HTMLInputElement;
    const areaInput = form.querySelector("#branchArea") as HTMLInputElement;
    const elevatorsInput = form.querySelector("#branchElevators") as HTMLInputElement;
    const parkingInput = form.querySelector("#branchParking") as HTMLInputElement;
    const managerInput = form.querySelector("#branchManager") as HTMLInputElement;
    const staffInput = form.querySelector("#branchStaff") as HTMLInputElement;
    const statusSelect = form.querySelector("#branchStatus") as HTMLSelectElement;
    const openingDateInput = form.querySelector("#branchOpeningDate") as HTMLInputElement;

    const name = nameInput?.value || "";
    const type = typeSelect?.value || "Hotel";
    const starRating = parseInt(starInput?.value || "3");
    const address = addressInput?.value || "";
    const city = cityInput?.value || "";
    const country = countryInput?.value || "";
    const totalFloors = parseInt(floorsInput?.value || "1");
    const totalRooms = parseInt(roomsInput?.value || "0");
    const totalArea = parseInt(areaInput?.value || "0");
    const elevatorCount = parseInt(elevatorsInput?.value || "0");
    const parkingCapacity = parseInt(parkingInput?.value || "0");
    const managedBy = managerInput?.value || "";
    const staffCount = parseInt(staffInput?.value || "0");
    const status = statusSelect?.value as "Active" | "Maintenance" | "Reconstruction" | "Unavailable" || "Active";
    const openingDate = openingDateInput?.value || "";

    if (!name || !address || !city || !country) {
      showToast("Vui lÃ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ thÃ´ng tin", "error");
      return;
    }

    const branchData = {
      name,
      type,
      starRating,
      address,
      city,
      country,
      totalFloors,
      totalRooms,
      totalArea,
      elevatorCount,
      parkingCapacity,
      managedBy,
      staffCount,
      status,
      openingDate,
    };

    if (editBranchId) {
      setBranches((prev) =>
        prev.map((b) => (b.id === editBranchId ? { ...b, ...branchData } : b)),
      );
      showToast("Cáº­p nháº­t chi nhÃ¡nh thÃ nh cÃ´ng");
    } else {
      const newId = `branch-${Math.max(...branches.map((b) => parseInt(b.id.split("-")[1] || "0")), 0) + 1}`;
      setBranches((prev) => [...prev, { id: newId, ...branchData } as Branch]);
      showToast("ThÃªm chi nhÃ¡nh thÃ nh cÃ´ng");
    }
    closeBranchModal();
  };

  const deleteBranch = (id: string) => {
    openDeleteModal("XÃ³a chi nhÃ¡nh", "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a chi nhÃ¡nh nÃ y?", () => {
      setBranches((prev) => prev.filter((b) => b.id !== id));
      showToast("ÄÃ£ xÃ³a chi nhÃ¡nh");
    });
  };

  // â”€â”€â”€ RENDER CONTENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const renderContent = () => {
    switch (activeTab) {
      case "bookings":
        return (
          <div className="space-y-6">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">Quáº£n lÃ½ Ä‘áº·t phÃ²ng</h1>
              <button
                onClick={() => openBookingModal(null)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
              >
                <i className="fas fa-plus mr-2"></i>ThÃªm Ä‘áº·t phÃ²ng
              </button>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select className="border border-slate-700 rounded-lg px-4 py-2 text-sm bg-slate-700 text-slate-100">
                  <option value="all">Táº¥t cáº£</option>
                  <option value="pending">Chá»</option>
                  <option value="confirmed">ÄÃ£ xÃ¡c nháº­n</option>
                  <option value="completed">HoÃ n thÃ nh</option>
                </select>
                <input
                  type="date"
                  className="border border-slate-700 rounded-lg px-4 py-2 text-sm bg-slate-700 text-slate-100"
                />
                <input
                  type="date"
                  className="border border-slate-700 rounded-lg px-4 py-2 text-sm bg-slate-700 text-slate-100"
                />
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs">MÃ£</th>
                    <th className="px-6 py-3 text-left text-xs">KhÃ¡ch hÃ ng</th>
                    <th className="px-6 py-3 text-left text-xs">PhÃ²ng</th>
                    <th className="px-6 py-3 text-left text-xs">NgÃ y nháº­n</th>
                    <th className="px-6 py-3 text-left text-xs">NgÃ y tráº£</th>
                    <th className="px-6 py-3 text-left text-xs">Tráº¡ng thÃ¡i</th>
                    <th className="px-6 py-3 text-right text-xs">Tá»•ng</th>
                    <th className="px-6 py-3 text-center text-xs">Thao tÃ¡c</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-slate-700">
                      <td className="px-6 py-3">{b.code}</td>
                      <td className="px-6 py-3">{b.customer}</td>
                      <td className="px-6 py-3">{b.room}</td>
                      <td className="px-6 py-3">{formatDate(b.checkin)}</td>
                      <td className="px-6 py-3">{formatDate(b.checkout)}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`badge ${b.status === "confirmed" ? "badge-success" : b.status === "pending" ? "badge-warning" : "badge-info"}`}
                        >
                          {b.status === "confirmed"
                            ? "ÄÃ£ xÃ¡c nháº­n"
                            : b.status === "pending"
                              ? "Chá»"
                              : "HoÃ n thÃ nh"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        {formatCurrency(b.total)}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          className="text-blue-600 mr-2"
                          onClick={() => openBookingModal(b.id)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="text-red-600"
                          onClick={() => deleteBooking(b.id)}
                        >
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
              <h1 className="text-2xl font-bold">Quáº£n lÃ½ phÃ²ng</h1>
              <button
                onClick={() => openRoomModal(null)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
              >
                <i className="fas fa-plus mr-2"></i>ThÃªm phÃ²ng
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg dark:bg-gray-800">
                <p className="text-gray-500">Tá»•ng sá»‘</p>
                <p className="text-2xl font-bold">{rooms.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg dark:bg-gray-800">
                <p className="text-gray-500">PhÃ²ng trá»‘ng</p>
                <p className="text-2xl font-bold text-green-600">
                  {rooms.filter((r) => r.status === "available").length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg dark:bg-gray-800">
                <p className="text-gray-500">Äang cÃ³ khÃ¡ch</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {rooms.filter((r) => r.status === "occupied").length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg dark:bg-gray-800">
                <p className="text-gray-500">Báº£o trÃ¬</p>
                <p className="text-2xl font-bold text-red-600">
                  {rooms.filter((r) => r.status === "maintenance").length}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((r) => (
                <div
                  key={r.id}
                  className="room-card bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden"
                >
                  <div className="relative h-40 bg-slate-700">
                    <img
                      src={`https://picsum.photos/id/${164 + r.id}/400/200`}
                      className="w-full h-full object-cover"
                      alt={r.name}
                    />
                    <span
                      className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full text-white ${
                        r.status === "available"
                          ? "bg-green-500"
                          : r.status === "occupied"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    >
                      {r.status === "available"
                        ? "Trá»‘ng"
                        : r.status === "occupied"
                          ? "ÄÃ£ Ä‘áº·t"
                          : "Báº£o trÃ¬"}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between">
                      <h3 className="font-bold">{r.name}</h3>
                      <span className="text-emerald-600 font-bold">
                        {formatCurrency(r.price)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      PhÃ²ng {r.number} â€¢ {r.area}mÂ² â€¢ {r.capacity} ngÆ°á»i
                    </p>
                    <div className="flex gap-1 mt-2">
                      {r.amenities.map((a) => (
                        <span
                          key={a}
                          className="bg-slate-700 text-xs px-2 py-1 rounded text-slate-100"
                        >
                          <i
                            className={`fas fa-${a === "wifi" ? "wifi" : a === "tv" ? "tv" : a === "ac" ? "wind" : "bath"}`}
                          ></i>{" "}
                          {a.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between mt-3 pt-3 border-t border-slate-700">
                      <button
                        className="text-blue-600"
                        onClick={() => openRoomModal(r.id)}
                      >
                        <i className="fas fa-edit mr-1"></i>Sá»­a
                      </button>
                      <button
                        className="text-red-600"
                        onClick={() => deleteRoom(r.id)}
                      >
                        <i className="fas fa-trash mr-1"></i>XÃ³a
                      </button>
                    </div>
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
              <h1 className="text-2xl font-bold">Quáº£n lÃ½ khuyáº¿n mÃ£i</h1>
              <button
                onClick={() => openPromotionModal(null)}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg"
              >
                <i className="fas fa-plus mr-2"></i>ThÃªm khuyáº¿n mÃ£i
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {promotions.map((promo) => (
                <div key={promo.id} className="bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{promo.name}</h3>
                      <p className="text-sm text-gray-500">{promo.code}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${promo.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {promo.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm mb-3">
                    <p className="text-slate-400">
                      <span className="font-medium">GiÃ¡ trá»‹:</span> {promo.type === "percent" ? `${promo.value}%` : formatCurrency(promo.value)}
                    </p>
                    <p className="text-slate-400">
                      <span className="font-medium">Tá»«:</span> {formatDate(promo.start)} Ä‘áº¿n {formatDate(promo.end)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openPromotionModal(promo.id)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm"
                    >
                      <i className="fas fa-edit mr-1"></i>Sá»­a
                    </button>
                    <button
                      onClick={() => deletePromotion(promo.id)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm"
                    >
                      <i className="fas fa-trash mr-1"></i>XÃ³a
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "construction":
        return (
          <div className="space-y-6">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">Quáº£n lÃ½ chi nhÃ¡nh</h1>
              <button
                onClick={() => openBranchModal(null)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                <i className="fas fa-plus mr-2"></i>ThÃªm chi nhÃ¡nh
              </button>
            </div>
            <div className="bg-slate-800 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold">TÃªn chi nhÃ¡nh</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">Loáº¡i</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">Sao</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">Äá»‹a chá»‰</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">Tráº¡ng thÃ¡i</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">PhÃ²ng</th>
                    <th className="px-6 py-3 text-center text-xs font-bold">Thao tÃ¡c</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {branches.map((branch) => (
                    <tr key={branch.id} className="hover:bg-slate-700">
                      <td className="px-6 py-4 text-sm font-medium">{branch.name}</td>
                      <td className="px-6 py-4 text-sm">{branch.type}</td>
                      <td className="px-6 py-4 text-sm">
                        {[...Array(branch.starRating)].map((_, i) => (
                          <i key={i} className="fas fa-star text-yellow-400"></i>
                        ))}
                      </td>
                      <td className="px-6 py-4 text-sm">{branch.address}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          branch.status === "Active" ? "bg-green-900 text-green-200" :
                          branch.status === "Maintenance" ? "bg-yellow-900 text-yellow-200" :
                          branch.status === "Reconstruction" ? "bg-blue-900 text-blue-200" :
                          "bg-red-900 text-red-200"
                        }`}>
                          {branch.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{branch.totalRooms}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openBranchModal(branch.id)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => deleteBranch(branch.id)}
                          className="text-red-600 hover:text-red-800"
                        >
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

      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900 transition-colors duration-300 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 px-6 py-3 flex sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-4">
          <div className="border-l border-slate-700 pl-4">
            <h1 className="text-sm font-black text-white uppercase">
              Báº£ng Ä‘iá»u khiá»ƒn lá»‡nh
            </h1>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="tab-container overflow-x-auto no-scrollbar bg-slate-800 border-b border-slate-700 px-6 flex sticky top-12 z-40">
        {[
          { id: "bookings", label: "Äáº·t phÃ²ng" },
          { id: "rooms", label: "PhÃ²ng" },
          { id: "promotions", label: "Khuyáº¿n mÃ£i" },
          { id: "construction", label: "Chi nhÃ¡nh" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "bookings" | "rooms" | "promotions" | "construction")}
            className={`tab-item flex items-center gap-2 px-4 py-3 cursor-pointer border-b-2 transition-colors text-[12px] font-bold uppercase whitespace-nowrap ${
              activeTab === tab.id
                ? "text-blue-400 border-blue-400 bg-slate-900/30"
                : "text-slate-400 border-transparent hover:text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>

      {/* BOOKING MODAL */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative modal-enter border border-slate-700"
            ref={bookingFormRef}
          >
            <button
              onClick={closeBookingModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold">
                {editBookingId ? "Sá»­a Ä‘áº·t phÃ²ng" : "ThÃªm Ä‘áº·t phÃ²ng má»›i"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
                const booking = editBookingId
                  ? bookings.find((b) => b.id === editBookingId)
                  : null;
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          KhÃ¡ch hÃ ng *
                        </label>
                        <select
                          id="bookingCustomer"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={booking?.customerId || ""}
                        >
                          <option value="">Chá»n khÃ¡ch hÃ ng</option>
                          {customers.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          PhÃ²ng *
                        </label>
                        <select
                          id="bookingRoom"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={booking?.roomId || ""}
                        >
                          <option value="">Chá»n phÃ²ng</option>
                          {rooms
                            .filter(
                              (r) =>
                                r.status === "available" ||
                                (booking && booking.roomId === r.id),
                            )
                            .map((r) => (
                              <option
                                key={r.id}
                                value={r.id}
                                data-price={r.price}
                              >
                                {r.name} - {formatCurrency(r.price)}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          NgÃ y nháº­n *
                        </label>
                        <input
                          type="date"
                          id="bookingCheckin"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={booking?.checkin || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          NgÃ y tráº£ *
                        </label>
                        <input
                          type="date"
                          id="bookingCheckout"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={booking?.checkout || ""}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Sá»‘ khÃ¡ch
                        </label>
                        <input
                          type="number"
                          id="bookingGuests"
                          defaultValue={booking?.guests || 2}
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          MÃ£ khuyáº¿n mÃ£i
                        </label>
                        <input
                          type="text"
                          id="bookingPromo"
                          placeholder="Nháº­p mÃ£"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ghi chÃº
                      </label>
                      <textarea
                        id="bookingNotes"
                        rows={2}
                        className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                        defaultValue={booking?.note || ""}
                      ></textarea>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="p-6 border-t flex justify-end gap-3 dark:border-gray-700">
              <button
                onClick={closeBookingModal}
                className="px-4 py-2 border rounded-lg dark:border-gray-600"
              >
                Há»§y
              </button>
              <button
                onClick={saveBooking}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
              >
                LÆ°u
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROOM MODAL */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative modal-enter border border-slate-700"
            ref={roomFormRef}
          >
            <button
              onClick={closeRoomModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold">
                {editRoomId ? "Sá»­a phÃ²ng" : "ThÃªm phÃ²ng má»›i"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
                const room = editRoomId
                  ? rooms.find((r) => r.id === editRoomId)
                  : null;
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          TÃªn phÃ²ng *
                        </label>
                        <input
                          type="text"
                          id="roomName"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={room?.name || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Sá»‘ phÃ²ng *
                        </label>
                        <input
                          type="text"
                          id="roomNumber"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={room?.number || ""}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Loáº¡i phÃ²ng
                        </label>
                        <select
                          id="roomType"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={room?.type || "Standard"}
                        >
                          <option>Standard</option>
                          <option>Deluxe</option>
                          <option>Suite</option>
                          <option>Family</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          GiÃ¡/Ä‘Ãªm *
                        </label>
                        <input
                          type="number"
                          id="roomPrice"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={room?.price || ""}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Diá»‡n tÃ­ch (mÂ²)
                        </label>
                        <input
                          type="number"
                          id="roomArea"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={room?.area || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Sá»©c chá»©a
                        </label>
                        <input
                          type="number"
                          id="roomCapacity"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={room?.capacity || 2}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tiá»‡n Ã­ch
                      </label>
                      <div className="flex gap-4">
                        <label>
                          <input
                            type="checkbox"
                            id="amenityWifi"
                            defaultChecked={
                              room?.amenities.includes("wifi") ?? true
                            }
                          />{" "}
                          WiFi
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            id="amenityTv"
                            defaultChecked={
                              room?.amenities.includes("tv") ?? true
                            }
                          />{" "}
                          TV
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            id="amenityAc"
                            defaultChecked={
                              room?.amenities.includes("ac") ?? true
                            }
                          />{" "}
                          Äiá»u hÃ²a
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            id="amenityBath"
                            defaultChecked={
                              room?.amenities.includes("bath") ?? false
                            }
                          />{" "}
                          Bá»“n táº¯m
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tráº¡ng thÃ¡i
                      </label>
                      <select
                        id="roomStatus"
                        className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                        defaultValue={room?.status || "available"}
                      >
                        <option value="available">PhÃ²ng trá»‘ng</option>
                        <option value="occupied">Äang cÃ³ khÃ¡ch</option>
                        <option value="maintenance">Äang báº£o trÃ¬</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        MÃ´ táº£
                      </label>
                      <textarea
                        id="roomDesc"
                        rows={2}
                        className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                        defaultValue={room?.desc || ""}
                      ></textarea>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="p-6 border-t flex justify-end gap-3 dark:border-gray-700">
              <button
                onClick={closeRoomModal}
                className="px-4 py-2 border rounded-lg dark:border-gray-600"
              >
                Há»§y
              </button>
              <button
                onClick={saveRoom}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
              >
                LÆ°u
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROMOTION MODAL */}
      {isPromotionModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative modal-enter border border-slate-700"
            ref={promotionFormRef}
          >
            <button
              onClick={closePromotionModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold">
                {editPromotionId ? "Sá»­a khuyáº¿n mÃ£i" : "ThÃªm khuyáº¿n mÃ£i má»›i"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
                const promo = editPromotionId
                  ? promotions.find((p) => p.id === editPromotionId)
                  : null;
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          TÃªn khuyáº¿n mÃ£i *
                        </label>
                        <input
                          type="text"
                          id="promoName"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={promo?.name || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          MÃ£ khuyáº¿n mÃ£i *
                        </label>
                        <input
                          type="text"
                          id="promoCode"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={promo?.code || ""}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Loáº¡i
                        </label>
                        <select
                          id="promoType"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={promo?.type || "percent"}
                        >
                          <option value="percent">Pháº§n trÄƒm (%)</option>
                          <option value="fixed">Cá»‘ Ä‘á»‹nh (VND)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          GiÃ¡ trá»‹ *
                        </label>
                        <input
                          type="number"
                          id="promoValue"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={promo?.value || ""}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          NgÃ y báº¯t Ä‘áº§u *
                        </label>
                        <input
                          type="date"
                          id="promoStart"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={promo?.start || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          NgÃ y káº¿t thÃºc *
                        </label>
                        <input
                          type="date"
                          id="promoEnd"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={promo?.end || ""}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tráº¡ng thÃ¡i
                      </label>
                      <select
                        id="promoStatus"
                        className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                        defaultValue={promo?.status || "active"}
                      >
                        <option value="active">KÃ­ch hoáº¡t</option>
                        <option value="inactive">VÃ´ hiá»‡u</option>
                      </select>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="p-6 border-t flex justify-end gap-3 dark:border-gray-700">
              <button
                onClick={closePromotionModal}
                className="px-4 py-2 border rounded-lg dark:border-gray-600"
              >
                Há»§y
              </button>
              <button
                onClick={savePromotion}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg"
              >
                LÆ°u
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BRANCH MODAL */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative modal-enter border border-slate-700"
            ref={branchFormRef}
          >
            <button
              onClick={closeBranchModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold">
                {editBranchId ? "Sá»­a chi nhÃ¡nh" : "ThÃªm chi nhÃ¡nh má»›i"}
              </h2>
            </div>
            <div className="p-6 space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto">
              {(() => {
                const branch = editBranchId
                  ? branches.find((b) => b.id === editBranchId)
                  : null;
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          TÃªn chi nhÃ¡nh *
                        </label>
                        <input
                          type="text"
                          id="branchName"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={branch?.name || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Loáº¡i
                        </label>
                        <select
                          id="branchType"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={branch?.type || "Hotel"}
                        >
                          <option value="Hotel">KhÃ¡ch sáº¡n</option>
                          <option value="Resort">Khu nghá»‰ dÆ°á»¡ng</option>
                          <option value="Villa">Biá»‡t thá»±</option>
                          <option value="Apartment">CÄƒn há»™</option>
                          <option value="MixedUse">Há»—n há»£p</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Sao
                        </label>
                        <input
                          type="number"
                          id="branchStar"
                          min="1"
                          max="5"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={branch?.starRating || 3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Tráº¡ng thÃ¡i
                        </label>
                        <select
                          id="branchStatus"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={branch?.status || "Active"}
                        >
                          <option value="Active">Hoáº¡t Ä‘á»™ng</option>
                          <option value="Maintenance">Báº£o trÃ¬</option>
                          <option value="Reconstruction">TÃ¡i xÃ¢y dá»±ng</option>
                          <option value="Unavailable">KhÃ´ng kháº£ dá»¥ng</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Äá»‹a chá»‰ *
                      </label>
                      <input
                        type="text"
                        id="branchAddress"
                        className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                        defaultValue={branch?.address || ""}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          ThÃ nh phá»‘ *
                        </label>
                        <input
                          type="text"
                          id="branchCity"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={branch?.city || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Quá»‘c gia *
                        </label>
                        <input
                          type="text"
                          id="branchCountry"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={branch?.country || ""}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Táº§ng
                        </label>
                        <input
                          type="number"
                          id="branchFloors"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={branch?.totalFloors || 1}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Sá»‘ phÃ²ng
                        </label>
                        <input
                          type="number"
                          id="branchRooms"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={branch?.totalRooms || 0}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Diá»‡n tÃ­ch (mÂ²)
                        </label>
                        <input
                          type="number"
                          id="branchArea"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={branch?.totalArea || 0}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Thang mÃ¡y
                        </label>
                        <input
                          type="number"
                          id="branchElevators"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={branch?.elevatorCount || 0}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Chá»— Ä‘á»— xe
                        </label>
                        <input
                          type="number"
                          id="branchParking"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={branch?.parkingCapacity || 0}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          NhÃ¢n viÃªn
                        </label>
                        <input
                          type="number"
                          id="branchStaff"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={branch?.staffCount || 0}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Quáº£n lÃ½ bá»Ÿi
                        </label>
                        <input
                          type="text"
                          id="branchManager"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={branch?.managedBy || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          NgÃ y khai trÆ°Æ¡ng
                        </label>
                        <input
                          type="date"
                          id="branchOpeningDate"
                          className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                          defaultValue={branch?.openingDate || ""}
                        />
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="p-6 border-t flex justify-end gap-3 dark:border-gray-700">
              <button
                onClick={closeBranchModal}
                className="px-4 py-2 border rounded-lg dark:border-gray-600"
              >
                Há»§y
              </button>
              <button
                onClick={saveBranch}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg"
              >
                LÆ°u
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && deleteModalData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700">
            <h2 className="text-xl font-bold mb-2">{deleteModalData.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{deleteModalData.message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border rounded-lg dark:border-gray-600"
              >
                Há»§y
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                XÃ³a
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


