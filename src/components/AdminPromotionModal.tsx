"use client";

import { RefObject } from "react";

type Promotion = {
  id: number;
  name?: string;
  code?: string;
  type?: string;
  value?: number;
  start?: string;
  end?: string;
  status?: string;
};

type AdminPromotionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formRef: RefObject<HTMLDivElement>;
  editPromotionId: number | null;
  promotions: Promotion[];
};

export default function AdminPromotionModal({
  isOpen,
  onClose,
  onSave,
  formRef,
  editPromotionId,
  promotions,
}: AdminPromotionModalProps) {
  if (!isOpen) return null;

  const promo = editPromotionId ? promotions.find((p) => p.id === editPromotionId) : null;

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
            {editPromotionId ? "Sửa khuyến mãi" : "Thêm khuyến mãi mới"}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên khuyến mãi *</label>
              <input type="text" id="promoName" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={promo?.name || ""} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mã khuyến mãi *</label>
              <input type="text" id="promoCode" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={promo?.code || ""} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Loại</label>
              <select id="promoType" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={promo?.type || "percent"}>
                <option value="percent">Phần trăm (%)</option>
                <option value="fixed">Cố định (VND)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Giá trị *</label>
              <input type="number" id="promoValue" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={promo?.value || ""} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ngày bắt đầu *</label>
              <input type="date" id="promoStart" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={promo?.start || ""} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ngày kết thúc *</label>
              <input type="date" id="promoEnd" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={promo?.end || ""} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Trạng thái</label>
            <select id="promoStatus" className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700" defaultValue={promo?.status || "active"}>
              <option value="active">Kích hoạt</option>
              <option value="inactive">Vô hiệu</option>
            </select>
          </div>
        </div>
        <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-slate-600 rounded-lg">Hủy</button>
          <button onClick={onSave} className="px-4 py-2 bg-amber-600 text-white rounded-lg">Lưu</button>
        </div>
      </div>
    </div>
  );
}
