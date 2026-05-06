// ==================== Staff Schema Data ====================
// Child data file for HR/Staff/Employee data
// Source: src/data/masterdata.json (motherfile)
// Purpose: Organize masterdata by schema for easier imports

export { MasterData } from '../types/mastertype';

// Type shortcuts for Staff schema data
export type StaffSchemaData = {
  Attendance: any[];
  AttendanceRecord: any[];
  Department: any[];
  Employee: any[];
  EmployeeContract: any[];
  EmployeeShift: any[];
  LateRule: any[];
  LeaveBalance: any[];
  LeaveRequest: any[];
  OvertimeRequest: any[];
  PerformanceLog: any[];
  Permission: any[];
  Position: any[];
  Role: any[];
  RoleAssign: any[];
  RolePermission: any[];
  Shift: any[];
};
