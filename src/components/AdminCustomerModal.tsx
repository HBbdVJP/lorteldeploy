"use client";

import { RefObject } from "react";

type Customer = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
};

type AdminCustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formRef: RefObject<HTMLDivElement>;
  editCustomerId: string | null;
  customers: Customer[];
};

export default function AdminCustomerModal({
  isOpen,
  onClose,
  onSave,
  formRef,
  editCustomerId,
  customers,
}: AdminCustomerModalProps) {
  if (!isOpen) return null;

  const customer = editCustomerId ? customers.find((c) => c.id === editCustomerId) : null;

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
            {editCustomerId ? "Sửa khách hàng" : "Thêm khách hàng mới"}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {editCustomerId && (
            <div>
              <label className="block text-sm font-medium mb-2">ID khách hàng</label>
              <input
                type="text"
                readOnly
                value={customer?.id ?? ""}
                className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700 text-slate-200"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">Tên *</label>
            <input
              type="text"
              id="customerName"
              className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
              defaultValue={customer?.name || ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              id="customerEmail"
              className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
              defaultValue={customer?.email || ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
            <input
              type="tel"
              id="customerPhone"
              className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
              defaultValue={customer?.phone || ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Địa chỉ *</label>
            <input
              type="text"
              id="customerAddress"
              className="w-full border rounded-lg px-4 py-2 bg-slate-700 border-slate-700"
              defaultValue={customer?.address || ""}
            />
          </div>
        </div>
        <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-slate-600 rounded-lg">Hủy</button>
          <button onClick={onSave} className="px-4 py-2 bg-green-600 text-white rounded-lg">Lưu</button>
        </div>
      </div>
    </div>
  );
}
