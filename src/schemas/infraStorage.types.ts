// ==================== InfraStorage Schema ====================
// Child schema file for Infrastructure/Storage/Room entities
// Parent file: src/types/mastertype.ts

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
