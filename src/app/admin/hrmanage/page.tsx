import React, { useState, useEffect } from "react";
// Giả định đường dẫn import data của bạn
// import staffDataRaw from '../data/destinationdatafile.json';

interface Staff {
  id: string;
  name: string;
  dept: string;
  role: string;
  join: string;
  status: "online" | "offline";
}

const HRManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>(
    "--/--/---- - 00:00:00",
  );

  // Load data từ file JSON (Mockup)
  const staffData: Staff[] = [];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("vi-VN", { hour12: false });
      setCurrentTime(`${dateStr} - ${timeStr}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const daysOfWeek = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "CN",
  ];
  const filteredStaff = staffData.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-bold tracking-tighter">LORTEL</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <nav className="space-y-4 flex-1">
            <button className="w-full text-left p-3 hover:bg-slate-800 rounded-lg transition">
              Lễ tân
            </button>
            <button className="w-full text-left p-3 bg-blue-600 rounded-lg font-bold">
              Nhân sự
            </button>
            <button className="w-full text-left p-3 hover:bg-slate-800 rounded-lg transition">
              Chi nhánh
            </button>
            <button className="w-full text-left p-3 hover:bg-slate-800 rounded-lg transition">
              Tài vụ
            </button>
          </nav>
          <div className="text-xs text-slate-500 mt-auto">Phiên bản 0.26</div>
        </div>
      </aside>

      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-md transition"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="border-l pl-4">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
              {currentTime}
            </span>
            <h1 className="text-sm font-black text-slate-900 uppercase">
              Hệ thống nhân sự
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <select className="bg-gray-50 border border-gray-200 text-[10px] font-bold uppercase rounded p-1">
            <option>Riverside Branch</option>
            <option>City Center Branch</option>
          </select>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700">Admin</span>
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
              HR
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sub-Nav */}
        <aside className="w-64 bg-slate-800 flex flex-col shrink-0">
          <div className="p-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Tác vụ nhân sự
            </h3>
            <nav className="space-y-1">
              {[
                "overview",
                "staff-detail",
                "attendance",
                "leave",
                "schedule",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center p-3 text-sm text-slate-300 hover:bg-slate-700 rounded transition text-left uppercase ${activeTab === tab ? "bg-slate-900 text-amber-400 border-r-4 border-amber-400" : ""}`}
                >
                  {tab.replace("-", " ")}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 overflow-hidden p-6 relative">
          {/* Tab: Overview */}
          {activeTab === "overview" && (
            <div className="h-full space-y-6">
              <div className="grid grid-cols-3 gap-4 shrink-0">
                <div className="bg-white p-4 rounded shadow-sm border">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    Đang trong ca
                  </p>
                  <p className="text-2xl font-black text-slate-800">--</p>
                </div>
                <div className="bg-white p-4 rounded shadow-sm border border-l-4 border-l-amber-400">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    Chính thức / Thử việc
                  </p>
                  <p className="text-2xl font-black text-slate-800">-- / --</p>
                </div>
                <div className="bg-white p-4 rounded shadow-sm border border-l-4 border-l-red-400">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    Báo vắng
                  </p>
                  <p className="text-2xl font-black text-red-600">--</p>
                </div>
              </div>
            </div>
          )}
          {/* Tab: Staff Detail */}
          {activeTab === "staff-detail" && (
            <div className="grid grid-cols-12 gap-6 h-full overflow-hidden">
              <div className="col-span-4 bg-white rounded border flex flex-col overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <input
                    type="text"
                    placeholder="Tìm tên hoặc mã nhân viên..."
                    className="w-full text-xs border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredStaff.map((staff) => (
                    <div
                      key={staff.id}
                      onClick={() => setSelectedStaff(staff)}
                      className={`p-4 border-b cursor-pointer hover:bg-slate-50 flex items-center space-x-3 ${selectedStaff?.id === staff.id ? "bg-blue-50 border-blue-500" : ""}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-[10px]">
                        {staff.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[11px] font-bold text-slate-800 uppercase">
                            {staff.name}
                          </h4>
                          <span className="text-[8px] font-mono text-slate-400">
                            {staff.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-8 bg-white rounded border flex flex-col overflow-hidden">
                {!selectedStaff ? (
                  <div className="flex-1 flex items-center justify-center text-gray-400 italic text-sm">
                    Chọn nhân viên để xem thông tin
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="p-6 border-b bg-slate-50 flex items-start space-x-6">
                      <div className="w-24 h-32 bg-slate-200 rounded border flex items-center justify-center text-slate-400 font-bold text-2xl">
                        {selectedStaff.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-black text-slate-800 uppercase">
                          {selectedStaff.name}
                        </h2>
                        <p className="text-[10px] font-bold text-blue-600 uppercase">
                          ID: {selectedStaff.id}
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                          <p>
                            <span className="text-gray-400">Bộ phận:</span>{" "}
                            <b>{selectedStaff.dept}</b>
                          </p>
                          <p>
                            <span className="text-gray-400">Vị trí:</span>{" "}
                            <b>{selectedStaff.role}</b>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div id="attendance" className="tab-content h-full">
            <div className="bg-white rounded border h-full flex flex-col overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase">
                  Kiểm tra chấm công
                </h3>
                <span className="text-[10px] font-mono font-bold bg-slate-200 px-2 py-1 rounded">
                  20/05/2026
                </span>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-100 text-slate-600 sticky top-0 uppercase font-black">
                    <tr>
                      <th className="p-3 border-b">STT</th>
                      <th className="p-3 border-b">Nhân viên</th>
                      <th className="p-3 border-b">Ca</th>
                      <th className="p-3 border-b">Vào</th>
                      <th className="p-3 border-b">Tan</th>
                      <th className="p-3 border-b text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3">01</td>
                      <td className="p-3 font-bold">Nguyễn Văn A</td>
                      <td className="p-3">SÁNG (08-16)</td>
                      <td className="p-3 font-mono">07:55</td>
                      <td className="p-3 font-mono">--:--</td>
                      <td className="p-3 text-center">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                          ĐÚNG GIỜ
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3">02</td>
                      <td className="p-3 font-bold">Trần Thị B</td>
                      <td className="p-3">CHIỀU (14-22)</td>
                      <td className="p-3 font-mono">--:--</td>
                      <td className="p-3 font-mono">--:--</td>
                      <td className="p-3 text-center">
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                          CHƯA ĐẾN
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          /* Tab: Xin nghỉ phép */
          <div id="leave" className="tab-content h-full">
            <div className="bg-white rounded border h-full flex flex-col">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-bold text-xs uppercase">
                  Danh sách xin nghỉ phép
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-100 uppercase">
                    <tr>
                      <th className="p-3 border-b">STT</th>
                      <th className="p-3 border-b">Nhân viên</th>
                      <th className="p-3 border-b">Ngày xin nghỉ</th>
                      <th className="p-3 border-b">Số ngày</th>
                      <th className="p-3 border-b">Lý do</th>
                      <th className="p-3 border-b">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3">01</td>
                      <td className="p-3 font-bold text-blue-600">Lê Văn C</td>
                      <td className="p-3">22/05/2026</td>
                      <td className="p-3">01</td>
                      <td className="p-3 truncate max-w-37.5">
                        Khám bệnh định kỳ tại bệnh viện ĐK
                      </td>
                      <td className="p-3 space-x-2">
                        <button className="bg-green-600 text-white px-2 py-1 rounded font-bold uppercase text-[9px]">
                          Duyệt
                        </button>
                        <button className="bg-red-600 text-white px-2 py-1 rounded font-bold uppercase text-[9px]">
                          Từ chối
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          /* Tab: Lịch làm việc */
          <div id="schedule" className="tab-content h-full">
            <div className="bg-white rounded border h-full flex flex-col">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase">
                  Lịch làm việc tuần 21
                </h3>
                <select className="text-[10px] border rounded p-1 font-bold">
                  <option>CA SÁNG</option>
                  <option>CA CHIỀU</option>
                  <option>CA TỐI</option>
                </select>
              </div>
              <div className="flex-1 grid grid-cols-8 border-t bg-slate-50">
                <div className="border-r bg-slate-100 flex flex-col">
                  <div className="h-10 border-b"></div>
                  <div className="flex-1 divide-y font-mono text-[9px] text-gray-500">
                    <div className="h-8 flex items-center px-2">0000</div>
                    <div className="h-8 flex items-center px-2">0200</div>
                    <div className="h-8 flex items-center px-2">0400</div>
                    <div className="h-8 flex items-center px-2">0600</div>
                    <div className="h-8 flex items-center px-2 font-bold text-blue-600 bg-blue-50">
                      0800
                    </div>
                    <div className="h-8 flex items-center px-2">1000</div>
                    <div className="h-8 flex items-center px-2">1200</div>
                    <div className="h-8 flex items-center px-2">1400</div>
                    <div className="h-8 flex items-center px-2">1600</div>
                    <div className="h-8 flex items-center px-2 font-bold text-amber-600 bg-amber-50">
                      1800
                    </div>
                    <div className="h-8 flex items-center px-2">2000</div>
                    <div className="h-8 flex items-center px-2">2200</div>
                  </div>
                </div>
                /* Days of week */
                {/* Các cột ngày trong tuần */}
                {daysOfWeek.map((day) => (
                  <div key={day} className="border-r flex flex-col">
                    <div className="h-10 border-b flex items-center justify-center font-bold text-[10px] uppercase text-slate-600">
                      {day}
                    </div>
                    <div className="flex-1 relative">
                      {/* Block làm việc mẫu */}
                      {day === "Thứ 2" && (
                        <div className="absolute top-16 left-1 right-1 h-32 bg-blue-500/20 border-l-2 border-blue-600 p-1 text-[8px] font-bold text-blue-800">
                          CA SÁNG
                        </div>
                      )}
                      {day === "Thứ 7" && (
                        <div className="absolute top-64 left-1 right-1 h-16 bg-amber-500/20 border-l-2 border-amber-600 p-1 text-[8px] font-bold text-amber-800">
                          TĂNG CA
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HRManager;
