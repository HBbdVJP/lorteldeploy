"use client";

import { RefObject } from "react";

type Branch = {
  id: string;
  name?: string;
  type?: string;
  starRating?: number;
  address?: string;
  city?: string;
  country?: string;
  totalFloors?: number;
  totalRooms?: number;
  totalArea?: number;
  elevatorCount?: number;
  parkingCapacity?: number;
  managedBy?: string;
  staffCount?: number;
  status?: string;
  openingDate?: string;
};

type AdminBranchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formRef: RefObject<HTMLDivElement>;
  editBranchId: string | null;
  branches: Branch[];
};

export default function AdminBranchModal({
  isOpen,
  onClose,
  onSave,
  formRef,
  editBranchId,
  branches,
}: AdminBranchModalProps) {
  if (!isOpen) return null;

  const branch = editBranchId ? branches.find((b) => b.id === editBranchId) : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative modal-enter border border-slate-700"
        ref={formRef}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <i className="fas fa-times text-2xl"></i>
        </button>
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold">
            {editBranchId ? "Sửa chi nhánh" : "Thêm chi nhánh mới"}
          </h2>
        </div>
        <div className="p-6 space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên chi nhánh *</label>
              <input type="text" id="branchName" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={branch?.name || ""} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Loại</label>
              <select id="branchType" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={branch?.type || "Hotel"}>
                <option value="Hotel">Khách sạn</option>
                <option value="Resort">Khu nghỉ dưỡng</option>
                <option value="Villa">Biệt thự</option>
                <option value="Apartment">Căn hộ</option>
                <option value="MixedUse">Hỗn hợp</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sao</label>
              <input type="number" id="branchStar" min="1" max="5" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={branch?.starRating || 3} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <select id="branchStatus" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={branch?.status || "Active"}>
                <option value="Active">Hoạt động</option>
                <option value="Maintenance">Bảo trì</option>
                <option value="Reconstruction">Tái xây dựng</option>
                <option value="Unavailable">Không khả dụng</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Địa chỉ *</label>
            <input type="text" id="branchAddress" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={branch?.address || ""} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Thành phố *</label>
              <input type="text" id="branchCity" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={branch?.city || ""} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quốc gia *</label>
              <input type="text" id="branchCountry" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={branch?.country || ""} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tầng</label>
              <input type="number" id="branchFloors" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={branch?.totalFloors || 1} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Số phòng</label>
              <input type="number" id="branchRooms" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={branch?.totalRooms || 0} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Diện tích (m²)</label>
              <input type="number" id="branchArea" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={branch?.totalArea || 0} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Thang máy</label>
              <input type="number" id="branchElevators" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={branch?.elevatorCount || 0} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Chỗ đỗ xe</label>
              <input type="number" id="branchParking" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={branch?.parkingCapacity || 0} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nhân viên</label>
              <input type="number" id="branchStaff" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={branch?.staffCount || 0} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quản lý bởi</label>
              <input type="text" id="branchManager" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={branch?.managedBy || ""} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ngày khai trương</label>
              <input type="date" id="branchOpeningDate" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={branch?.openingDate || ""} />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-slate-600 rounded-lg">Hủy</button>
          <button onClick={onSave} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Lưu</button>
        </div>
      </div>
    </div>
  );
}
