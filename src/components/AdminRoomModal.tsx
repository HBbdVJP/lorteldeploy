"use client";

import { RefObject } from "react";

type Room = {
  roomid: string;
  roomname?: string;
  roomnumber?: string;
  roomtype?: string;
  roomprice?: number;
  roomarea?: number;
  roomcapacity?: number;
  roomstatus?: string;
  roomimage?: string;
  roomdescription?: string;
  roomamenities?: string[];
};

type AdminRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formRef: RefObject<HTMLDivElement>;
  editRoomId: string | null;
  rooms: Room[];
};

export default function AdminRoomModal({
  isOpen,
  onClose,
  onSave,
  formRef,
  editRoomId,
  rooms,
}: AdminRoomModalProps) {
  if (!isOpen) return null;

  const room = editRoomId ? rooms.find((r) => r.roomid === editRoomId) : null;

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
            {editRoomId ? "Sửa phòng" : "Thêm phòng mới"}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên phòng *</label>
              <input
                type="text"
                id="roomName"
                className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                defaultValue={room?.roomname || ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Số phòng *</label>
              <input
                type="text"
                id="roomNumber"
                className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                defaultValue={room?.roomnumber || ""}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Loại phòng</label>
              <select
                id="roomType"
                className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                defaultValue={room?.roomtype || "Standard"}
              >
                <option>Standard</option>
                <option>Deluxe</option>
                <option>Suite</option>
                <option>Family</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Giá/đêm *</label>
              <input
                type="number"
                id="roomPrice"
                className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                defaultValue={room?.roomprice || ""}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Diện tích (m²)</label>
              <input
                type="number"
                id="roomArea"
                className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                defaultValue={room?.roomarea || ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sức chứa</label>
              <input
                type="number"
                id="roomCapacity"
                className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
                defaultValue={room?.roomcapacity || 1}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">URL ảnh</label>
            <input
              type="text"
              id="roomImage"
              className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
              defaultValue={room?.roomimage || ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Trạng thái</label>
            <select
              id="roomStatus"
              className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
              defaultValue={room?.roomstatus || "available"}
            >
              <option value="available">Phòng trống</option>
              <option value="occupied">Đang có khách</option>
              <option value="maintenance">Đang bảo trì</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mô tả</label>
            <textarea
              id="roomDesc"
              rows={2}
              className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
              defaultValue={room?.roomdescription || ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tiện ích</label>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" id="amenityWifi" defaultChecked={room?.roomamenities?.includes("wifi") ?? true} />
                WiFi
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" id="amenityTv" defaultChecked={room?.roomamenities?.includes("tv") ?? true} />
                TV
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" id="amenityAc" defaultChecked={room?.roomamenities?.includes("ac") ?? true} />
                Điều hòa
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" id="amenityBath" defaultChecked={room?.roomamenities?.includes("bath") ?? false} />
                Bồn tắm
              </label>
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
