// ==================== Staff Schema ====================
// Child schema file for HR/Staff/Employee entities
// Parent file: src/types/mastertype.ts

export interface Attendance {
  AttendID: number;
  EmployeeID: number;
  WorkDate: string;
  ShiftID: number | null;
}

export interface AttendanceRecord {
  RecordID: number;
  AttendID: number;
  TimeIn: string | null;
  TimeOut: string | null;
  IsLateRuleID: number | null;
  EarlyLeaveMinutes: number | null;
  Notes: string | null;
}

export interface Department {
  DeptID: number;
  DeptName: string;
  Description: string | null;
}

export interface Employee {
  EmployeeID: number;
  AccID: number | null;
  FirstName: string;
  LastName: string;
  DepartmentID: number | null;
  PositionID: number | null;
  ManagerID: number | null;
  HireDate: string;
  Status: string;
}

export interface EmployeeContract {
  ContractID: number;
  EmployeeID: number;
  StartDate: string;
  EndDate: string | null;
  BaseSalary: number;
  SalaryType: string;
  WorkHoursPerWeek: number | null;
}

export interface EmployeeShift {
  AssignID: number;
  EmployeeID: number;
  ShiftID: number;
  WorkDate: string;
}

export interface LateRule {
  RuleID: number;
  MaxLateMinutes: number;
  DeductionAmountPerMin: number;
  EffectiveDate: string;
}

export interface LeaveBalance {
  BalanceID: number;
  EmployeeID: number;
  Year: number;
  TotalEntitled: number;
  Used: number;
  Remaining: number;
}

export interface LeaveRequest {
  LeaveID: number;
  EmployeeID: number;
  LeaveType: string;
  StartDate: string;
  EndDate: string;
  Reason: string | null;
  Status: string;
  ApprovedBy: number | null;
}

export interface OvertimeRequest {
  OTID: number;
  EmployeeID: number;
  Date: string;
  StartTime: string;
  EndTime: string;
  OTType: string;
  Reason: string | null;
  Status: string;
  ApprovedBy: number | null;
}

export interface PerformanceLog {
  LogID: number;
  EmployeeID: number;
  LogDate: string;
  MetricType: string;
  MetricValue: number;
}

export interface Permission {
  PermID: number;
  PermKey: string;
  Description: string | null;
}

export interface Position {
  PositionID: number;
  PositionName: string;
  Level: number | null;
}

export interface Role {
  RoleID: number;
  RoleName: string;
  Description: string | null;
}

export interface RoleAssign {
  RoleAssignID: number;
  EmployeeID: number;
  RoleID: number;
  AssignedBy: number | null;
  AssignedAt: string;
}

export interface RolePermission {
  RolePermPairID: number;
  RoleID: number;
  PermID: number;
}

export interface Shift {
  ShiftID: number;
  ShiftName: string;
  StartTime: string;
  EndTime: string;
  BranchID: number | null;
}
