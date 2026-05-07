// ==================== Auth Schema ====================
export interface SystemAccount {
  AccID: number;
  Email: string;
  Password: string; // plaintext for school project
  IsActive: boolean;
  LastLoginAt: string | null; // ISO datetime
  CreatedAt: string;
}

// ==================== Customer Schema ====================
export interface Booking {
  BookingID: number;
  CustomerID: number;
  BranchID: number;
  BookingDate: string;
  CheckIn: string; // YYYY-MM-DD
  CheckOut: string;
  NumberOfAdults: number;
  NumberOfChildren: number;
  SpecialRequest: string | null;
  StatusID: number;
  Source: string | null;
}

export interface BookingGuest {
  BookingGuestID: number;
  BookingID: number;
  FullName: string;
  DateOfBirth: string | null;
  IDNumber: string | null;
  IsMainGuest: boolean;
}

export interface BookingRoom {
  BookingRoomID: number;
  BookingID: number;
  RoomID: number;
  RateApplied: number | null;
  GuestName: string | null;
  CheckIn: string | null;
  CheckOut: string | null;
}

export interface BookingStatus {
  StatusID: number;
  StatusName: string;
  Description: string | null;
}

export interface CheckInOut {
  CheckID: number;
  BookingRoomID: number;
  CheckInTime: string | null;
  CheckOutTime: string | null;
  ActualCheckOut: string | null;
}

export interface Customer {
  CustomerID: number;
  AccID: number | null;
  FirstName: string;
  LastName: string;
  Phone: string | null;
  Nationality: string | null;
  DateOfBirth: string | null;
  IDNumber: string | null;
  IDType: string | null;
  Address: string | null;
  CreatedAt: string;
}

export interface CustomerPreference {
  PrefID: number;
  CustomerID: number;
  PreferenceKey: string;
  PreferenceValue: string | null;
}

export interface Feedback {
  FeedbackID: number;
  BookingID: number;
  Rating: number | null;
  Comment: string | null;
  CreatedAt: string;
}

export interface LoyaltyProgram {
  LoyaltyID: number;
  CustomerID: number;
  PointsBalance: number;
  TierID: number;
}

export interface LoyaltyTier {
  TierID: number;
  TierName: string;
  MinPoints: number;
  DiscountPercent: number;
}

export interface LoyaltyTransaction {
  TransID: number;
  CustomerID: number;
  PointsEarned: number | null;
  PointsRedeemed: number | null;
  BookingID: number | null;
  Description: string | null;
  CreatedAt: string;
}

// ==================== Finance Schema ====================
export interface AccountChart {
  AccountID: number;
  AccountCode: string;
  AccountName: string;
  Type: string;
}

export interface Bonus {
  BonusID: number;
  PayrollID: number;
  BonusType: string;
  Amount: number;
  Reason: string | null;
  RefRuleID: number | null;
}

export interface BonusRule {
  RuleID: number;
  RuleName: string;
  Criteria: string | null;
  BonusAmount: number;
  AppliedScope: string | null;
}

export interface DailyRevenue {
  RevID: number;
  BranchID: number;
  Date: string;
  RoomRevenue: number;
  ServiceRevenue: number;
  Total: number;
}

export interface Deduction {
  DeductID: number;
  PayrollID: number;
  DeductionType: string;
  Amount: number;
  RefRuleID: number | null;
}

export interface Expense {
  ExpenseID: number;
  BranchID: number;
  ExpenseType: string;
  ReferenceID: number | null;
  Amount: number;
  TaxAmount: number;
  ExpenseDate: string;
  ApprovedBy: number | null;
}

export interface FinancialTransaction {
  TransID: number;
  AccountID: number;
  InvoiceID: number | null;
  PaymentID: number | null;
  Debit: number;
  Credit: number;
  TransDate: string;
}

export interface GoodsReceipt {
  ReceiptID: number;
  POID: number;
  ReceivedDate: string;
  ReceivedBy: number;
  Status: string;
  Notes: string | null;
}

export interface GoodsReceiptItem {
  ReceiptItemID: number;
  ReceiptID: number;
  POItemID: number;
  ItemID: number;
  QuantityReceived: number;
  UnitCost: number;
  ExpiryDate: string | null;
}

export interface Invoice {
  InvoiceID: number;
  BookingID: number | null;
  CustomerID: number;
  InvoiceDate: string;
  TotalBeforeTax: number;
  TaxAmount: number;
  Total: number;
  Status: string;
}

export interface InvoiceItem {
  LineID: number;
  InvoiceID: number;
  ItemType: string;
  ReferenceID: number | null;
  Description: string | null;
  Quantity: number;
  UnitPrice: number;
  SubTotal: number;
}

export interface MaintenanceOrder {
  MOID: number;
  RequestID: number | null;
  SupplierID: number | null;
  InternalEmployeeID: number | null;
  PlannedCost: number;
  ActualCost: number | null;
  Status: string;
  PaymentDueDate: string | null;
}

export interface Payment {
  PaymentID: number;
  InvoiceID: number;
  PaymentMethodID: number;
  Amount: number;
  PaidAt: string;
  TransactionRef: string | null;
}

export interface PaymentMethod {
  MethodID: number;
  MethodName: string;
}

export interface PaymentOut {
  PaymentOutID: number;
  SupplierID: number | null;
  Payee: string | null;
  PaymentMethodID: number;
  Amount: number;
  PaidAt: string;
  TransactionRef: string | null;
  CreatedBy: number;
}

export interface PaymentOutAllocation {
  AllocID: number;
  PaymentOutID: number;
  ReferenceType: string;
  ReferenceID: number;
  AllocatedAmount: number;
}

export interface PayPeriod {
  PeriodID: number;
  StartDate: string;
  EndDate: string;
  BranchID: number;
  Status: string;
}

export interface PayrollItem {
  PayrollID: number;
  PeriodID: number;
  EmployeeID: number;
  TotalEarnings: number;
  TotalDeductions: number;
  NetPay: number;
  CalculatedAt: string;
}

export interface PurchaseOrder {
  POID: number;
  SupplierID: number;
  BranchID: number;
  CreatedByEmployeeID: number;
  OrderDate: string;
  Status: string;
  TotalAmount: number;
  ApprovedBy: number | null;
}

export interface PurchaseOrderItem {
  POItemID: number;
  POID: number;
  ItemType: string;
  ReferenceID: number | null;
  Description: string | null;
  Quantity: number;
  UnitPrice: number;
  SubTotal: number;
}

export interface ReportTemplate {
  TemplateID: number;
  Name: string;
  QuerySQL: string | null;
  CreatedBy: number | null;
}

export interface SalaryComponent {
  CompID: number;
  PayrollID: number;
  ComponentType: string;
  Amount: number;
}

export interface Supplier {
  SupplierID: number;
  SupplierName: string;
  ContactPerson: string | null;
  Phone: string | null;
  Email: string | null;
  Address: string | null;
  TaxCode: string | null;
}

export interface TaxConfig {
  TaxID: number;
  TaxName: string;
  Rate: number;
  EffectiveDate: string;
  EndDate: string | null;
}

// ==================== InfraStorage Schema ====================
export interface Amenity {
  AmenityID: number;
  Name: string;
  Description: string | null;
}

export interface AssetInventory {
  AssetID: number;
  BranchID: number;
  RoomID: number | null;
  AssetName: string;
  SerialNumber: string | null;
  PurchaseDate: string | null;
}

export interface Branch {
  BranchID: number;
  BranchName: string;
  Address: string | null;
  City: string | null;
  Phone: string | null;
  Email: string | null;
  ManagerEmployeeID: number | null;
}

export interface Building {
  BuildingID: number;
  BranchID: number;
  BuildingName: string;
  FloorsCount: number | null;
}

export interface Facility {
  FacilityID: number;
  BranchID: number;
  FacilityName: string;
  Type: string | null;
  InstallDate: string | null;
}

export interface FacilityStatusLog {
  LogID: number;
  FacilityID: number;
  Status: string | null;
  RecordedAt: string;
  Notes: string | null;
}

export interface Floor {
  FloorID: number;
  BuildingID: number;
  FloorNumber: number;
}

export interface MaintenanceRequest {
  RequestID: number;
  FacilityID: number | null;
  RoomID: number | null;
  ReportedBy: number;
  Issue: string;
  Priority: string | null;
  Status: string;
}

export interface MaintenanceSchedule {
  ScheduleID: number;
  FacilityID: number | null;
  RoomID: number | null;
  ScheduledDate: string;
  Type: string;
  AssignedTo: number | null;
}

export interface Room {
  RoomID: number;
  RoomNumber: string;
  FloorID: number;
  RoomTypeID: number;
  StatusID: number;
}

export interface RoomAmenity {
  RoomAmenityPairID: number;
  RoomID: number;
  AmenityID: number;
  Quantity: number;
}

export interface RoomStatus {
  StatusID: number;
  StatusName: string;
}

export interface RoomStatusHistory {
  HistID: number;
  RoomID: number;
  FromStatus: number | null;
  ToStatus: number;
  ChangedAt: string;
  ChangedBy: number | null;
}

export interface RoomType {
  RoomTypeID: number;
  TypeName: string;
  BaseCapacity: number;
  StandardRate: number;
  Description: string | null;
}

export interface ServiceCategory {
  CatID: number;
  Name: string;
  Description: string | null;
}

export interface ServiceInventory {
  InvID: number;
  BranchID: number;
  ItemID: number;
  StockQuantity: number;
  MinStockLevel: number;
}

export interface ServiceItem {
  ItemID: number;
  CategoryID: number;
  ItemName: string;
  Unit: string | null;
  Description: string | null;
}

export interface ServiceOrder {
  OrderID: number;
  BookingID: number | null;
  CustomerID: number | null;
  OrderDate: string;
  BranchID: number;
  TotalAmount: number;
  Status: string;
}

export interface ServiceOrderDetail {
  DetailID: number;
  OrderID: number;
  ServiceItemID: number;
  Quantity: number;
  UnitPrice: number;
  SubTotal: number;
}

export interface ServicePrice {
  PriceID: number;
  ItemID: number;
  BranchID: number;
  ValidFrom: string;
  ValidTo: string | null;
  Price: number;
}

export interface ServiceUsageLog {
  LogID: number;
  OrderID: number;
  RoomID: number | null;
  ServedAt: string;
  StaffID: number | null;
}

export interface UtilityMeter {
  MeterID: number;
  BranchID: number;
  MeterType: string;
  Unit: string;
}

export interface UtilityReading {
  ReadingID: number;
  MeterID: number;
  ReadingDate: string;
  Value: number;
}

// ==================== Marketing Schema ====================
export interface Campaign {
  CampaignID: number;
  PlanID: number | null;
  Name: string;
  StartDate: string;
  EndDate: string;
  Type: string;
  Description: string | null;
  Status: string;
  ManagerEmployeeID: number | null;
}

export interface CampaignBudget {
  BudgetID: number;
  CampaignID: number;
  BudgetItem: string;
  PlannedAmount: number;
  ActualAmount: number;
  Currency: string;
}

export interface CampaignChannel {
  ChannelID: number;
  CampaignID: number;
  ChannelType: string;
  AllocatedBudget: number;
  ActualSpend: number;
}

export interface CampaignObjective {
  ObjID: number;
  CampaignID: number;
  MetricName: string;
  TargetValue: number;
  Unit: string | null;
}

export interface CampaignPartner {
  CpgnPtnrPairID: number;
  EventID: number | null;
  PartnerID: number;
  Role: string | null;
  Contribution: string | null;
}

export interface CampaignPerformance {
  PerfID: number;
  CampaignID: number;
  ChannelID: number | null;
  Date: string;
  Metric: string;
  Value: number;
}

export interface Coupon {
  CouponID: number;
  Code: string;
  PromoID: number;
  IssuedTo: number | null;
  Status: string;
  ExpiryDate: string;
}

export interface Event {
  EventID: number;
  CampaignID: number | null;
  EventName: string;
  StartDate: string;
  EndDate: string;
  BranchID: number | null;
  Venue: string | null;
  Organizer: string | null;
  Status: string;
}

export interface EventBooking {
  BookID: number;
  EventID: number;
  CustomerID: number;
  BookingDate: string;
  NumberOfAttendees: number;
  SpecialRequest: string | null;
}

export interface EventService {
  ESID: number;
  EventBookingID: number;
  ServiceItemID: number;
  Quantity: number;
  Price: number;
}

export interface MarketingAsset {
  AssetID: number;
  CampaignID: number;
  AssetType: string;
  URL: string | null;
  Description: string | null;
}

export interface MarketingPlan {
  PlanID: number;
  Name: string;
  StartDate: string;
  EndDate: string;
  BranchID: number | null;
  BudgetTotal: number;
  Objective: string | null;
  Status: string;
}

export interface Partner {
  PartnerID: number;
  Name: string;
  Type: string;
  ContactInfo: string | null;
}

export interface Promotion {
  PromoID: number;
  CampaignID: number | null;
  PromoName: string;
  Description: string | null;
  DiscountType: string;
  Value: number;
  StartDate: string;
  EndDate: string;
}

export interface PromotionRule {
  RuleID: number;
  PromoID: number;
  RuleType: string;
  Value: string;
}

export interface PromotionUsage {
  UsageID: number;
  PromoID: number;
  BookingID: number;
  DiscountAmount: number;
  AppliedAt: string;
}

// ==================== Staff Schema ====================
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

// ==================== Root database object ====================
export interface LortelHomesDatabase {
  // Auth
  SystemAccount: SystemAccount[];
  // Customer
  Booking: Booking[];
  BookingGuest: BookingGuest[];
  BookingRoom: BookingRoom[];
  BookingStatus: BookingStatus[];
  CheckInOut: CheckInOut[];
  Customer: Customer[];
  CustomerPreference: CustomerPreference[];
  Feedback: Feedback[];
  LoyaltyProgram: LoyaltyProgram[];
  LoyaltyTier: LoyaltyTier[];
  LoyaltyTransaction: LoyaltyTransaction[];
  // Finance
  AccountChart: AccountChart[];
  Bonus: Bonus[];
  BonusRule: BonusRule[];
  DailyRevenue: DailyRevenue[];
  Deduction: Deduction[];
  Expense: Expense[];
  FinancialTransaction: FinancialTransaction[];
  GoodsReceipt: GoodsReceipt[];
  GoodsReceiptItem: GoodsReceiptItem[];
  Invoice: Invoice[];
  InvoiceItem: InvoiceItem[];
  MaintenanceOrder: MaintenanceOrder[];
  Payment: Payment[];
  PaymentMethod: PaymentMethod[];
  PaymentOut: PaymentOut[];
  PaymentOutAllocation: PaymentOutAllocation[];
  PayPeriod: PayPeriod[];
  PayrollItem: PayrollItem[];
  PurchaseOrder: PurchaseOrder[];
  PurchaseOrderItem: PurchaseOrderItem[];
  ReportTemplate: ReportTemplate[];
  SalaryComponent: SalaryComponent[];
  Supplier: Supplier[];
  TaxConfig: TaxConfig[];
  // InfraStorage
  Amenity: Amenity[];
  AssetInventory: AssetInventory[];
  Branch: Branch[];
  Building: Building[];
  Facility: Facility[];
  FacilityStatusLog: FacilityStatusLog[];
  Floor: Floor[];
  MaintenanceRequest: MaintenanceRequest[];
  MaintenanceSchedule: MaintenanceSchedule[];
  Room: Room[];
  RoomAmenity: RoomAmenity[];
  RoomStatus: RoomStatus[];
  RoomStatusHistory: RoomStatusHistory[];
  RoomType: RoomType[];
  ServiceCategory: ServiceCategory[];
  ServiceInventory: ServiceInventory[];
  ServiceItem: ServiceItem[];
  ServiceOrder: ServiceOrder[];
  ServiceOrderDetail: ServiceOrderDetail[];
  ServicePrice: ServicePrice[];
  ServiceUsageLog: ServiceUsageLog[];
  UtilityMeter: UtilityMeter[];
  UtilityReading: UtilityReading[];
  // Marketing
  Campaign: Campaign[];
  CampaignBudget: CampaignBudget[];
  CampaignChannel: CampaignChannel[];
  CampaignObjective: CampaignObjective[];
  CampaignPartner: CampaignPartner[];
  CampaignPerformance: CampaignPerformance[];
  Coupon: Coupon[];
  Event: Event[];
  EventBooking: EventBooking[];
  EventService: EventService[];
  MarketingAsset: MarketingAsset[];
  MarketingPlan: MarketingPlan[];
  Partner: Partner[];
  Promotion: Promotion[];
  PromotionRule: PromotionRule[];
  PromotionUsage: PromotionUsage[];
  // Staff
  Attendance: Attendance[];
  AttendanceRecord: AttendanceRecord[];
  Department: Department[];
  Employee: Employee[];
  EmployeeContract: EmployeeContract[];
  EmployeeShift: EmployeeShift[];
  LateRule: LateRule[];
  LeaveBalance: LeaveBalance[];
  LeaveRequest: LeaveRequest[];
  OvertimeRequest: OvertimeRequest[];
  PerformanceLog: PerformanceLog[];
  Permission: Permission[];
  Position: Position[];
  Role: Role[];
  RoleAssign: RoleAssign[];
  RolePermission: RolePermission[];
  Shift: Shift[];
}

export type MasterData = LortelHomesDatabase;