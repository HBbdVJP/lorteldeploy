"use client";

import { RefObject } from "react";

type Customer = {
  id: string;
  name?: string;
};

type Room = {
  roomid: string;
  roomname?: string;
  roomnumber?: string;
  roomtype?: string;
  roomprice?: number;
  roomstatus?: string;
};

type Booking = {
  bookingid: string;
  bookingnumber?: number;
  bookingcustomerid?: string | number;
  bookingcustomer?: string;
  bookingroomid?: string;
  bookingroomNumber?: string;
  bookingroomType?: string;
  bookingcheckin?: number | string;
  bookingcheckout?: number | string;
  bookingguest?: number;
  bookingroomStatus?: string;
};

type AdminBookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formRef: RefObject<HTMLDivElement>;
  editBookingId: string | null;
  bookings: Booking[];
  customers: Customer[];
  rooms: Room[];
};

export default function AdminBookingModal({
  isOpen,
  onClose,
  onSave,
  formRef,
  editBookingId,
  bookings,
  customers,
  rooms,
}: AdminBookingModalProps) {
  if (!isOpen) return null;

  const booking = editBookingId ? bookings.find((b) => b.bookingid === editBookingId) : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative modal-enter border border-slate-700"
        ref={formRef}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <i className="fas fa-times text-2xl"></i>
        </button>
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold">
            {editBookingId ? "Sửa đặt phòng" : "Thêm đặt phòng mới"}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {booking && (
            <div>
              <label className="block text-sm font-medium mb-2">Mã đặt phòng</label>
              <input
                type="text"
                readOnly
                value={booking.bookingid}
                className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700 text-slate-200"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Khách hàng *</label>
              <select
                id="bookingCustomer"
                className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                defaultValue={booking?.bookingcustomerid || ""}
              >
                <option value="">Chọn khách hàng</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phòng *</label>
              <select
                id="bookingRoom"
                className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                defaultValue={booking?.bookingroomid || ""}
              >
                <option value="">Chọn phòng</option>
                {rooms.map((room) => (
                  <option key={room.roomid} value={room.roomid}>
                    {room.roomname || room.roomnumber || "Phòng không rõ"} - {room.roomtype || ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ngày nhận *</label>
              <input
                type="date"
                id="bookingCheckin"
                className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                defaultValue={booking?.bookingcheckin ? new Date(booking.bookingcheckin).toISOString().split("T")[0] : ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ngày trả *</label>
              <input
                type="date"
                id="bookingCheckout"
                className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                defaultValue={booking?.bookingcheckout ? new Date(booking.bookingcheckout).toISOString().split("T")[0] : ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Số khách</label>
              <input
                type="number"
                id="bookingGuests"
                min={1}
                defaultValue={booking?.bookingguest ?? 1}
                className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <select
                id="bookingStatus"
                className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                defaultValue={booking?.bookingroomStatus || "pending"}
              >
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-slate-600 rounded-lg">
            Hủy
          </button>
          <button onClick={onSave} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
