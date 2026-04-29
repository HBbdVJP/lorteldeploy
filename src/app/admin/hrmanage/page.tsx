"use client";

import { useDarkMode } from "@/contexts/DarkModeContext";
import { useState, useEffect } from "react";

interface Staff {
  id: string;
  name: string;
  dept: string;
  role: string;
  join: string;
  status: "online" | "offline";
}

interface LeaveRequest {
  id: number;
  name: string;
  date: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

interface AttendanceRecord {
  stt: number;
  name: string;
  shift: string;
  checkin: string;
  checkout: string;
  status: "on-time" | "late" | "absent" | "absent-reported";
}

export default function HRManagePage() {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentDateTime, setCurrentDateTime] = useState("");

  const staffList: Staff[] = [
    {
      id: "EMP001",
      name: "Nguyễn Văn A",
      dept: "Lễ tân",
      role: "Lễ tân cấp cao",
      join: "2020-01-15",
      status: "online",
    },
    {
      id: "EMP002",
      name: "Trần Thị B",
      dept: "Phòng bếp",
      role: "Đầu bếp",
      join: "2019-05-10",
      status: "offline",
    },
    {
      id: "EMP003",
      name: "Lê Văn C",
      dept: "Nhân sự",
      role: "Trưởng phòng",
      join: "2018-03-20",
      status: "online",
    },
  ];

  const leaveRequests: LeaveRequest[] = [
    {
      id: 1,
      name: "Lê Văn C",
      date: "2026-05-22",
      days: 1,
      reason: "Khám bệnh định kỳ",
      status: "pending",
    },
    {
      id: 2,
      name: "Nguyễn Văn A",
      date: "2026-05-25",
      days: 3,
      reason: "Nghỉ hè",
      status: "approved",
    },
  ];

  const attendanceRecords: AttendanceRecord[] = [
    {
      stt: 1,
      name: "Nguyễn Văn A",
      shift: "SÁNG (08-16)",
      checkin: "07:55",
      checkout: "--:--",
      status: "on-time",
    },
    {
      stt: 2,
      name: "Trần Thị B",
      shift: "CHIỀU (14-22)",
      checkin: "--:--",
      checkout: "--:--",
      status: "absent-reported",
    },
    {
      stt: 3,
      name: "Lê Văn C",
      shift: "SÁNG (08-16)",
      checkin: "08:15",
      checkout: "--:--",
      status: "late",
    },
  ];

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "on-time":
      case "approved":
      case "online":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "late":
      case "pending":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
      case "absent":
      case "rejected":
      case "offline":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      case "absent-reported":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      default:
        return "bg-slate-700 text-slate-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "on-time":
        return "Đúng giờ";
      case "late":
        return "Muộn";
      case "absent":
        return "Vắng";
      case "absent-reported":
        return "Báo vắng";
      case "online":
        return "Trực tuyến";
      case "offline":
        return "Ngoại tuyến";
      case "approved":
        return "Duyệt";
      case "pending":
        return "Chờ";
      case "rejected":
        return "Từ chối";
      default:
        return status;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-sm border border-emerald-200 dark:border-emerald-900/30">
                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  Đang trong ca
                </p>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {staffList.filter((s) => s.status === "online").length}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-sm border border-blue-200 dark:border-blue-900/30">
                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  Tổng nhân viên
                </p>
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  {staffList.length}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-sm border border-amber-200 dark:border-amber-900/30">
                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  Xin nghỉ phép chờ
                </p>
                <p className="text-3xl font-black text-amber-600 dark:text-amber-400">
                  {leaveRequests.filter((l) => l.status === "pending").length}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-700 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-600">
                <h3 className="text-lg font-bold">Danh sách nhân viên</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Tên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Bộ phận
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Vị trí
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-600">
                    {staffList.map((staff) => (
                      <tr
                        key={staff.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                          {staff.id}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-100">
                          {staff.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {staff.dept}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {staff.role}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(staff.status)}`}>
                            {getStatusText(staff.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "staff-detail":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-700 rounded-xl shadow-sm overflow-hidden sticky top-6">
                <div className="p-4 border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800">
                  <input
                    type="text"
                    placeholder="Tìm tên hoặc mã..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {filteredStaff.map((staff) => (
                    <button
                      key={staff.id}
                      onClick={() => setSelectedStaff(staff)}
                      className={`w-full text-left px-4 py-3 border-b border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                        selectedStaff?.id === staff.id
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                          {staff.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                            {staff.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {staff.id}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {!selectedStaff ? (
                <div className="bg-white dark:bg-slate-700 rounded-xl shadow-sm p-12 flex items-center justify-center min-h-96">
                  <p className="text-slate-500 dark:text-slate-400 italic">
                    Chọn nhân viên để xem chi tiết
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-700 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-start gap-6">
                      <div className="w-20 h-24 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center text-4xl font-bold text-slate-700 dark:text-slate-300">
                        {selectedStaff.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase mb-1">
                          {selectedStaff.name}
                        </h2>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase mb-4">
                          ID: {selectedStaff.id}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                              Bộ phận
                            </p>
                            <p className="text-slate-800 dark:text-slate-100 font-bold">
                              {selectedStaff.dept}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                              Vị trí
                            </p>
                            <p className="text-slate-800 dark:text-slate-100 font-bold">
                              {selectedStaff.role}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                              Ngày vào
                            </p>
                            <p className="text-slate-800 dark:text-slate-100 font-bold">
                              {new Date(selectedStaff.join).toLocaleDateString(
                                "vi-VN",
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                              Trạng thái
                            </p>
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-bold ${getStatusBadgeColor(selectedStaff.status)}`}
                            >
                              {getStatusText(selectedStaff.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "attendance":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Chấm công hôm nay</h2>
              <p className="text-sm font-mono text-slate-600 dark:text-slate-400">
                {new Date().toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-700 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        STT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Nhân viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Ca
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Vào
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Tan
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-600">
                    {attendanceRecords.map((record) => (
                      <tr
                        key={record.stt}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                          {String(record.stt).padStart(2, "0")}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-100">
                          {record.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {record.shift}
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-slate-700 dark:text-slate-300">
                          {record.checkin}
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-slate-700 dark:text-slate-300">
                          {record.checkout}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(record.status)}`}>
                            {getStatusText(record.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "leave":
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold">Danh sách xin nghỉ phép</h2>
            <div className="bg-white dark:bg-slate-700 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Nhân viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Ngày xin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Số ngày
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Lý do
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-600">
                    {leaveRequests.map((request) => (
                      <tr
                        key={request.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-100">
                          {request.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {new Date(request.date).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {request.days} ngày
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 max-w-xs truncate">
                          {request.reason}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {request.status === "pending" && (
                            <div className="flex gap-2 justify-center">
                              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs font-bold transition">
                                Duyệt
                              </button>
                              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold transition">
                                Từ chối
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Lịch làm việc tuần</h2>
              <select className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-blue-500">
                <option>Tuần 1</option>
                <option>Tuần 2</option>
                <option>Tuần 3</option>
                <option>Tuần 4</option>
              </select>
            </div>
            <div className="bg-white dark:bg-slate-700 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Nhân viên
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Thứ 2
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Thứ 3
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Thứ 4
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Thứ 5
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Thứ 6
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Thứ 7
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        CN
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-600">
                    {staffList.map((staff) => (
                      <tr
                        key={staff.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-100">
                          {staff.name}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            CA S
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            CA S
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                            CA C
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            CA S
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            CA S
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                            CA C
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                            OFF
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 transition-colors duration-300 min-h-screen flex flex-col">
      <header className="bg-slate-900 px-6 py-3 flex sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-4">
          <div className="border-l border-slate-700 pl-4">
            <h1 className="text-sm font-black text-white uppercase">
              Quản lý nhân sự
            </h1>
          </div>
        </div>
        <div className="ml-auto flex items-center text-slate-400 text-xs font-mono">
          {currentDateTime}
        </div>
      </header>

      <div className="tab-container overflow-x-auto no-scrollbar bg-slate-800 border-b border-slate-700 px-6 flex sticky top-12 z-40">
        {[
          { id: "overview", label: "Tổng quan" },
          { id: "staff-detail", label: "Chi tiết nhân viên" },
          { id: "attendance", label: "Chấm công" },
          { id: "leave", label: "Xin nghỉ phép" },
          { id: "schedule", label: "Lịch làm việc" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      <main className="flex-1 overflow-y-auto p-6 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

